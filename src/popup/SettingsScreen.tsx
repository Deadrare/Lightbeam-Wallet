/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect } from 'react'
import { ArrowLeft, ListOrdered } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { Label } from '@/components/ui/Label'
import { Separator } from '@/components/ui/Separator'
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
import type { NetworkType } from '@/config'

interface SettingsScreenProps {
    onBack: () => void
    onNavigateToOrders?: () => void
}
export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onNavigateToOrders }) => {
    const [autoExtendOrders, setAutoExtendOrders] = useState(false)
    const [storagePoolEnabled, setStoragePoolEnabled] = useState(false)
    const [storagePoolSize, setStoragePoolSize] = useState(0)
    const [network, setNetwork] = useState<NetworkType>('test')
    const [loading, setLoading] = useState(true)
    const [resetting, setResetting] = useState(false)

    useEffect(() => {
        loadSettings()
    }, [])

    const handleResetWallet = async () => {
        setResetting(true)
        try {
            await clearStorage()
            window.location.reload()
        } catch (err) {
            console.error('Failed to reset wallet:', err)
            setResetting(false)
        }
    }

    const loadSettings = async () => {
        setLoading(true)
        try {
            const response = await sendMessage<{ enabled: boolean }>(MessageType.GET_AUTO_EXTEND_SETTING)
            setAutoExtendOrders(response.enabled)

            const poolResponse = await sendMessage<{ enabled: boolean }>(MessageType.GET_STORAGE_POOL_ENABLED)
            setStoragePoolEnabled(poolResponse.enabled)

            const sizeResponse = await sendMessage<{ size: number }>(MessageType.GET_STORAGE_POOL_SIZE)
            setStoragePoolSize(sizeResponse.size)

            const networkResponse = await sendMessage<{ network: NetworkType }>(MessageType.GET_NETWORK)
            setNetwork(networkResponse.network)
        } catch (err) {
            console.error('Failed to load settings:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAutoExtendToggle = async (checked: boolean) => {
        setAutoExtendOrders(checked)
        try {
            await sendMessage(MessageType.SET_AUTO_EXTEND_SETTING, { enabled: checked })
        } catch (err) {
            console.error('Failed to save auto-extend setting:', err)
            // Revert on error
            setAutoExtendOrders(!checked)
        }
    }

    const handleStoragePoolToggle = async (checked: boolean) => {
        setStoragePoolEnabled(checked)
        try {
            await sendMessage(MessageType.SET_STORAGE_POOL_ENABLED, { enabled: checked })
            // Reload pool size after toggling
            const sizeResponse = await sendMessage<{ size: number }>(MessageType.GET_STORAGE_POOL_SIZE)
            setStoragePoolSize(sizeResponse.size)
        } catch (err) {
            console.error('Failed to save storage pool setting:', err)
            // Revert on error
            setStoragePoolEnabled(!checked)
        }
    }

    const handleNetworkChange = async (newNetwork: NetworkType) => {
        const previousNetwork = network
        setNetwork(newNetwork)
        try {
            await sendMessage(MessageType.SET_NETWORK, { network: newNetwork })
        } catch (err) {
            console.error('Failed to change network:', err)
            // Revert on error
            setNetwork(previousNetwork)
        }
    }

    return (
        <div className='p-4 space-y-6'>
            {/* Header */}
            <div className='flex items-center gap-3'>
                <Button variant='ghost' size='sm' onClick={onBack}>
                    <ArrowLeft className='w-4 h-4' />
                </Button>
                <h1 className='text-xl font-bold'>Settings</h1>
            </div>

            <Separator />

            {/* Network Setting */}
            <div className='space-y-4'>
                <div className='space-y-1'>
                    <Label className='text-base font-medium'>
                        Network
                    </Label>
                    <p className='text-sm text-muted-foreground'>
                        Select which network to connect to
                    </p>
                </div>
                <div className='flex gap-2'>
                    <Button
                        variant={network === 'test' ? 'default' : 'outline'}
                        className='flex-1'
                        onClick={() => handleNetworkChange('test')}
                        disabled={loading}
                    >
                        Testnet
                    </Button>
                    <Button
                        variant={network === 'main' ? 'default' : 'outline'}
                        className='flex-1'
                        onClick={() => handleNetworkChange('main')}
                        disabled={loading}
                    >
                        Mainnet
                    </Button>
                </div>
                {network === 'main' && (
                    <p className='text-xs text-yellow-500'>
                        ⚠️ You are connected to Mainnet. Real funds will be used.
                    </p>
                )}
            </div>

            <Separator />

            {/* Auto-extend Orders Setting */}
            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <div className='space-y-1'>
                        <Label htmlFor='auto-extend' className='text-base font-medium'>
                            Auto-extend Orders
                        </Label>
                        <p className='text-sm text-muted-foreground'>
                            Automatically extend orders when they have less than 6 days remaining
                        </p>
                    </div>
                    <Switch
                        id='auto-extend'
                        checked={autoExtendOrders}
                        onCheckedChange={handleAutoExtendToggle}
                        disabled={loading}
                    />
                </div>

                {/* View Orders Button */}
                {onNavigateToOrders && (
                    <Button
                        variant='outline'
                        className='w-full'
                        onClick={onNavigateToOrders}
                    >
                        <ListOrdered className='w-4 h-4 mr-2' />
                        View My Orders
                    </Button>
                )}
            </div>

            <Separator />

            {/* Storage Pool Setting */}
            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <div className='space-y-1'>
                        <Label htmlFor='storage-pool' className='text-base font-medium'>
                            Activate Storage Pool
                        </Label>
                        <p className='text-sm text-muted-foreground'>
                            Pre-generate up to 120 storage accounts for faster order creation
                        </p>
                        {storagePoolSize > 0 && (
                            <p className='text-xs text-muted-foreground'>
                                Current pool: {storagePoolSize} accounts
                            </p>
                        )}
                    </div>
                    <Switch
                        id='storage-pool'
                        checked={storagePoolEnabled}
                        onCheckedChange={handleStoragePoolToggle}
                        disabled={loading}
                    />
                </div>
            </div>

            <Separator />

            {/* Danger Zone */}
            <div className='space-y-4'>
                <div className='space-y-2'>
                    <Label className='text-base font-medium text-destructive'>
                        Danger Zone
                    </Label>
                    <p className='text-sm text-muted-foreground'>
                        Permanently delete your wallet and all data
                    </p>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant='outline'
                            disabled={resetting}
                            className='w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground'
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
            </div>
        </div>
    )
}
