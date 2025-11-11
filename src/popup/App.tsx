/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react'
import { WelcomeScreen } from './WelcomeScreen'
import { UnlockScreen } from './UnlockScreen'
import { HomeScreen } from './HomeScreen'
import { ApprovalScreen } from './ApprovalScreen'
import { OrderApprovalScreen } from './OrderApprovalScreen'
import { RecoveryApprovalScreen } from './RecoveryApprovalScreen'
import { NetworkSwitchScreen } from './NetworkSwitchScreen'
import { sendMessage } from '@/lib/messaging'
import { MessageType, type WalletState } from '@/core/types'
import { ThemeProvider } from '@/components/theme-provider'

interface PendingApproval {
    requestId: string
    type: 'connect' | 'transaction' | 'createOrders' | 'recoverFromStorage' | 'network-switch'
    origin: string
    data?: any
    currentNetwork?: 'test' | 'main'
    requestedNetwork?: 'test' | 'main'
}

export const App: React.FC = () => {
    const [walletState, setWalletState] = useState<WalletState | null>(null)
    const [loading, setLoading] = useState(true)
    const [pendingApproval, setPendingApproval] = useState<PendingApproval | null>(null)

    useEffect(() => {
        loadWalletState()
        checkPendingApproval()

        // Listen for new pending approvals
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
            if (areaName === 'local' && changes.pendingApproval) {
                if (changes.pendingApproval.newValue) {
                    setPendingApproval(changes.pendingApproval.newValue)
                } else {
                    setPendingApproval(null)
                }
            }
        }

        chrome.storage.onChanged.addListener(handleStorageChange)

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange)
        }
    }, [])

    const checkPendingApproval = async () => {
        const result = await chrome.storage.local.get('pendingApproval')
        if (result.pendingApproval) {
            setPendingApproval(result.pendingApproval)
        }
    }

    const loadWalletState = async () => {
        try {
            const state = await sendMessage<WalletState>(MessageType.GET_WALLET_STATE)
            setWalletState(state)
        } catch (err) {
            console.error('Failed to load wallet state:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <ThemeProvider
                attribute='class'
                defaultTheme='dark'
                enableSystem={false}
                disableTransitionOnChange
            >
                <div className='flex items-center justify-center h-screen'>
                    <div className='text-center'>
                        <div className='text-xl font-bold'>Lightbeam Wallet</div>
                        <div className='text-sm text-muted-foreground mt-2'>Loading...</div>
                    </div>
                </div>
            </ThemeProvider>
        )
    }

    if (!walletState) {
        return (
            <ThemeProvider
                attribute='class'
                defaultTheme='dark'
                enableSystem={false}
                disableTransitionOnChange
            >
                <div className='flex items-center justify-center h-screen p-4'>
                    <div className='text-center text-destructive'>
                        Failed to load wallet
                    </div>
                </div>
            </ThemeProvider>
        )
    }

    // Pending approval - show approval screen over the home screen
    if (pendingApproval && !walletState.isLocked) {
        return (
            <ThemeProvider
                attribute='class'
                defaultTheme='dark'
                enableSystem={false}
                disableTransitionOnChange
            >
                <HomeScreen />
                {pendingApproval.type === 'createOrders'
                    ? (
                        <OrderApprovalScreen
                            request={pendingApproval as any}
                            onResponse={async (approved) => {
                                const requestId = pendingApproval.requestId

                                if (!approved) {
                                    // Clear pending approval on rejection
                                    await chrome.storage.local.remove('pendingApproval')
                                    setPendingApproval(null)

                                    // Send rejection response
                                    await chrome.runtime.sendMessage({
                                        type: MessageType.APPROVAL_RESPONSE,
                                        data: { requestId, approved: false }
                                    })
                                    return
                                }

                                // Don't clear pendingApproval yet - keep component mounted during processing

                                // Send approval response - this will trigger background script to process
                                await chrome.runtime.sendMessage({
                                    type: MessageType.APPROVAL_RESPONSE,
                                    data: { requestId, approved: true }
                                })

                                // Wait for the background script to complete by polling storage
                                // The background script stores the result when done
                                const maxWaitTime = 120000 // 2 minutes max
                                const pollInterval = 500 // Check every 500ms
                                const startTime = Date.now()

                                while (Date.now() - startTime < maxWaitTime) {
                                    const result = await chrome.storage.local.get(`order_result_${requestId}`)
                                    if (result[`order_result_${requestId}`]) {
                                        // Clean up both result and progress
                                        await chrome.storage.local.remove(`order_result_${requestId}`)
                                        await chrome.storage.local.remove(`order_progress_${requestId}`)

                                        const orderResult = result[`order_result_${requestId}`]
                                        if (!orderResult.success) {
                                            throw new Error(orderResult.error || 'Order creation failed')
                                        }

                                        // Only clear pending approval after successful completion
                                        await chrome.storage.local.remove('pendingApproval')
                                        setPendingApproval(null)

                                        return // Success!
                                    }

                                    // Wait before polling again
                                    await new Promise(resolve => setTimeout(resolve, pollInterval))
                                }

                                throw new Error('Order creation timeout')
                            }}
                        />
                    )
                    : pendingApproval.type === 'recoverFromStorage'
                        ? (
                            <RecoveryApprovalScreen
                                request={pendingApproval as any}
                                onResponse={async (approved) => {
                                    await chrome.storage.local.remove('pendingApproval')
                                    setPendingApproval(null)
                                    // Send response to background
                                    await chrome.runtime.sendMessage({
                                        type: MessageType.APPROVAL_RESPONSE,
                                        data: { requestId: pendingApproval.requestId, approved }
                                    })
                                }}
                            />
                        )
                        : pendingApproval.type === 'network-switch'
                            ? (
                                <NetworkSwitchScreen
                                    request={pendingApproval as any}
                                    onResponse={async (approved) => {
                                        await chrome.storage.local.remove('pendingApproval')
                                        setPendingApproval(null)
                                        // Send response to background
                                        await chrome.runtime.sendMessage({
                                            type: MessageType.APPROVAL_RESPONSE,
                                            data: { requestId: pendingApproval.requestId, approved }
                                        })
                                    }}
                                />
                            )
                            : (
                                <ApprovalScreen
                                    request={pendingApproval as any}
                                    onResponse={async (approved) => {
                                        await chrome.storage.local.remove('pendingApproval')
                                        setPendingApproval(null)
                                        // Send response to background
                                        await chrome.runtime.sendMessage({
                                            type: MessageType.APPROVAL_RESPONSE,
                                            data: { requestId: pendingApproval.requestId, approved }
                                        })
                                    }}
                                />
                            )}
            </ThemeProvider>
        )
    }

    // Pending approval when locked - still show over unlock screen
    if (pendingApproval && walletState.isLocked) {
        return (
            <ThemeProvider
                attribute='class'
                defaultTheme='dark'
                enableSystem={false}
                disableTransitionOnChange
            >
                <UnlockScreen onUnlocked={loadWalletState} />
                {pendingApproval.type === 'createOrders'
                    ? (
                        <OrderApprovalScreen
                            request={pendingApproval as any}
                            onResponse={async (approved) => {
                                await chrome.storage.local.remove('pendingApproval')
                                setPendingApproval(null)
                                await chrome.runtime.sendMessage({
                                    type: MessageType.APPROVAL_RESPONSE,
                                    data: { requestId: pendingApproval.requestId, approved }
                                })
                            }}
                        />
                    )
                    : pendingApproval.type === 'recoverFromStorage'
                        ? (
                            <RecoveryApprovalScreen
                                request={pendingApproval as any}
                                onResponse={async (approved) => {
                                    await chrome.storage.local.remove('pendingApproval')
                                    setPendingApproval(null)
                                    await chrome.runtime.sendMessage({
                                        type: MessageType.APPROVAL_RESPONSE,
                                        data: { requestId: pendingApproval.requestId, approved }
                                    })
                                }}
                            />
                        )
                        : (
                            <ApprovalScreen
                                request={pendingApproval as any}
                                onResponse={async (approved) => {
                                    await chrome.storage.local.remove('pendingApproval')
                                    setPendingApproval(null)
                                    await chrome.runtime.sendMessage({
                                        type: MessageType.APPROVAL_RESPONSE,
                                        data: { requestId: pendingApproval.requestId, approved }
                                    })
                                }}
                            />
                        )}
            </ThemeProvider>
        )
    }

    // Not initialized - show welcome
    if (!walletState.isInitialized) {
        return (
            <ThemeProvider
                attribute='class'
                defaultTheme='dark'
                enableSystem={false}
                disableTransitionOnChange
            >
                <WelcomeScreen onWalletCreated={loadWalletState} />
            </ThemeProvider>
        )
    }

    // Locked - show unlock screen
    if (walletState.isLocked) {
        return (
            <ThemeProvider
                attribute='class'
                defaultTheme='dark'
                enableSystem={false}
                disableTransitionOnChange
            >
                <UnlockScreen onUnlocked={loadWalletState} />
            </ThemeProvider>
        )
    }

    // Unlocked - show home screen
    return (
        <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem={false}
            disableTransitionOnChange
        >
            <HomeScreen />
        </ThemeProvider>
    )
}
