/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect } from 'react'
import { ArrowLeft, Loader2, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Separator } from '@/components/ui/Separator'
import { sendMessage } from '@/lib/messaging'
import { MessageType } from '@/core/types'
import { listOpenAtomicOrdersFullChain } from '@/queries/listOpenAtomicOrdersFullChain'
import { formatKTA, truncateAddress } from '@/lib/utils'
import { config } from '@/config'

interface OrdersScreenProps {
    onBack: () => void
}

interface Order {
    id: string | number
    escrowAddress: string
    firstTokenAddress: string
    secondTokenAddress: string
    buyAmount: string
    sellAmount: string
    orderType: boolean
    validUntil: string
    createdAt: string
}

interface ExtendProgress {
    orderId: string
    status: 'generating' | 'uploading' | 'registering' | 'completed' | 'failed'
    progress: number
    total: number
    error?: string
    startTime: number
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ onBack }) => {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [currentlyExtending, setCurrentlyExtending] = useState<string | null>(null)
    const [extendProgress, setExtendProgress] = useState<Record<string, ExtendProgress>>({})

    useEffect(() => {
        loadOrders()

        // Poll for currently extending order from chrome.storage
        const interval = setInterval(checkExtendingStatus, 500)
        return () => clearInterval(interval)
    }, [])

    const checkExtendingStatus = async () => {
        const result = await chrome.storage.local.get('currentlyExtendingOrder')
        setCurrentlyExtending(result.currentlyExtendingOrder || null)

        // Check progress for all orders
        const storage = await chrome.storage.local.get(null)
        const progressData: Record<string, ExtendProgress> = {}

        console.log('[OrdersScreen] Checking storage for progress...')
        const now = Date.now()
        const keysToRemove: string[] = []

        for (const key in storage) {
            if (key.startsWith('order_extend_progress_')) {
                const progress = storage[key] as ExtendProgress
                console.log('[OrdersScreen] Found progress for order:', progress.orderId, progress)

                // Clean up completed or failed progress after 5 seconds
                if ((progress.status === 'completed' || progress.status === 'failed') &&
                    (now - progress.startTime) > 5000) {
                    keysToRemove.push(key)
                    continue
                }

                progressData[progress.orderId] = progress
            }
        }

        // Remove old completed/failed progress items
        if (keysToRemove.length > 0) {
            console.log('[OrdersScreen] Cleaning up old progress items:', keysToRemove)
            await chrome.storage.local.remove(keysToRemove)
        }

        if (Object.keys(progressData).length > 0) {
            console.log('[OrdersScreen] Setting progress data:', progressData)
        }
        setExtendProgress(progressData)
    }

    const loadOrders = async () => {
        setLoading(true)
        try {
            const addressData = await sendMessage<{ address: string }>(MessageType.GET_ADDRESS)

            // Calculate expiresAfter threshold (6 days from now to match background alarm)
            const thresholdDate = new Date()
            thresholdDate.setDate(thresholdDate.getDate() + config.AUTO_EXTEND_THRESHOLD_DAYS)
            const expiresAfter = thresholdDate.toISOString()

            const ordersList = await listOpenAtomicOrdersFullChain(addressData.address, expiresAfter)
            setOrders(ordersList)
        } catch (err) {
            console.error('Failed to load orders:', err)
        } finally {
            setLoading(false)
        }
    }

    const getTimeRemaining = (expiresAt: string): string => {
        const now = Date.now()
        const expires = new Date(expiresAt).getTime()
        const diff = expires - now

        if (diff <= 0) return 'Expired'

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

        if (days > 0) {
            return `${days}d ${hours}h`
        }
        return `${hours}h`
    }

    const getExpiryStatus = (expiresAt: string): 'expiring' | 'healthy' | 'unknown' => {
        const now = Date.now()
        const expires = new Date(expiresAt).getTime()
        const diff = expires - now
        const thresholdMs = config.AUTO_EXTEND_THRESHOLD_DAYS * 24 * 60 * 60 * 1000

        if (diff <= 0) return 'expiring'
        if (diff < thresholdMs) return 'expiring'
        return 'healthy'
    }

    return (
        <div className='p-4 space-y-6'>
            {/* Header */}
            <div className='flex items-center gap-3'>
                <Button variant='ghost' size='sm' onClick={onBack}>
                    <ArrowLeft className='w-4 h-4' />
                </Button>
                <h1 className='text-xl font-bold'>Expired Orders</h1>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={loadOrders}
                    disabled={loading}
                    className='ml-auto'
                >
                    Refresh
                </Button>
            </div>

            <Separator />

            {/* Orders List */}
            <div className='space-y-3'>
                {loading
                    ? (
                        <>
                            <Skeleton className='h-24 w-full' />
                            <Skeleton className='h-24 w-full' />
                            <Skeleton className='h-24 w-full' />
                        </>
                    )
                    : orders.length === 0
                        ? (
                            <div className='text-center py-12 text-muted-foreground'>
                                <p>No expired orders found</p>
                            </div>
                        )
                        : (
                            orders.map((order) => {
                                const isExtending = order.id === currentlyExtending
                                const progress = extendProgress[String(order.id)]
                                const status = getExpiryStatus(order.validUntil)
                                const timeRemaining = getTimeRemaining(order.validUntil)

                                return (
                                    <div
                                        key={order.id}
                                        className={`p-4 rounded-lg border ${
                                            isExtending || progress
                                                ? 'border-primary bg-primary/5'
                                                : status === 'expiring'
                                                    ? 'border-yellow-500/50 bg-yellow-500/5'
                                                    : 'border-border bg-background-2'
                                        }`}
                                    >
                                        {/* Extension Progress */}
                                        {progress && (
                                            <div className='mb-3 space-y-2'>
                                                <div className='flex items-center gap-2'>
                                                    {progress.status === 'failed'
                                                        ? (
                                                            <span className='text-xs font-medium text-red-500'>
                                                                Failed: {progress.error}
                                                            </span>
                                                        )
                                                        : progress.status === 'completed'
                                                            ? (
                                                                <span className='text-xs font-medium text-green-500 flex items-center gap-1'>
                                                                    <CheckCircle2 className='w-3 h-3' />
                                                                    Extension completed!
                                                                </span>
                                                            )
                                                            : (
                                                                <>
                                                                    <Loader2 className='w-3 h-3 animate-spin text-primary' />
                                                                    <span className='text-xs font-medium text-primary'>
                                                                        {progress.status === 'generating' && `Generating blocks: ${progress.progress}/${progress.total}`}
                                                                        {progress.status === 'uploading' && 'Uploading blocks...'}
                                                                        {progress.status === 'registering' && 'Registering with order...'}
                                                                    </span>
                                                                </>
                                                            )}
                                                </div>
                                                {progress.status === 'generating' && progress.total > 0 && (
                                                    <div className='w-full bg-background-3 rounded-full h-1.5'>
                                                        <div
                                                            className='bg-primary h-1.5 rounded-full transition-all duration-300'
                                                            style={{ width: `${(progress.progress / progress.total) * 100}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Currently Extending Badge (fallback for old system) */}
                                        {isExtending && !progress && (
                                            <div className='flex items-center gap-2 mb-2 text-primary'>
                                                <Loader2 className='w-4 h-4 animate-spin' />
                                                <span className='text-xs font-medium'>Extending...</span>
                                            </div>
                                        )}

                                        {/* Order Type */}
                                        <div className='flex items-center justify-between mb-2'>
                                            <span className={`text-sm font-medium ${
                                                order.orderType ? 'text-green-500' : 'text-red-500'
                                            }`}>
                                                {order.orderType ? 'BUY' : 'SELL'}
                                            </span>
                                            <span className='text-xs text-muted-foreground'>
                                                ID: {order.id}
                                            </span>
                                        </div>

                                        {/* Amounts */}
                                        <div className='space-y-1 mb-3'>
                                            <div className='text-sm'>
                                                <span className='text-muted-foreground'>Buy: </span>
                                                <span className='font-mono'>{formatKTA(order.buyAmount)}</span>
                                            </div>
                                            <div className='text-sm'>
                                                <span className='text-muted-foreground'>Sell: </span>
                                                <span className='font-mono'>{formatKTA(order.sellAmount)}</span>
                                            </div>
                                        </div>

                                        {/* Expiry Status */}
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2'>
                                                <Clock className='w-4 h-4 text-red-500' />
                                                <span className='text-xs text-muted-foreground'>
                                                    Expired
                                                </span>
                                            </div>
                                            <span className='text-xs font-medium text-red-500'>
                                                {timeRemaining}
                                            </span>
                                        </div>

                                        {/* Escrow Address */}
                                        <div className='mt-2 pt-2 border-t border-border/50'>
                                            <span className='text-xs text-muted-foreground'>
                                                Escrow: {truncateAddress(order.escrowAddress, 8)}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        )}
            </div>
        </div>
    )
}
