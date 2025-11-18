import React, { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle
} from '@/components/ui/Drawer'
import { StagingConfig, ProductionConfig } from '@/config'
import { truncateAddress } from '@/lib/utils'

interface SendApprovalScreenProps {
    to: string
    amount: string // Raw amount in base units
    token: string
    origin: string
    onApprove: () => void
    onReject: () => void
    network: 'test' | 'main'
}

interface TokenMetadata {
    name: string
    decimals: number
}

/**
 * Fetch token metadata from Keeta blockchain
 */
async function fetchTokenMetadata (
    tokenAddress: string,
    networkConfig: typeof StagingConfig | typeof ProductionConfig
): Promise<TokenMetadata | null> {
    try {
        const response = await fetch(`${networkConfig.KEETA_API_URL}/node/ledger/account/${tokenAddress}`)
        if (!response.ok) {
            return null
        }
        const data = await response.json()

        // Decode the metadata field if it exists
        let decimalPlaces = 9 // Default to 9 decimals
        if (data.info?.metadata) {
            try {
                const decodedMetadata = JSON.parse(atob(data.info.metadata))
                decimalPlaces = decodedMetadata.decimalPlaces || 0
            } catch (e) {
                console.error('Failed to decode metadata for', tokenAddress, e)
            }
        }

        return {
            name: data.info?.name || tokenAddress.slice(0, 10),
            decimals: decimalPlaces
        }
    } catch (error) {
        console.error('Failed to fetch metadata for', tokenAddress, error)
        return null
    }
}

export const SendApprovalScreen: React.FC<SendApprovalScreenProps> = ({
    to,
    amount,
    token,
    origin,
    onApprove,
    onReject,
    network
}) => {
    const [loading, setLoading] = useState(true)
    const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)

    const loadTokenMetadata = async () => {
        setLoading(true)
        setError(null)
        try {
            const networkConfig = network === 'main' ? ProductionConfig : StagingConfig
            const metadata = await fetchTokenMetadata(token, networkConfig)

            if (metadata) {
                setTokenMetadata(metadata)
            } else {
                setError('Failed to fetch token metadata')
            }
        } catch (err) {
            console.error('Failed to load token metadata:', err)
            setError('Failed to load token data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTokenMetadata()
    }, [token, network])

    const displayAmount = tokenMetadata
        ? (() => {
            try {
                // Amount is in base units (string), need to shift by decimals
                const amountBigInt = BigInt(amount)
                const divisor = 10n ** BigInt(tokenMetadata.decimals)
                const wholePart = amountBigInt / divisor
                const fractionalPart = amountBigInt % divisor
                const fractionalStr = fractionalPart.toString().padStart(tokenMetadata.decimals, '0')
                const trimmedFractional = fractionalStr.replace(/0+$/, '')

                if (trimmedFractional) {
                    return `${wholePart.toString()}.${trimmedFractional}`
                }
                return wholePart.toString()
            } catch {
                return '0'
            }
        })()
        : '...'

    const tokenName = tokenMetadata?.name || truncateAddress(token, 8)

    const handleApprove = async () => {
        setIsProcessing(true)
        setOpen(false)
        onApprove()
        // Close the popup window after approval
        setTimeout(() => window.close(), 100)
    }

    const handleReject = async () => {
        setIsProcessing(true)
        setOpen(false)
        onReject()
        // Close the popup window after rejection
        setTimeout(() => window.close(), 100)
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        // If drawer is being closed and we haven't already responded, count it as rejection
        if (!newOpen && !isProcessing) {
            onReject()
        }
    }

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerContent className='max-h-[96vh]'>
                <DrawerHeader>
                    <DrawerTitle>Send Transaction</DrawerTitle>
                    <DrawerDescription>
                        Review and confirm this transaction
                    </DrawerDescription>
                </DrawerHeader>

                <div className='px-4 overflow-y-auto flex-1'>
                    {loading
                        ? (
                            <div className='space-y-4 pb-4'>
                                <div className='space-y-2'>
                                    <Skeleton className='h-6 w-32' />
                                    <Skeleton className='h-4 w-48' />
                                </div>
                                <Card className='p-4 space-y-3'>
                                    <Skeleton className='h-16 w-full' />
                                    <Skeleton className='h-12 w-full' />
                                    <Skeleton className='h-12 w-full' />
                                </Card>
                            </div>
                        )
                        : error
                            ? (
                                <div className='space-y-4 pb-4'>
                                    <div className='flex items-center gap-2 text-destructive'>
                                        <AlertCircle className='w-5 h-5' />
                                        <h3 className='text-lg font-semibold'>Error</h3>
                                    </div>
                                    <Card className='p-4'>
                                        <p className='text-sm text-muted-foreground'>{error}</p>
                                    </Card>
                                    <Button
                                        onClick={loadTokenMetadata}
                                        variant='outline'
                                        className='w-full'
                                    >
                                        Retry
                                    </Button>
                                </div>
                            )
                            : (
                                <div className='space-y-4 pb-4'>
                                    {/* Transaction Details */}
                                    <Card className='p-4 space-y-4'>
                                        {/* Amount */}
                                        <div className='text-center space-y-1 py-2'>
                                            <div className='text-3xl font-bold'>
                                                {displayAmount}
                                            </div>
                                            <div className='text-sm text-muted-foreground'>
                                                {tokenName}
                                            </div>
                                        </div>

                                        <div className='h-px bg-border' />

                                        {/* Recipient */}
                                        <div className='space-y-1'>
                                            <div className='text-xs text-muted-foreground uppercase tracking-wide'>
                                                To
                                            </div>
                                            <div className='text-sm font-mono break-all'>
                                                {to}
                                            </div>
                                        </div>

                                        {/* Website Origin */}
                                        <div className='space-y-1'>
                                            <div className='text-xs text-muted-foreground uppercase tracking-wide'>
                                                Website
                                            </div>
                                            <div className='text-sm font-mono break-all'>
                                                {origin}
                                            </div>
                                        </div>

                                        {/* Network */}
                                        <div className='space-y-1'>
                                            <div className='text-xs text-muted-foreground uppercase tracking-wide'>
                                                Network
                                            </div>
                                            <div className='text-sm'>
                                                {network === 'test' ? 'Testnet' : 'Mainnet'}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            )}
                </div>

                <DrawerFooter>
                    <div className='flex gap-2 w-full'>
                        <Button
                            variant='outline'
                            className='flex-1'
                            onClick={handleReject}
                            disabled={isProcessing || loading}
                        >
                            Reject
                        </Button>
                        <Button
                            className='flex-1'
                            onClick={handleApprove}
                            disabled={isProcessing || loading || !!error}
                        >
                            {isProcessing ? 'Approving...' : 'Approve'}
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
