/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle
} from '@/components/ui/Drawer'
import { Progress } from '@/components/ui/Progress'
import { Loader2 } from 'lucide-react'
import { sendMessage } from '@/lib/messaging'
import { MessageType } from '@/core/types'

interface RecoveryApprovalScreenProps {
    request: {
        requestId: string
        type: 'recoverFromStorage'
        origin: string
        data: {
            storageAddresses: string[]
            tokenId: string
        }
    }
    onResponse: (approved: boolean) => Promise<void>
}

export const RecoveryApprovalScreen: React.FC<RecoveryApprovalScreenProps> = ({ request, onResponse }) => {
    const [address, setAddress] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(true)
    const [progressMessage, setProgressMessage] = useState('')
    const [progressValue, setProgressValue] = useState(0)
    const [processingRecovery, setProcessingRecovery] = useState(false)

    useEffect(() => {
        loadAddress()
    }, [])

    const loadAddress = async () => {
        try {
            const result = await sendMessage<{ address: string }>(MessageType.GET_ADDRESS)
            setAddress(result.address)
        } catch (err) {
            console.error('Failed to get address:', err)
        }
    }

    const handleApprove = async () => {
        try {
            setLoading(true)
            setProcessingRecovery(true)

            // Initial progress
            setProgressMessage('Preparing recovery...')
            setProgressValue(0)

            // Start polling for progress updates from chrome.storage.local
            const requestId = request.requestId
            const progressInterval = setInterval(async () => {
                const result = await chrome.storage.local.get(`recovery_progress_${requestId}`)
                const progress = result[`recovery_progress_${requestId}`]
                if (progress) {
                    setProgressMessage(progress.message)
                    setProgressValue(progress.value)
                }
            }, 200) // Poll every 200ms for smooth updates

            try {
                // Call onResponse which sends approval to background and waits for completion
                await onResponse(true)

                clearInterval(progressInterval)

                // Show success
                setProgressMessage('Recovery completed successfully!')
                setProgressValue(100)

                // Wait a moment to show success before closing
                await new Promise(resolve => setTimeout(resolve, 1500))

                // Only close after success - window.close() will happen automatically
                window.close()
            } catch (error) {
                clearInterval(progressInterval)

                console.error('Error recovering funds:', error)
                setProgressMessage(`Error: ${error instanceof Error ? error.message : 'Recovery failed'}`)
                setProgressValue(0)

                // Keep dialog open on error - reset state to allow retry
                setLoading(false)
                setProcessingRecovery(false)
            }
        } catch (error) {
            console.error('Error in handleApprove:', error)
            setProgressMessage('An unexpected error occurred')
            setProgressValue(0)
            setLoading(false)
            setProcessingRecovery(false)
        }
    }

    const handleReject = async () => {
        setLoading(true)
        await onResponse(false)
        // Close the popup window after rejection
        window.close()
    }

    const handleOpenChange = (newOpen: boolean) => {
        // Prevent closing the dialog while recovery is being processed
        if (processingRecovery) {
            return
        }

        setOpen(newOpen)
        // If drawer is being closed and we haven't already responded, count it as rejection
        if (!newOpen && !loading) {
            onResponse(false)
        }
    }

    const formatAddress = (addr: string) => {
        if (!addr) return ''
        if (addr.length <= 20) return addr
        return `${addr.slice(0, 10)}...${addr.slice(-10)}`
    }

    const storageAddresses = request.data?.storageAddresses || []
    const tokenId = request.data?.tokenId || ''

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerContent className='max-h-[96vh]'>
                <DrawerHeader>
                    <DrawerTitle>
                        {processingRecovery ? 'Recovering Funds' : 'Recover Funds Request'}
                    </DrawerTitle>
                    <DrawerDescription>
                        {processingRecovery
                            ? `Please wait while we recover tokens from ${storageAddresses.length} storage account${storageAddresses.length !== 1 ? 's' : ''}...`
                            : `A website is requesting to recover tokens from ${storageAddresses.length} storage account${storageAddresses.length !== 1 ? 's' : ''}`
                        }
                    </DrawerDescription>
                </DrawerHeader>

                {processingRecovery
                    ? (
                        <div className='px-4 py-8 flex-1 flex flex-col items-center justify-center'>
                            <div className='w-full max-w-md space-y-6'>
                                <div className='flex flex-col items-center gap-4'>
                                    <Loader2 className='h-16 w-16 animate-spin text-primary' />
                                    <div className='text-center'>
                                        <p className='text-lg font-medium'>{progressMessage || 'Processing...'}</p>
                                        <p className='text-sm text-muted-foreground mt-1'>
                                            This may take a few moments
                                        </p>
                                    </div>
                                </div>

                                <div className='w-full'>
                                    <Progress value={progressValue} className='w-full h-2' />
                                    <p className='text-xs text-center text-muted-foreground mt-2'>
                                        {progressValue}% complete
                                    </p>
                                </div>

                                <div className='p-3 bg-blue-500/10 border border-blue-500 rounded-md'>
                                    <p className='text-sm text-blue-600 dark:text-blue-400'>
                                        ℹ️ Do not close this window until recovery is complete
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                    : (
                        <div className='px-4 overflow-y-auto flex-1'>
                            <div className='space-y-4 pb-4'>
                                <div>
                                    <p className='text-sm font-medium'>Website</p>
                                    <p className='text-sm text-muted-foreground font-mono break-all'>
                                        {request.origin}
                                    </p>
                                </div>

                                <div>
                                    <p className='text-sm font-medium'>Your Address</p>
                                    <p className='text-sm text-muted-foreground font-mono break-all text-xs'>
                                        {address || 'Loading...'}
                                    </p>
                                </div>

                                <div>
                                    <p className='text-sm font-medium'>Token Address</p>
                                    <p className='text-sm text-muted-foreground font-mono break-all text-xs'>
                                        {tokenId}
                                    </p>
                                </div>

                                <div className='p-3 bg-muted rounded-md max-h-64 overflow-y-auto'>
                                    <p className='text-sm font-medium mb-2'>
                                        Storage Accounts ({storageAddresses.length}):
                                    </p>
                                    {storageAddresses.map((addr, index) => (
                                        <div key={index} className='mb-2 pb-2 border-b border-border last:border-0'>
                                            <p className='text-xs font-mono'>{formatAddress(addr)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className='p-3 bg-blue-500/10 border border-blue-500 rounded-md'>
                                    <p className='text-sm text-blue-600 dark:text-blue-400'>
                                        ℹ️ This will recover any remaining tokens from these storage accounts back to your wallet
                                    </p>
                                </div>

                                <div className='p-3 border border-yellow-500 bg-yellow-500/10 rounded-md'>
                                    <p className='text-sm text-yellow-600 dark:text-yellow-400'>
                                        ⚠️ Only approve if you recognize these storage accounts
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                }

                <DrawerFooter>
                    {!processingRecovery && (
                        <div className='flex gap-2 w-full'>
                            <Button
                                variant='outline'
                                className='flex-1'
                                onClick={handleReject}
                                disabled={loading}
                            >
                                Reject
                            </Button>
                            <Button
                                className='flex-1'
                                onClick={handleApprove}
                                disabled={loading}
                            >
                                {loading ? 'Approving...' : 'Approve Recovery'}
                            </Button>
                        </div>
                    )}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
