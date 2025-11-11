/**
 * Storage Account Pool Management
 * Maintains a pool of pre-generated storage accounts for efficient order creation
 */

import * as KeetaNet from '@keetanetwork/keetanet-client'
import { getStorage, setStorage } from '../core/storage'
import { createStorageAccount } from './createStorageAccount'

const MIN_POOL_SIZE = 1
const MAX_POOL_SIZE = 120

/**
 * Get current pool size target based on settings
 */
export async function getPoolSizeTarget (): Promise<number> {
    const enabled = await getStorage('storage_pool_enabled')
    return enabled ? MAX_POOL_SIZE : MIN_POOL_SIZE
}

/**
 * Get current pool of storage accounts
 */
export async function getStoragePool (): Promise<string[]> {
    const pool = await getStorage('storage_pool_accounts')
    return pool || []
}

/**
 * Get current pool size
 */
export async function getStoragePoolSize (): Promise<number> {
    const pool = await getStoragePool()
    return pool.length
}

/**
 * Take storage accounts from the pool
 * @param count Number of accounts needed
 * @returns Array of storage addresses
 */
export async function takeFromPool (count: number): Promise<string[]> {
    const pool = await getStoragePool()

    if (pool.length < count) {
        throw new Error(`Insufficient storage accounts in pool. Need ${count}, have ${pool.length}`)
    }

    // Take from the front of the pool
    const taken = pool.slice(0, count)
    const remaining = pool.slice(count)

    // Update pool
    await setStorage('storage_pool_accounts', remaining)

    console.log(`[storagePool] Took ${count} accounts from pool, ${remaining.length} remaining`)

    return taken
}

/**
 * Peek at storage accounts from the pool without removing them
 * @param count Number of accounts to peek at
 * @returns Array of storage addresses
 */
export async function peekFromPool (count: number): Promise<string[]> {
    const pool = await getStoragePool()

    if (pool.length < count) {
        throw new Error(`Insufficient storage accounts in pool. Need ${count}, have ${pool.length}`)
    }

    // Return the first 'count' accounts without removing them
    return pool.slice(0, count)
}

/**
 * Remove specific storage accounts from the pool
 * Used after successful order creation to finalize the removal
 * @param addresses Array of storage addresses to remove
 */
export async function removeFromPool (addresses: string[]): Promise<void> {
    const pool = await getStoragePool()
    const addressSet = new Set(addresses)
    const remaining = pool.filter(addr => !addressSet.has(addr))

    await setStorage('storage_pool_accounts', remaining)
    console.log(`[storagePool] Removed ${addresses.length} accounts from pool, ${remaining.length} remaining`)
}

/**
 * Return storage accounts back to the pool
 * Used when order creation fails to return unused accounts
 * @param addresses Array of storage addresses to return
 */
export async function returnToPool (addresses: string[]): Promise<void> {
    if (addresses.length === 0) return

    const pool = await getStoragePool()
    // Return to the front of the pool (they were the most recently generated)
    const updated = [...addresses, ...pool]

    await setStorage('storage_pool_accounts', updated)
    console.log(`[storagePool] Returned ${addresses.length} accounts to pool, now at ${updated.length}`)
}

/**
 * Add storage accounts to the pool
 */
async function addToPool (addresses: string[]): Promise<void> {
    const pool = await getStoragePool()
    const updated = [...pool, ...addresses]

    await setStorage('storage_pool_accounts', updated)
    console.log(`[storagePool] Added ${addresses.length} accounts to pool, now at ${updated.length}`)
}

/**
 * Refill storage pool to target size
 * Called by background alarm
 */
export async function refillStoragePool (
    currentSeed: string,
    network: 'test' | 'main'
): Promise<{ added: number; total: number }> {
    console.log('[storagePool] Checking pool status...')

    const target = await getPoolSizeTarget()
    const current = await getStoragePoolSize()

    console.log(`[storagePool] Target: ${target}, Current: ${current}`)

    if (current >= target) {
        console.log('[storagePool] Pool is full, no refill needed')
        return { added: 0, total: current }
    }

    const needed = target - current
    console.log(`[storagePool] Need to generate ${needed} storage accounts`)

    try {
        // Create account from seed
        const signerAccount = KeetaNet.lib.Account.fromSeed(currentSeed, 0)

        // Initialize Keeta client
        const networkName = network === 'test' ? 'test' : 'main'
        const client = await KeetaNet.UserClient.fromNetwork(networkName, signerAccount)

        // Sync blockchain - skip recovery to avoid fee block issues in background process
        // If there's a pending block, sync will handle it properly
        await client.sync()

        // Check KTA balance before creating accounts
        const balances = await client.client.getAllBalances(signerAccount)
        const baseTokenId = client.baseToken.publicKeyString.get()
        const baseTokenBalance = balances.find((b: { token: { publicKeyString: { get: () => string } }; balance: bigint }) =>
            b.token.publicKeyString.get() === baseTokenId
        )

        const ktaBalance = baseTokenBalance?.balance || 0n

        if (ktaBalance <= 0n) {
            console.log('[storagePool] Insufficient KTA balance, skipping pool refill')
            await client.destroy()
            return { added: 0, total: current }
        }

        console.log(`[storagePool] KTA balance: ${ktaBalance}, proceeding with account creation`)

        // Create storage accounts in batches of 30
        // Only process one batch per alarm cycle - subsequent alarms will handle remaining accounts
        const BATCH_SIZE = 30

        // Process one batch (up to 30 accounts)
        const batchSize = Math.min(BATCH_SIZE, needed)
        console.log(`[storagePool] Creating batch of ${batchSize} accounts in single transaction...`)

        try {
            // Create all storage accounts in a single batch
            const { storageAddresses } = await createStorageAccount(client, batchSize)

            // Add all accounts to pool at once
            await addToPool(storageAddresses)

            console.log(`[storagePool] Successfully added ${batchSize} accounts to pool, now at ${current + batchSize}`)

            // Clean up
            await client.destroy()

            return { added: batchSize, total: current + batchSize }
        } catch (error) {
            console.error('[storagePool] Error creating batch:', error)
            // Clean up
            await client.destroy()
            return { added: 0, total: current }
        }
    } catch (error) {
        console.error('[storagePool] Error refilling pool:', error)
        throw error
    }
}

/**
 * Initialize storage pool on first run
 */
export async function initializeStoragePool (
    currentSeed: string,
    network: 'test' | 'main'
): Promise<void> {
    const pool = await getStoragePool()

    if (pool.length === 0) {
        console.log('[storagePool] Initializing pool for first time')
        await refillStoragePool(currentSeed, network)
    }
}
