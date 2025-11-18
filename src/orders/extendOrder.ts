import WalletManager from '../core/WalletManager'
import { buildAtomicSwapBlock } from './buildAtomicSwapBlock'
import { uploadBlocksFile } from './uploadBlocksFile'
import { bulkCreateAtomicSwapBlock } from '../queries/bulkCreateAtomicSwapBlock'
import { config, StagingConfig, ProductionConfig } from '../config'

/**
 * Extend a single order by generating and uploading new blocks
 */
export async function extendOrder (order: any, network: 'test' | 'main'): Promise<void> {
    // Get wallet seed and account
    const seed = WalletManager.getSeed()
    if (!seed) {
        throw new Error('Wallet seed not available')
    }

    // Initialize progress tracking
    const orderId = String(order.id)
    await chrome.storage.local.set({
        [`order_extend_progress_${orderId}`]: {
            orderId,
            status: 'generating',
            progress: 0,
            total: 0,
            startTime: Date.now()
        }
    })

    // Import Keeta SDK dynamically to avoid issues
    const KeetaSDK = await import('@keetanetwork/keetanet-client')

    // Get configuration based on network
    const networkConfig = network === 'main' ? ProductionConfig : StagingConfig
    const DEX_ADDRESS = networkConfig.DEX_ADDRESS
    const BASE_TOKEN = networkConfig.BASE_TOKEN

    // Initialize Keeta client
    const creatorAccount = KeetaSDK.lib.Account.fromSeed(seed, 0)
    const creatorClient = await KeetaSDK.UserClient.fromNetwork(network, creatorAccount)

    try {
        // Sync blockchain - this will handle any pending blocks
        await creatorClient.sync()

        const signerAccount = KeetaSDK.lib.Account.fromPublicKeyString(DEX_ADDRESS).assertAccount()
        const sendFromAccount = KeetaSDK.lib.Account.fromPublicKeyString(order.escrowAddress)

        // Check if unsignedBytes is available
        if (!order.unsignedBytes) {
            throw new Error('Order does not have unsignedBytes - cannot determine exact amounts')
        }

        // Parse the unsigned bytes to get exact amounts and tokens
        const unsignedBytesHex = order.unsignedBytes.startsWith('0x')
            ? order.unsignedBytes.slice(2)
            : order.unsignedBytes
        const unsignedBytesArray = new Uint8Array(
            unsignedBytesHex.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) || []
        )
        const originalBlock = new KeetaSDK.lib.Block(unsignedBytesArray.buffer as any)

        // Extract send and receive amounts from the original block
        let sendAmount = 0n
        let receiveAmountAfterFee = 0n
        let sendToken: any = null
        let receiveToken: any = null
        let forwardAddress: string | undefined

        if (originalBlock.operations && Array.isArray(originalBlock.operations)) {
            for (const operation of originalBlock.operations) {
                if (operation.type === 0) { // SEND operation
                    sendAmount = BigInt(operation.amount || 0)
                    sendToken = operation.token
                } else if (operation.type === 7) { // RECEIVE operation
                    receiveAmountAfterFee = BigInt(operation.amount || 0)
                    receiveToken = operation.token
                    // Extract forward address if present
                    if (operation.forward) {
                        forwardAddress = operation.forward.publicKeyString?.get()
                    }
                }
            }
        }

        if (!sendToken?.isToken() || !receiveToken?.isToken()) {
            throw new Error('Invalid token extracted from unsigned bytes')
        }

        if (sendAmount === 0n || receiveAmountAfterFee === 0n) {
            throw new Error('Could not extract amounts from unsigned bytes')
        }

        // Get the previous/head block of the order storage account
        const previousInfo = await creatorClient.client.getAccountHeadInfo(sendFromAccount)
        const previous = previousInfo?.block.hash?.get()

        // Get the starting timestamp from the order's validUntil field
        // This represents when the current swap blocks expire
        const expiresTime = new Date(order.validUntil).getTime()

        // If the order has already expired, start from now. Otherwise start from expiry time.
        const lastBlockTime = expiresTime < Date.now() ? Date.now() : expiresTime

        // Generate extension blocks
        const MINUTES_APART = config.MINUTES_APART
        const totalBlocks = (config.EXTENSION_DAYS * 24 * 60) / MINUTES_APART
        const unsignedBlocks: string[] = []

        // Update progress with total blocks
        await chrome.storage.local.set({
            [`order_extend_progress_${orderId}`]: {
                orderId,
                status: 'generating',
                progress: 0,
                total: totalBlocks,
                startTime: Date.now()
            }
        })

        const BATCH_SIZE = 100

        for (let batchStart = 0; batchStart < totalBlocks; batchStart += BATCH_SIZE) {
            const batchEnd = Math.min(batchStart + BATCH_SIZE, totalBlocks)
            const batchPromises = []

            for (let i = batchStart; i < batchEnd; i++) {
                // Calculate timestamp starting from last block time
                const overrideTime = lastBlockTime + (i * MINUTES_APART * 60 * 1000)
                batchPromises.push(
                    buildAtomicSwapBlock(
                        creatorClient,
                        sendFromAccount,
                        creatorAccount,
                        signerAccount,
                        sendToken,
                        receiveToken,
                        sendAmount,
                        receiveAmountAfterFee,
                        previous,
                        forwardAddress, // Use forward address extracted from original block
                        overrideTime
                    )
                )
            }

            const batchResults = await Promise.all(batchPromises)
            for (const unsignedBytes of batchResults) {
                unsignedBlocks.push(Buffer.from(unsignedBytes).toString('hex'))
            }

            // Update progress after each batch
            await chrome.storage.local.set({
                [`order_extend_progress_${orderId}`]: {
                    orderId,
                    status: 'generating',
                    progress: unsignedBlocks.length,
                    total: totalBlocks,
                    startTime: Date.now()
                }
            })
        }

        // Update status to uploading
        await chrome.storage.local.set({
            [`order_extend_progress_${orderId}`]: {
                orderId,
                status: 'uploading',
                progress: totalBlocks,
                total: totalBlocks,
                startTime: Date.now()
            }
        })

        // Upload blocks file
        const fileUrl = await uploadBlocksFile(unsignedBlocks, lastBlockTime, MINUTES_APART)

        // Update status to registering
        await chrome.storage.local.set({
            [`order_extend_progress_${orderId}`]: {
                orderId,
                status: 'registering',
                progress: totalBlocks,
                total: totalBlocks,
                startTime: Date.now()
            }
        })

        // Register blocks with order (skipValidation=true since we just generated these blocks)
        await bulkCreateAtomicSwapBlock(
            parseInt(order.id),
            fileUrl,
            totalBlocks,
            new Date(lastBlockTime).toISOString(),
            true // skipValidation
        )

        // Update status to completed
        await chrome.storage.local.set({
            [`order_extend_progress_${orderId}`]: {
                orderId,
                status: 'completed',
                progress: totalBlocks,
                total: totalBlocks,
                startTime: Date.now()
            }
        })

        // Clear progress after 5 seconds
        setTimeout(async () => {
            await chrome.storage.local.remove(`order_extend_progress_${orderId}`)
        }, 5000)
    } catch (error) {
        // Update status to failed
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const isTimeout = errorMessage.includes('504') ||
                         errorMessage.includes('timeout') ||
                         errorMessage.includes('Gateway Timeout')

        console.error('[extendOrder] Extension failed:', error)

        // Provide more user-friendly error message for timeouts
        const userMessage = isTimeout
            ? 'Server timeout - the request is still processing. Please check order status in a few minutes.'
            : errorMessage

        await chrome.storage.local.set({
            [`order_extend_progress_${orderId}`]: {
                orderId,
                status: 'failed',
                progress: 0,
                total: 0,
                error: userMessage,
                isTimeout,
                startTime: Date.now()
            }
        })
        throw error
    } finally {
        await creatorClient.destroy()
    }
}
