/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle
} from '@/components/ui/Drawer'
import { AlertCircle } from 'lucide-react'
import type { NetworkType } from '@/config'

interface NetworkSwitchScreenProps {
    request: {
        requestId: string
        type: 'network-switch'
        origin: string
        data: {
            currentNetwork: NetworkType
            requestedNetwork: NetworkType
        }
    }
    onResponse: (approved: boolean) => void
}

export const NetworkSwitchScreen: React.FC<NetworkSwitchScreenProps> = ({ request, onResponse }) => {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(true)

    const networkNames = {
        test: 'Testnet',
        main: 'Mainnet'
    }

    const { currentNetwork, requestedNetwork } = request.data

    const handleApprove = async () => {
        setLoading(true)
        setOpen(false)
        onResponse(true)
    }

    const handleReject = async () => {
        setLoading(true)
        setOpen(false)
        onResponse(false)
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            handleReject()
        }
    }

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerContent>
                <DrawerHeader className='text-left'>
                    <div className='flex items-center gap-2 mb-2'>
                        <AlertCircle className='h-5 w-5 text-yellow-500' />
                        <DrawerTitle>Network Switch Required</DrawerTitle>
                    </div>
                    <DrawerDescription className='text-left space-y-3'>
                        <div className='p-3 bg-muted rounded-lg'>
                            <div className='text-sm font-medium mb-1'>Origin</div>
                            <div className='text-xs text-muted-foreground break-all'>
                                {request.origin}
                            </div>
                        </div>

                        <div className='text-sm'>
                            This application is requesting to connect to <strong>{networkNames[requestedNetwork]}</strong>.
                        </div>

                        <div className='p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg'>
                            <div className='text-sm'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <AlertCircle className='h-4 w-4 text-yellow-500' />
                                    <span className='font-medium'>Network Change</span>
                                </div>
                                <div className='text-xs text-muted-foreground'>
                                    Current network: <strong>{networkNames[currentNetwork]}</strong>
                                    <br />
                                    Requested network: <strong>{networkNames[requestedNetwork]}</strong>
                                </div>
                            </div>
                        </div>

                        <div className='text-xs text-muted-foreground'>
                            Approving will switch your wallet to {networkNames[requestedNetwork]} and
                            allow this application to connect.
                        </div>
                    </DrawerDescription>
                </DrawerHeader>

                <DrawerFooter className='pt-2'>
                    <div className='flex gap-2 w-full'>
                        <Button
                            variant='outline'
                            onClick={handleReject}
                            disabled={loading}
                            className='flex-1'
                        >
                            Reject
                        </Button>
                        <Button
                            onClick={handleApprove}
                            disabled={loading}
                            className='flex-1'
                        >
                            {loading ? 'Switching...' : 'Switch Network'}
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
