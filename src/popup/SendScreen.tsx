import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { sendMessage } from '@/lib/messaging'
import { MessageType } from '@/core/types'
import { isValidKeetaAddress } from '@/lib/utils'

interface SendScreenProps {
    onBack: () => void
    token?: string
    tokenName?: string
    tokenDecimals?: number
    tokenBalance?: string
}

export const SendScreen: React.FC<SendScreenProps> = ({ onBack, token, tokenName, tokenDecimals, tokenBalance }) => {
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Require actual data - no defaults
    if (!token || !tokenName || tokenDecimals === undefined) {
        return (
            <div className='space-y-4'>
                <div className='text-sm text-destructive bg-destructive/10 p-3 rounded-md'>
                    Token data not loaded. Please try again.
                </div>
                <Button onClick={onBack} variant='outline' className='w-full'>
                    Back
                </Button>
            </div>
        )
    }

    const displayToken = tokenName
    const sendToken = token
    const decimals = tokenDecimals

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        // Validate recipient
        if (!isValidKeetaAddress(recipient)) {
            setError('Invalid Keeta address')
            return
        }

        // Validate amount
        if (!amount || parseFloat(amount) <= 0) {
            setError('Invalid amount')
            return
        }

        setLoading(true)

        try {
            // Parse amount to smallest unit using token's decimals (like lightbeam)
            const parsedAmount = new BigNumber(amount).shiftedBy(decimals).toString()

            // Send transaction
            await sendMessage(MessageType.SEND_TRANSACTION, {
                to: recipient,
                amount: parsedAmount,
                token: sendToken
            })

            setSuccess(true)
            setRecipient('')
            setAmount('')

            // Go back after 2 seconds
            setTimeout(() => {
                onBack()
            }, 2000)
        } catch (err) {
            const error = err as Error
            setError(error.message || 'Failed to send transaction')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='space-y-4'>
            <form onSubmit={handleSend} className='space-y-4'>
                <div className='space-y-2'>
                    <Label htmlFor='recipient'>Recipient Address</Label>
                    <Input
                        id='recipient'
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder='keeta_...'
                        disabled={loading || success}
                    />
                </div>

                <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                        <Label htmlFor='amount'>Amount ({displayToken})</Label>
                        {tokenBalance && (
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => {
                                    const maxAmount = new BigNumber(tokenBalance).shiftedBy(-decimals).toString()
                                    setAmount(maxAmount)
                                }}
                                disabled={loading || success}
                                className='h-6 px-2 text-xs'
                            >
                                Max
                            </Button>
                        )}
                    </div>
                    <Input
                        id='amount'
                        type='number'
                        step='0.0001'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder='0.0'
                        disabled={loading || success}
                    />
                </div>

                {error && (
                    <div className='text-sm text-destructive bg-destructive/10 p-3 rounded-md'>
                        {error}
                    </div>
                )}

                {success && (
                    <div className='text-sm text-green-500 bg-green-500/10 p-3 rounded-md'>
                        Transaction sent successfully! Closing...
                    </div>
                )}

                <div className='flex gap-2'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={onBack}
                        disabled={loading}
                        className='flex-1'
                    >
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        disabled={loading || success || !recipient || !amount}
                        className='flex-1'
                    >
                        {loading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                        Send
                    </Button>
                </div>
            </form>
        </div>
    )
}
