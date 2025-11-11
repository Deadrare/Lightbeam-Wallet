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
import { sendMessage } from '@/lib/messaging'
import { MessageType } from '@/core/types'

interface ApprovalScreenProps {
    request: {
        requestId: string
        type: 'connect' | 'transaction' | 'storagePool'
        origin: string
        data?: any
    }
    onResponse: (approved: boolean) => void
}

export const ApprovalScreen: React.FC<ApprovalScreenProps> = ({ request, onResponse }) => {
    const [address, setAddress] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(true)

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
        setLoading(true)
        setOpen(false)
        onResponse(true)
        // Close the popup window after approval
        setTimeout(() => window.close(), 100)
    }

    const handleReject = async () => {
        setLoading(true)
        setOpen(false)
        onResponse(false)
        // Close the popup window after rejection
        setTimeout(() => window.close(), 100)
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        // If drawer is being closed and we haven't already responded, count it as rejection
        if (!newOpen && !loading) {
            onResponse(false)
        }
    }

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerContent className='max-h-[96vh]'>
                <DrawerHeader>
                    <DrawerTitle>
                        {request.type === 'connect' && 'Connection Request'}
                        {request.type === 'transaction' && 'Transaction Request'}
                        {request.type === 'storagePool' && 'Storage Pool Activation'}
                    </DrawerTitle>
                    <DrawerDescription>
                        {request.type === 'storagePool'
                            ? 'Activate pre-generated storage accounts for faster order creation'
                            : 'A website is requesting access to your wallet'}
                    </DrawerDescription>
                </DrawerHeader>

                <div className='px-4 overflow-y-auto flex-1'>
                    <div className='space-y-4 pb-4'>
                        {request.type !== 'storagePool' && (
                            <>
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
                            </>
                        )}

                        {request.type === 'connect' && (
                            <div className='p-3 bg-muted rounded-md'>
                                <p className='text-sm font-medium mb-2'>
                                    This site is requesting to:
                                </p>
                                <ul className='list-disc list-inside text-sm text-muted-foreground space-y-1'>
                                    <li>View your wallet address</li>
                                    <li>Request approval for transactions</li>
                                </ul>
                            </div>
                        )}

                        {request.type === 'storagePool' && (
                            <>
                                <div className='p-3 bg-muted rounded-md'>
                                    <p className='text-sm font-medium mb-2'>
                                        Storage Pool Benefits:
                                    </p>
                                    <ul className='list-disc list-inside text-sm text-muted-foreground space-y-1'>
                                        <li>Up to 200 pre-generated storage accounts</li>
                                        <li>Faster order creation (no waiting for account generation)</li>
                                        <li>Automatic refilling in the background</li>
                                        <li>Reduced transaction delays</li>
                                    </ul>
                                </div>

                                <div className='p-3 border border-blue-500 bg-blue-500/10 rounded-md'>
                                    <p className='text-sm text-blue-600 dark:text-blue-400'>
                                        ℹ️ This will create storage accounts on the blockchain. Small fees may apply.
                                    </p>
                                </div>
                            </>
                        )}

                        {request.type === 'connect' && (
                            <div className='p-3 border border-yellow-500 bg-yellow-500/10 rounded-md'>
                                <p className='text-sm text-yellow-600 dark:text-yellow-400'>
                                    ⚠️ Only connect to websites you trust
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DrawerFooter>
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
                            {loading ? 'Approving...' : 'Approve'}
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
