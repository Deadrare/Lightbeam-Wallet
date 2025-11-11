// Content script for dApp integration
// Injects window.keeta provider into web pages
/* eslint-disable @typescript-eslint/no-use-before-define */

import { MessageType } from './core/types'

// Inject the provider script into the page using a file instead of inline script
const script = document.createElement('script')
script.src = chrome.runtime.getURL('inpage.js')
script.onload = function () {
    (this as HTMLScriptElement).remove()
}
;(document.head || document.documentElement).appendChild(script)

// Listen for messages from the injected script
window.addEventListener('message', async (event) => {
    // Only accept messages from same origin
    if (event.source !== window) return

    const { type, requestId, data } = event.data

    try {
        switch (type) {
        case 'KEETA_CONNECT_REQUEST':
            handleConnect(requestId, data)
            break

        case 'KEETA_GET_ACCOUNTS_REQUEST':
            handleGetAccounts(requestId)
            break

        case 'KEETA_CREATE_ORDERS_REQUEST':
            handleCreateOrders(requestId, data)
            break

        case 'KEETA_GET_NETWORK_REQUEST':
            handleGetNetwork(requestId)
            break

        case 'KEETA_SET_NETWORK_REQUEST':
            handleSetNetwork(requestId, data)
            break

        case 'KEETA_RECOVER_FROM_STORAGE_REQUEST':
            handleRecoverFromStorage(requestId, data)
            break

        case 'KEETA_GET_STORAGE_POOL_SIZE_REQUEST':
            handleGetStoragePoolSize(requestId)
            break

        case 'KEETA_GET_STORAGE_POOL_ENABLED_REQUEST':
            handleGetStoragePoolEnabled(requestId)
            break

        case 'KEETA_ENABLE_STORAGE_POOL_REQUEST':
            handleEnableStoragePool(requestId)
            break
        }
    } catch (error) {
        console.error('Content script error:', error)
    }
})

/**
 * Handle connect request
 */
async function handleConnect (requestId: string, data?: { network?: 'test' | 'main' }) {
    try {
        const response = await chrome.runtime.sendMessage({
            type: MessageType.CONNECT_DAPP,
            network: data?.network
        })

        if (response.success) {
            window.postMessage({
                type: 'KEETA_CONNECT_RESPONSE',
                requestId,
                accounts: response.data.accounts,
                network: response.data.network
            }, '*')
        } else {
            throw new Error(response.error || 'Connection failed')
        }
    } catch (error: any) {
        window.postMessage({
            type: 'KEETA_CONNECT_RESPONSE',
            requestId,
            error: error.message || 'Connection failed'
        }, '*')
    }
}

/**
 * Handle get accounts request
 */
async function handleGetAccounts (requestId: string) {
    try {
        const response = await chrome.runtime.sendMessage({
            type: MessageType.GET_ACCOUNTS
        })

        if (response.success) {
            window.postMessage({
                type: 'KEETA_GET_ACCOUNTS_RESPONSE',
                requestId,
                accounts: response.data.accounts
            }, '*')
        } else {
            throw new Error(response.error || 'Failed to get accounts')
        }
    } catch (error: any) {
        window.postMessage({
            type: 'KEETA_GET_ACCOUNTS_RESPONSE',
            requestId,
            error: error.message || 'Failed to get accounts'
        }, '*')
    }
}

/**
 * Handle create orders request
 */
async function handleCreateOrders (requestId: string, ordersData: any) {
    try {
        const response = await chrome.runtime.sendMessage({
            type: MessageType.CREATE_ORDERS,
            data: ordersData
        })

        if (response.success) {
            window.postMessage({
                type: 'KEETA_CREATE_ORDERS_RESPONSE',
                requestId,
                result: response.data
            }, '*')
        } else {
            throw new Error(response.error || 'Create orders failed')
        }
    } catch (error: any) {
        window.postMessage({
            type: 'KEETA_CREATE_ORDERS_RESPONSE',
            requestId,
            error: error.message || 'Create orders failed'
        }, '*')
    }
}

/**
 * Handle get network request
 */
async function handleGetNetwork (requestId: string) {
    try {
        const response = await chrome.runtime.sendMessage({
            type: MessageType.GET_NETWORK
        })

        if (response.success) {
            window.postMessage({
                type: 'KEETA_GET_NETWORK_RESPONSE',
                requestId,
                result: response.data.network
            }, '*')
        } else {
            throw new Error(response.error || 'Failed to get network')
        }
    } catch (error: any) {
        window.postMessage({
            type: 'KEETA_GET_NETWORK_RESPONSE',
            requestId,
            error: error.message || 'Failed to get network'
        }, '*')
    }
}

/**
 * Handle set network request
 */
async function handleSetNetwork (requestId: string, networkData: { network: 'test' | 'main' }) {
    try {
        const response = await chrome.runtime.sendMessage({
            type: MessageType.SET_NETWORK,
            data: networkData
        })

        if (response.success) {
            window.postMessage({
                type: 'KEETA_SET_NETWORK_RESPONSE',
                requestId,
                result: true
            }, '*')
        } else {
            throw new Error(response.error || 'Failed to set network')
        }
    } catch (error: any) {
        window.postMessage({
            type: 'KEETA_SET_NETWORK_RESPONSE',
            requestId,
            error: error.message || 'Failed to set network'
        }, '*')
    }
}

/**
 * Handle recover from storage request
 */
async function handleRecoverFromStorage (requestId: string, recoveryData: any) {
    try {
        const response = await chrome.runtime.sendMessage({
            type: MessageType.RECOVER_FROM_STORAGE,
            data: recoveryData
        })

        if (response.success) {
            window.postMessage({
                type: 'KEETA_RECOVER_FROM_STORAGE_RESPONSE',
                requestId,
                result: response.data
            }, '*')
        } else {
            throw new Error(response.error || 'Recovery failed')
        }
    } catch (error: any) {
        window.postMessage({
            type: 'KEETA_RECOVER_FROM_STORAGE_RESPONSE',
            requestId,
            error: error.message || 'Recovery failed'
        }, '*')
    }
}

/**
 * Handle get storage pool size request
 */
async function handleGetStoragePoolSize (requestId: string) {
    try {
        const response = await chrome.runtime.sendMessage({
            type: MessageType.GET_STORAGE_POOL_SIZE
        })

        if (response.success) {
            window.postMessage({
                type: 'KEETA_GET_STORAGE_POOL_SIZE_RESPONSE',
                requestId,
                size: response.data.size
            }, '*')
        } else {
            throw new Error(response.error || 'Failed to get storage pool size')
        }
    } catch (error: any) {
        window.postMessage({
            type: 'KEETA_GET_STORAGE_POOL_SIZE_RESPONSE',
            requestId,
            error: error.message || 'Failed to get storage pool size'
        }, '*')
    }
}

/**
 * Handle get storage pool enabled request
 */
async function handleGetStoragePoolEnabled (requestId: string) {
    try {
        const response = await chrome.runtime.sendMessage({
            type: MessageType.GET_STORAGE_POOL_ENABLED
        })

        if (response.success) {
            window.postMessage({
                type: 'KEETA_GET_STORAGE_POOL_ENABLED_RESPONSE',
                requestId,
                enabled: response.data.enabled
            }, '*')
        } else {
            throw new Error(response.error || 'Failed to get storage pool enabled status')
        }
    } catch (error: any) {
        window.postMessage({
            type: 'KEETA_GET_STORAGE_POOL_ENABLED_RESPONSE',
            requestId,
            error: error.message || 'Failed to get storage pool enabled status'
        }, '*')
    }
}

/**
 * Handle enable storage pool request
 */
async function handleEnableStoragePool (requestId: string) {
    try {
        const response = await chrome.runtime.sendMessage({
            type: MessageType.SET_STORAGE_POOL_ENABLED,
            data: { enabled: true }
        })

        if (response.success) {
            window.postMessage({
                type: 'KEETA_ENABLE_STORAGE_POOL_RESPONSE',
                requestId,
                success: true
            }, '*')
        } else {
            throw new Error(response.error || 'Failed to enable storage pool')
        }
    } catch (error: any) {
        window.postMessage({
            type: 'KEETA_ENABLE_STORAGE_POOL_RESPONSE',
            requestId,
            error: error.message || 'Failed to enable storage pool'
        }, '*')
    }
}
