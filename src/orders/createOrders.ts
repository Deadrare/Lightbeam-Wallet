/**
 * Create orders for the order book
 * Handles blockchain operations: creates storage accounts, generates atomic swap blocks, transfers tokens
 * Returns order data for the website to register with GraphQL API
 */

import * as KeetaNet from '@keetanetwork/keetanet-client'
import { setStorage } from '../core/storage'
import { sendToStorageAccount } from './createStorageAccount'
import { generateAtomicSwapBlocks } from './generateAtomicSwapBlocks'
import { peekFromPool, removeFromPool, returnToPool } from './storagePool'

export async function createOrders (
    ordersData: any,
    currentSeed: string,
    network: 'test' | 'main',
    requestId?: string
): Promise<{ orderIds: string[]; success: boolean; orders?: any[] }> {
    const updateProgress = async (message: string, value: number) => {
        if (requestId) {
            await chrome.storage.local.set({
                [`order_progress_${requestId}`]: {
                    message,
                    value,
                    timestamp: Date.now()
                }
            })
        }
    }

    // Declare variables outside try block for error recovery
    const fundedStorageAddresses: string[] = []
    let allStorageAddresses: string[] = []
    let orders: any[] = []

    try {
        // Clear any previous order progress/result data from storage
        const allStorage = await chrome.storage.local.get(null)
        const keysToRemove = Object.keys(allStorage).filter(
            key => key.startsWith('order_progress_') || key.startsWith('order_result_')
        )
        if (keysToRemove.length > 0) {
            await chrome.storage.local.remove(keysToRemove)
        }

        const ordersInput = ordersData.orders
        const { dexAddress } = ordersData
        orders = ordersInput

        if (!orders || !Array.isArray(orders) || orders.length === 0) {
            throw new Error('No orders provided')
        }

        if (!dexAddress) {
            throw new Error('DEX address is required')
        }

        await updateProgress('Initializing wallet...', 5)

        // Create account from seed for signing operations
        const signerAccount = KeetaNet.lib.Account.fromSeed(currentSeed, 0)
        const ownerAddress = signerAccount.publicKeyString.get()

        // Initialize Keeta client
        const networkName = network === 'test' ? 'test' : 'main'
        const client = await KeetaNet.UserClient.fromNetwork(networkName, signerAccount)

        await updateProgress('Syncing blockchain...', 10)

        // Sync blockchain - this will handle any pending blocks
        await client.sync()

        // ============================================================================
        // STEP 1: Get storage accounts from pool
        // Storage accounts are pre-created by the background alarm
        // We peek at them first, and only remove them from the pool after successful creation
        // ============================================================================
        await updateProgress('Retrieving storage accounts from pool...', 12)
        const totalOrders = orders.length

        // Check if we have enough storage accounts
        const { getStoragePoolSize } = await import('./storagePool')
        const availableAccounts = await getStoragePoolSize()

        if (availableAccounts < totalOrders) {
            throw new Error(
                `Insufficient storage accounts. Need ${totalOrders}, but only ${availableAccounts} available. ` +
                'Please wait for the storage pool to refill or reduce the number of orders.'
            )
        }

        // Peek at storage accounts without removing them yet
        allStorageAddresses = await peekFromPool(totalOrders)

        const createdOrders: any[] = []

        // ============================================================================
        // STEP 2: Process each order with proper forwarding
        // ============================================================================
        // Total progress range for processing orders: 15% to 95% (80% total)
        const totalProgressRange = 80
        const progressStart = 15

        // Process each order
        for (let i = 0; i < orders.length; i++) {
            const orderData = orders[i]
            const {
                firstTokenAddress,
                secondTokenAddress,
                buyAmount,
                sellAmount,
                orderType, // true = buy order, false = sell order
                priceDigits,
                priceZeros,
                skipFunding, // If true, don't send tokens (for chained orders)
                forwardToAddress // Optional address to forward received tokens to
            } = orderData

            const orderNumber = i + 1

            // Calculate progress for this order within the total progress range
            // Each order gets an equal portion of the 80% range
            const progressPerOrder = totalProgressRange / totalOrders
            const orderProgressStart = progressStart + (i * progressPerOrder)

            await updateProgress(`Creating order ${orderNumber} of ${totalOrders}...`, orderProgressStart)

            // Determine send/receive amounts and token based on order type
            // Buy order: send secondToken (buyAmount), receive firstToken (sellAmount)
            // Sell order: send firstToken (sellAmount), receive secondToken (buyAmount)
            const sendTokenAddress = orderType ? secondTokenAddress : firstTokenAddress
            const sendAmount = orderType ? buyAmount : sellAmount
            const receiveTokenAddress = orderType ? firstTokenAddress : secondTokenAddress
            const receiveAmount = orderType ? sellAmount : buyAmount

            // Use pre-created storage address for this order
            const orderStorageAddress = allStorageAddresses[i]

            await updateProgress(`Generating swap blocks for order ${orderNumber}...`, orderProgressStart + (progressPerOrder * 0.3))

            // Determine forward destination:
            // 1. If forwardToAddress is explicitly provided, use it
            // 2. If forwardToAddress is 'NEXT_ORDER', use the next order's storage address
            // 3. Otherwise, forward to owner's storage address
            let forwardDestination: string
            if (forwardToAddress === 'NEXT_ORDER' && i + 1 < totalOrders) {
                forwardDestination = allStorageAddresses[i + 1]
            } else if (forwardToAddress && forwardToAddress !== 'NEXT_ORDER') {
                forwardDestination = forwardToAddress
            } else {
                forwardDestination = signerAccount.publicKeyString.get()
            }

            // Generate atomic swap blocks
            const firstBlockHex = await generateAtomicSwapBlocks(
                client,
                signerAccount,
                orderStorageAddress,
                forwardDestination, // Forward received tokens here (next order or owner)
                sendTokenAddress,
                receiveTokenAddress,
                sendAmount,
                receiveAmount,
                dexAddress
            )

            // Transfer tokens to order storage account (skip for chained orders)
            if (!skipFunding) {
                await updateProgress(`Transferring tokens for order ${orderNumber}...`, orderProgressStart + (progressPerOrder * 0.7))
                await sendToStorageAccount(
                    client,
                    orderStorageAddress,
                    sendTokenAddress,
                    BigInt(sendAmount)
                )
                // Track that this account received funds
                fundedStorageAddresses.push(orderStorageAddress)
            } else {
                await updateProgress(`Order ${orderNumber} will be funded by previous order...`, orderProgressStart + (progressPerOrder * 0.7))
            }

            // Return order data for GraphQL registration
            createdOrders.push({
                orderStorageAddress,
                firstBlockHex,
                firstTokenAddress,
                secondTokenAddress,
                buyAmount,
                sellAmount,
                ownerAddress,
                priceDigits,
                priceZeros
            })
        }

        await updateProgress('Finalizing...', 95)

        // Clean up
        await client.destroy()

        // Successfully created all orders - now remove the storage accounts from the pool
        await removeFromPool(allStorageAddresses)
        console.log(`Removed ${allStorageAddresses.length} storage accounts from pool after successful order creation`)

        // Update last activity
        await setStorage('last_activity', Date.now())

        return {
            orderIds: [],
            success: true,
            orders: createdOrders
        }
    } catch (error) {
        console.error('Error creating orders:', error)

        // Return unused storage accounts to the pool
        if (allStorageAddresses.length > 0) {
            // Determine which storage accounts were not funded (and thus can be reused)
            const unfundedAddresses = allStorageAddresses.filter(
                addr => !fundedStorageAddresses.includes(addr)
            )

            if (unfundedAddresses.length > 0) {
                await returnToPool(unfundedAddresses)
                console.log(`Returned ${unfundedAddresses.length} unused storage accounts to pool`)
            }

            // Remove the funded accounts from the pool (they have funds and can't be reused)
            if (fundedStorageAddresses.length > 0) {
                await removeFromPool(fundedStorageAddresses)
                console.log(`Removed ${fundedStorageAddresses.length} funded storage accounts from pool`)
            }
        }

        // If we funded any storage accounts, attempt to recover the funds
        if (fundedStorageAddresses.length > 0) {
            console.log(`Attempting to recover funds from ${fundedStorageAddresses.length} storage accounts...`)
            await updateProgress('Recovering transferred funds...', 98)

            try {
                const { recoverFromStorageAccounts } = await import('./recoverFromStorageAccounts')

                // Recover all tokens from storage accounts
                await recoverFromStorageAccounts(
                    fundedStorageAddresses,
                    currentSeed,
                    network
                )

                console.log('Successfully recovered funds from storage accounts')
            } catch (recoveryError) {
                console.error('Failed to recover funds:', recoveryError)
                // Don't throw here - we still want to report the original error
            }
        }

        throw new Error(
            error instanceof Error ? error.message : 'Order creation failed'
        )
    }
}
