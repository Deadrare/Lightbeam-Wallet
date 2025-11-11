// Chrome storage wrapper with typed interface

export interface WalletStorage {
    /* eslint-disable camelcase */
    encrypted_seed?: string
    wallet_address?: string
    network?: 'test' | 'main'
    is_locked?: boolean
    auto_lock_timeout?: number
    last_activity?: number
    auto_extend_orders?: boolean
    storage_pool_enabled?: boolean
    storage_pool_accounts?: string[] // Array of storage account addresses
    /* eslint-enable camelcase */
}

/**
 * Get item from chrome.storage.local
 */
export async function getStorage<K extends keyof WalletStorage> (
    key: K
): Promise<WalletStorage[K] | undefined> {
    return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
            resolve(result[key] as WalletStorage[K])
        })
    })
}

/**
 * Set item in chrome.storage.local
 */
export async function setStorage<K extends keyof WalletStorage> (
    key: K,
    value: WalletStorage[K]
): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
            resolve()
        })
    })
}

/**
 * Remove item from chrome.storage.local
 */
export async function removeStorage (key: keyof WalletStorage): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.remove(key, () => {
            resolve()
        })
    })
}

/**
 * Get multiple items from chrome.storage.local
 */
export async function getStorageMultiple<K extends keyof WalletStorage> (
    keys: K[]
): Promise<Pick<WalletStorage, K>> {
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, (result) => {
            resolve(result as Pick<WalletStorage, K>)
        })
    })
}

/**
 * Set multiple items in chrome.storage.local
 */
export async function setStorageMultiple (
    items: Partial<WalletStorage>
): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.set(items, () => {
            resolve()
        })
    })
}

/**
 * Clear all wallet data from storage
 */
export async function clearStorage (): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.clear(() => {
            resolve()
        })
    })
}
