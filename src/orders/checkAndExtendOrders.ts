import WalletManager from '../core/WalletManager'
import { getStorage } from '../core/storage'
import { listOpenAtomicOrdersFullChain } from '../queries/listOpenAtomicOrdersFullChain'
import { extendOrder } from './extendOrder'
import { config, StagingConfig, ProductionConfig } from '../config'

/**
 * Check and extend orders that are expiring soon
 */
export async function checkAndExtendOrders (): Promise<void> {
    try {
        // Check if auto-extend is enabled (defaults to true if not set)
        const autoExtendEnabled = await getStorage('auto_extend_orders')
        const isEnabled = autoExtendEnabled ?? true
        if (!isEnabled) {
            return
        }

        // Update last activity to prevent auto-lock while extending orders
        await WalletManager.updateActivity()

        // Get wallet address
        const ownerAddress = await WalletManager.getAddress()
        const network = await WalletManager.getNetwork()

        // Fetch orders for this wallet (expiring in next 6 days)
        const sixDaysFromNow = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
        const orders = await listOpenAtomicOrdersFullChain(ownerAddress, sixDaysFromNow)

        if (!orders || orders.length === 0) {
            return
        }

        // Filter orders that need extension (expiring in less than threshold)
        const THRESHOLD_MS = config.AUTO_EXTEND_THRESHOLD_DAYS * 24 * 60 * 60 * 1000
        const now = Date.now()

        const ordersToExtend = orders.filter(order => {
            const expiresAt = new Date(order.validUntil).getTime()
            const timeUntilExpiry = expiresAt - now
            // Include orders that are already expired OR expiring within threshold
            return timeUntilExpiry < THRESHOLD_MS
        })

        if (ordersToExtend.length === 0) {
            return
        }

        // Process each order sequentially
        for (const order of ordersToExtend) {
            try {
                // Store currently extending order
                await chrome.storage.local.set({ currentlyExtendingOrder: order.id })

                await extendOrder(order, network)
            } catch (error) {
                console.error(`Failed to extend order ${order.id}:`, error)
                // Continue to next order on failure
            }
        }

        // Clear currently extending order when done
        await chrome.storage.local.remove('currentlyExtendingOrder')
    } catch (error) {
        console.error('Error in checkAndExtendOrders:', error)
        // Clear currently extending order on error
        await chrome.storage.local.remove('currentlyExtendingOrder')
    }
}
