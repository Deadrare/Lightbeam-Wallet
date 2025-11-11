import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/AlertDialog'
import { sendMessage } from '@/lib/messaging'
import { MessageType } from '@/core/types'
import { clearStorage } from '@/core/storage'

interface UnlockScreenProps {
    onUnlocked: () => void
}

export const UnlockScreen: React.FC<UnlockScreenProps> = ({ onUnlocked }) => {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [resetting, setResetting] = useState(false)

    const handleResetWallet = async () => {
        setResetting(true)
        try {
            await clearStorage()
            window.location.reload()
        } catch (err) {
            console.error('Failed to reset wallet:', err)
            setError('Failed to reset wallet')
            setResetting(false)
        }
    }

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await sendMessage(MessageType.UNLOCK_WALLET, { password })
            onUnlocked()
        } catch (err: any) {
            setError(err.message || 'Incorrect password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='p-6 space-y-4'>
            <div className='text-center space-y-2 py-4'>
                <h1 className='text-2xl font-bold'>Lightbeam Wallet</h1>
                <p className='text-sm text-muted-foreground'>Enter password to unlock</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Unlock Wallet</CardTitle>
                    <CardDescription>Your wallet is locked</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUnlock} className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='password'>Password</Label>
                            <Input
                                id='password'
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter your password'
                                autoFocus
                            />
                        </div>
                        {error && <div className='text-sm text-destructive'>{error}</div>}
                        <Button type='submit' disabled={loading || !password} className='w-full'>
                            {loading ? 'Unlocking...' : 'Unlock'}
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant='ghost'
                                    disabled={resetting}
                                    className='w-full'
                                >
                                    Reset & Wipe Wallet
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        wallet and all associated data from this device. Make sure you have
                                        your recovery phrase saved before proceeding.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleResetWallet}
                                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                    >
                                        {resetting ? 'Resetting...' : 'Reset & Wipe'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
