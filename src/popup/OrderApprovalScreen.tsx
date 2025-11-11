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
import { Label } from '@/components/ui/Label'
import { Loader2 } from 'lucide-react'
import { listingDetailByTicker, ListingDetail } from '@/queries/listingDetailByTicker'
import formatPrice from '@/utils/formatPrice'
import BigNumber from 'bignumber.js'

interface OrderApprovalScreenProps {
    request: {
        requestId: string
        type: 'createOrders'
        origin: string
        data: {
            orders: Array<{
                firstTokenAddress: string
                secondTokenAddress: string
                buyAmount: string
                sellAmount: string
                sendAmount: string
                receiveAmount: string
                priceDigits: number
                priceZeros: number
                orderType: boolean // true = buy order, false = sell order
            }>
            dexAddress: string
        }
    }
    onResponse: (approved: boolean) => Promise<void>
}

export const OrderApprovalScreen: React.FC<OrderApprovalScreenProps> = ({ request, onResponse }) => {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(true)
    const [tokenInfoMap, setTokenInfoMap] = useState<Record<string, ListingDetail>>({})
    const [progressMessage, setProgressMessage] = useState('')
    const [progressValue, setProgressValue] = useState(0)
    const [processingOrders, setProcessingOrders] = useState(false)

    useEffect(() => {
        loadTokenInfo()
    }, [])

    const loadTokenInfo = async () => {
        try {
            const orders = request.data?.orders || []
            const uniqueTokens = new Set<string>()

            // Collect all unique token addresses
            orders.forEach(order => {
                uniqueTokens.add(order.firstTokenAddress)
                uniqueTokens.add(order.secondTokenAddress)
            })

            // Fetch token info for each unique token
            const tokenInfoPromises = Array.from(uniqueTokens).map(async (tokenAddress) => {
                try {
                    const listing = await listingDetailByTicker(tokenAddress)
                    if (listing) {
                        return {
                            address: tokenAddress,
                            info: listing
                        }
                    }
                } catch (error) {
                    console.error(`Failed to fetch token info for ${tokenAddress}:`, error)
                }
                return null
            })

            const tokenInfoResults = await Promise.all(tokenInfoPromises)
            const newTokenInfoMap: Record<string, ListingDetail> = {}

            tokenInfoResults.forEach(result => {
                if (result) {
                    newTokenInfoMap[result.address] = result.info
                }
            })

            setTokenInfoMap(newTokenInfoMap)
        } catch (err) {
            console.error('Failed to load token info:', err)
        }
    }

    const handleApprove = async () => {
        try {
            setLoading(true)
            setProcessingOrders(true)

            // Initial progress
            setProgressMessage('Preparing orders...')
            setProgressValue(0)

            // Start polling for progress updates from chrome.storage.local
            const requestId = request.requestId
            const progressInterval = setInterval(async () => {
                const result = await chrome.storage.local.get(`order_progress_${requestId}`)
                const progress = result[`order_progress_${requestId}`]
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
                setProgressMessage('Orders created successfully!')
                setProgressValue(100)

                // Wait a moment to show success before closing
                await new Promise(resolve => setTimeout(resolve, 1500))

                // Only close on success
                setOpen(false)
                setTimeout(() => window.close(), 100)
            } catch (error) {
                clearInterval(progressInterval)

                console.error('Error creating orders:', error)
                setProgressMessage(`Error: ${error instanceof Error ? error.message : 'Order creation failed'}`)
                setProgressValue(0)

                // Keep dialog open on error - reset state to allow retry
                setLoading(false)
                setProcessingOrders(false)
            }
        } catch (error) {
            console.error('Error in handleApprove:', error)
            setProgressMessage('An unexpected error occurred')
            setProgressValue(0)
            setLoading(false)
            setProcessingOrders(false)
        }
    }

    const handleReject = async () => {
        setLoading(true)
        setOpen(false)
        onResponse(false)
        // Close the popup window after rejection
        setTimeout(() => window.close(), 100)
    }

    const handleOpenChange = (newOpen: boolean) => {
        // Prevent closing the dialog while orders are being processed
        if (processingOrders) {
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

    const getTokenDisplay = (tokenAddress: string, amount: string) => {
        const tokenInfo = tokenInfoMap[tokenAddress]
        if (!tokenInfo) {
            return {
                formatted: amount,
                name: formatAddress(tokenAddress),
                slug: '',
                raw: amount
            }
        }

        return {
            formatted: formatPrice(new BigNumber(amount).shiftedBy(-(tokenInfo.decimals || 0)).toString()),
            name: tokenInfo.name,
            slug: tokenInfo.slug,
            raw: amount
        }
    }

    const orders = request.data?.orders || []

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerContent className='max-h-[96vh]'>
                <DrawerHeader>
                    <DrawerTitle>
                        {processingOrders ? 'Creating Orders' : 'Create Orders Request'}
                    </DrawerTitle>
                    <DrawerDescription>
                        {processingOrders
                            ? 'Please wait while your orders are being created...'
                            : `A website is requesting to create ${orders.length} order${orders.length !== 1 ? 's' : ''}`
                        }
                    </DrawerDescription>
                </DrawerHeader>

                {processingOrders
                    ? (
                        <div className='px-4 py-8 flex flex-col items-center justify-center space-y-4'>
                            <Loader2 className='w-12 h-12 animate-spin' />
                            <div className='w-full max-w-sm space-y-2'>
                                <Label className='text-sm text-muted-foreground text-center block'>
                                    {progressMessage}
                                </Label>
                                <Progress
                                    value={progressValue}
                                    className='w-full'
                                />
                                <div className='text-xs text-muted-foreground text-center'>
                                    {Math.round(progressValue)}%
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

                                <div className='p-3 bg-muted rounded-md max-h-64 overflow-y-auto'>
                                    <p className='text-sm font-medium mb-2'>
                                        Order Details ({orders.length} order{orders.length !== 1 ? 's' : ''}):
                                    </p>
                                    {orders.map((order, index) => {
                                        const buyToken = getTokenDisplay(order.secondTokenAddress, order.buyAmount)
                                        const sellToken = getTokenDisplay(order.firstTokenAddress, order.sellAmount)
                                        const orderTypeLabel = order.orderType ? 'Buy Order' : 'Sell Order'
                                        const orderTypeColor = order.orderType ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'

                                        return (
                                            <div key={index} className='mb-3 pb-3 border-b border-border last:border-0'>
                                                <div className='flex justify-between items-center mb-2'>
                                                    <p className='text-xs font-semibold'>Order #{index + 1}</p>
                                                    <p className={`text-xs font-semibold ${orderTypeColor}`}>{orderTypeLabel}</p>
                                                </div>
                                                <div className='space-y-2'>
                                                    <div>
                                                        <div className='flex justify-between items-center text-xs mb-1'>
                                                            <span className='text-muted-foreground'>Buy Amount:</span>
                                                            <div className='text-right'>
                                                                <div className='font-medium'>
                                                                    {buyToken.formatted} {buyToken.slug}
                                                                </div>
                                                                <div className='text-muted-foreground font-mono text-xs'>
                                                                    {buyToken.raw}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className='flex justify-between items-center text-xs'>
                                                            <span className='text-muted-foreground'>Sell Amount:</span>
                                                            <div className='text-right'>
                                                                <div className='font-medium'>
                                                                    {sellToken.formatted} {sellToken.slug}
                                                                </div>
                                                                <div className='text-muted-foreground font-mono text-xs'>
                                                                    {sellToken.raw}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className='p-3 border border-yellow-500 bg-yellow-500/10 rounded-md'>
                                    <p className='text-sm text-yellow-600 dark:text-yellow-400'>
                                        ⚠️ Review order details carefully before approving
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                }

                <DrawerFooter>
                    {!processingOrders && (
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
                    )}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
