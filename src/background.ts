// Background service worker for Lightbeam Wallet
/* eslint-disable @typescript-eslint/no-use-before-define */

// Service worker polyfill - must be before any imports
import WalletManager from './core/WalletManager'
import { MessageType, type Message, type MessageResponse, type WalletState } from './core/types'
import { getStorage, setStorage } from './core/storage'
import { checkAndExtendOrders } from './orders/checkAndExtendOrders'
import { createOrders } from './orders/createOrders'
import { recoverFromStorageAccounts } from './orders/recoverFromStorageAccounts'
import { refillStoragePool, getStoragePoolSize } from './orders/storagePool'
import { config } from './config'

if (typeof window === 'undefined') {
    (globalThis as any).window = globalThis;
    (globalThis as any).window.crypto = globalThis.crypto;
    (globalThis as any).window.msCrypto = null
}

// Alarm configuration
const CHECK_ORDERS_ALARM = 'checkAndExtendOrders'
const STORAGE_POOL_ALARM = 'storagePoolRefill'

/**
 * Ensure the check orders alarm is running
 */
const ensureCheckOrdersAlarm = async () => {
    console.log('[background] Ensuring check orders alarm is set up...')
    if (!chrome.alarms) {
        console.warn('[background] chrome.alarms API not available')
        return
    }

    // Clear any existing alarms
    const existing = await chrome.alarms.get(CHECK_ORDERS_ALARM)
    if (existing) {
        console.log('[background] Clearing existing alarm:', existing)
        await chrome.alarms.clear(CHECK_ORDERS_ALARM)
    }

    // Create new alarm
    console.log(`[background] Creating alarm with period: ${config.CHECK_ORDERS_PERIOD_MIN} minutes`)
    await chrome.alarms.create(CHECK_ORDERS_ALARM, {
        delayInMinutes: 0.1,
        periodInMinutes: config.CHECK_ORDERS_PERIOD_MIN
    })
    console.log('[background] Alarm created successfully')
}

/**
 * Ensure the storage pool alarm is running
 */
const ensureStoragePoolAlarm = async () => {
    console.log('[background] Ensuring storage pool alarm is set up...')
    if (!chrome.alarms) {
        console.warn('[background] chrome.alarms API not available')
        return
    }

    // Clear any existing alarms
    const existing = await chrome.alarms.get(STORAGE_POOL_ALARM)
    if (existing) {
        console.log('[background] Clearing existing storage pool alarm:', existing)
        await chrome.alarms.clear(STORAGE_POOL_ALARM)
    }

    // Create new alarm - check every 5 minutes
    console.log('[background] Creating storage pool alarm with 5 minute period')
    await chrome.alarms.create(STORAGE_POOL_ALARM, {
        periodInMinutes: 0.5
    })
    console.log('[background] Storage pool alarm created successfully')
}

// Handle installation and startup
chrome.runtime.onInstalled.addListener(ensureCheckOrdersAlarm)
chrome.runtime.onStartup?.addListener(ensureCheckOrdersAlarm)

chrome.runtime.onInstalled.addListener(ensureStoragePoolAlarm)
chrome.runtime.onStartup?.addListener(ensureStoragePoolAlarm)

// Handle alarms
if (chrome.alarms) {
    chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === CHECK_ORDERS_ALARM) {
            // If already checking orders, mark that we should run again
            if (isCheckingOrders) {
                console.log('[background] Order check already in progress, will run again after completion')
                shouldRunCheckAgain = true
                return
            }

            // Mark as running
            isCheckingOrders = true
            shouldRunCheckAgain = false

            checkAndExtendOrders()
                .catch(error => {
                    console.error('[background] Error in checkAndExtendOrders alarm:', error)
                })
                .finally(async () => {
                    // Mark as complete
                    isCheckingOrders = false

                    // If another run was requested while we were running, execute it now
                    if (shouldRunCheckAgain) {
                        console.log('[background] Running queued order check')
                        shouldRunCheckAgain = false
                        isCheckingOrders = true

                        checkAndExtendOrders()
                            .catch(error => {
                                console.error('[background] Error in queued checkAndExtendOrders:', error)
                            })
                            .finally(() => {
                                isCheckingOrders = false
                            })
                    }
                })
        } else if (alarm.name === STORAGE_POOL_ALARM) {
            refillStoragePoolBackground().catch(error => {
                console.error('[background] Error in storage pool refill alarm:', error)
            })
        }
    })
}

// Auto-lock check interval (every minute)
setInterval(async () => {
    await WalletManager.checkAutoLock()
}, 60 * 1000)

// Store pending approval requests
const pendingApprovals = new Map<string, {
    resolve:(value: any) => void
    reject: (error: Error) => void
}>()

// Track if storage pool refill is currently running
let isRefillInProgress = false

// Track if order checking is currently running
let isCheckingOrders = false
let shouldRunCheckAgain = false

// Message handler
chrome.runtime.onMessage.addListener(
    (
        message: Message,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: MessageResponse) => void
    ) => {
        // Handle approval responses
        if (message.type === MessageType.APPROVAL_RESPONSE) {
            const { requestId, approved } = message.data
            const pending = pendingApprovals.get(requestId)

            if (pending) {
                if (approved) {
                    pending.resolve({ approved: true })
                } else {
                    pending.reject(new Error('User rejected the request'))
                }
                pendingApprovals.delete(requestId)
            }

            sendResponse({ success: true })
            return true
        }

        handleMessage(message, sender)
            .then(sendResponse)
            .catch((error) => {
                sendResponse({
                    success: false,
                    error: error.message || 'Unknown error',
                    requestId: message.requestId
                })
            })

        // Return true to indicate async response
        return true
    }
)

/**
 * Handle incoming messages
 */
async function handleMessage (
    message: Message,
    sender: chrome.runtime.MessageSender
): Promise<MessageResponse> {
    switch (message.type) {
    case MessageType.GET_WALLET_STATE:
        return await handleGetWalletState()

    case MessageType.CREATE_WALLET:
        return await handleCreateWallet(message.data.password)

    case MessageType.IMPORT_WALLET:
        return await handleImportWallet(
            message.data.mnemonic,
            message.data.password
        )

    case MessageType.UNLOCK_WALLET:
        return await handleUnlockWallet(message.data.password)

    case MessageType.LOCK_WALLET:
        return await handleLockWallet()

    case MessageType.GET_ADDRESS:
        return await handleGetAddress()

    case MessageType.GET_BALANCE:
        return await handleGetBalance()

    case MessageType.SEND_TRANSACTION:
        return await handleSendTransaction(message.data)

    case MessageType.GET_NETWORK:
        return await handleGetNetwork()

    case MessageType.SET_NETWORK:
        return await handleSetNetwork(message.data.network)

    case MessageType.GET_AUTO_EXTEND_SETTING:
        return await handleGetAutoExtendSetting()

    case MessageType.SET_AUTO_EXTEND_SETTING:
        return await handleSetAutoExtendSetting(message.data.enabled)

    case MessageType.GET_STORAGE_POOL_ENABLED:
        return await handleGetStoragePoolEnabled()

    case MessageType.SET_STORAGE_POOL_ENABLED:
        return await handleSetStoragePoolEnabled(message.data.enabled, sender)

    case MessageType.GET_STORAGE_POOL_SIZE:
        return await handleGetStoragePoolSize()

    case MessageType.CONNECT_DAPP:
        return await handleConnectDapp(message.network, sender)

    case MessageType.GET_ACCOUNTS:
        return await handleGetAccounts()

    case MessageType.SIGN_TRANSACTION:
        return await handleSignTransaction(message.data, sender)

    case MessageType.CREATE_ORDERS:
        return await handleCreateOrders(message.data, sender)

    case MessageType.RECOVER_FROM_STORAGE:
        return await handleRecoverFromStorage(message.data, sender)

    default:
        throw new Error(`Unknown message type: ${message.type}`)
    }
}

/**
 * Get wallet state
 */
async function handleGetWalletState (): Promise<MessageResponse<WalletState>> {
    const isInitialized = await WalletManager.isInitialized()
    const isLocked = await WalletManager.isLocked()
    const network = await WalletManager.getNetwork()

    let address: string | undefined
    if (isInitialized && !isLocked) {
        try {
            address = await WalletManager.getAddress()
        } catch {
            // Ignore error if wallet is locked
        }
    }

    return {
        success: true,
        data: {
            isInitialized,
            isLocked,
            address,
            network
        }
    }
}

/**
 * Create new wallet
 */
async function handleCreateWallet (password: string): Promise<MessageResponse> {
    if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters')
    }

    const result = await WalletManager.createWallet(password)
    return {
        success: true,
        data: result
    }
}

/**
 * Import wallet from mnemonic
 */
async function handleImportWallet (
    mnemonic: string,
    password: string
): Promise<MessageResponse> {
    if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters')
    }

    const address = await WalletManager.importWallet(mnemonic, password)
    return {
        success: true,
        data: { address }
    }
}

/**
 * Unlock wallet
 */
async function handleUnlockWallet (password: string): Promise<MessageResponse> {
    const address = await WalletManager.unlockWallet(password)
    return {
        success: true,
        data: { address }
    }
}

/**
 * Lock wallet
 */
async function handleLockWallet (): Promise<MessageResponse> {
    await WalletManager.lockWallet()
    return {
        success: true
    }
}

/**
 * Get wallet address
 */
async function handleGetAddress (): Promise<MessageResponse> {
    const address = await WalletManager.getAddress()
    return {
        success: true,
        data: { address }
    }
}

/**
 * Get balance
 */
async function handleGetBalance (): Promise<MessageResponse> {
    const balance = await WalletManager.getBalance()
    return {
        success: true,
        data: balance
    }
}

/**
 * Send transaction
 */
async function handleSendTransaction (data: any): Promise<MessageResponse> {
    const result = await WalletManager.sendTransaction(data)
    return {
        success: true,
        data: result
    }
}

/**
 * Get current network
 */
async function handleGetNetwork (): Promise<MessageResponse> {
    const network = await WalletManager.getNetwork()
    return {
        success: true,
        data: { network }
    }
}

/**
 * Set network
 */
async function handleSetNetwork (network: 'test' | 'main'): Promise<MessageResponse> {
    await WalletManager.setNetwork(network)
    return {
        success: true,
        data: { network }
    }
}

/**
 * Get auto-extend orders setting
 */
async function handleGetAutoExtendSetting (): Promise<MessageResponse> {
    const enabled = await getStorage('auto_extend_orders')
    return {
        success: true,
        data: { enabled: enabled ?? true }
    }
}

/**
 * Set auto-extend orders setting
 */
async function handleSetAutoExtendSetting (enabled: boolean): Promise<MessageResponse> {
    await setStorage('auto_extend_orders', enabled)
    return {
        success: true,
        data: { enabled }
    }
}

/**
 * Get storage pool enabled setting
 */
async function handleGetStoragePoolEnabled (): Promise<MessageResponse> {
    const enabled = await getStorage('storage_pool_enabled')
    return {
        success: true,
        data: { enabled: enabled ?? false }
    }
}

/**
 * Set storage pool enabled setting
 * Requires approval from user
 */
async function handleSetStoragePoolEnabled (
    enabled: boolean,
    sender: chrome.runtime.MessageSender
): Promise<MessageResponse> {
    // If enabling, require approval
    if (enabled) {
        // Create approval request
        const requestId = Math.random().toString(36)
        const approvalRequest = {
            type: 'storagePool' as const,
            origin: sender.url || 'Extension Settings',
            requestId
        }

        // Store in chrome.storage so popup can access it
        await chrome.storage.local.set({ pendingApproval: approvalRequest })

        // Open the extension popup
        await chrome.action.openPopup().catch(() => {
            console.log('Popup already open or could not be opened')
        })

        // Wait for user approval
        try {
            await new Promise<{ approved: boolean }>((resolve, reject) => {
                pendingApprovals.set(requestId, { resolve, reject })

                // Timeout after 30 minutes
                setTimeout(() => {
                    if (pendingApprovals.has(requestId)) {
                        pendingApprovals.delete(requestId)
                        chrome.storage.local.remove('pendingApproval')
                        reject(new Error('Approval request timed out'))
                    }
                }, 1800000)
            })
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Request timeout'
            }
        }
    }

    // Set the setting
    await setStorage('storage_pool_enabled', enabled)

    // Trigger immediate pool refill if enabling
    if (enabled) {
        refillStoragePoolBackground().catch(error => {
            console.error('[background] Error refilling pool after activation:', error)
        })
    }

    return {
        success: true,
        data: { enabled }
    }
}

/**
 * Get storage pool size
 */
async function handleGetStoragePoolSize (): Promise<MessageResponse> {
    const size = await getStoragePoolSize()
    return {
        success: true,
        data: { size }
    }
}

/**
 * Refill storage pool in background
 * Called by alarm
 */
async function refillStoragePoolBackground (): Promise<void> {
    console.log('[background] Storage pool refill alarm triggered')

    // Check if refill is already in progress
    if (isRefillInProgress) {
        console.log('[background] Storage pool refill already in progress, skipping')
        return
    }

    // Check if wallet is initialized and unlocked
    const isInitialized = await WalletManager.isInitialized()
    if (!isInitialized) {
        console.log('[background] Wallet not initialized, skipping pool refill')
        return
    }

    const isLocked = await WalletManager.isLocked()
    if (isLocked) {
        console.log('[background] Wallet is locked, skipping pool refill')
        return
    }

    // Set the lock
    isRefillInProgress = true

    try {
        const seed = await WalletManager.getSeed()
        const network = await WalletManager.getNetwork()

        if (!seed) {
            console.warn('[background] No seed available for pool refill')
            return
        }

        const result = await refillStoragePool(seed, network)
        console.log(`[background] Pool refill complete: added ${result.added}, total ${result.total}`)
    } catch (error) {
        console.error('[background] Error refilling storage pool:', error)
    } finally {
        // Always release the lock
        isRefillInProgress = false
    }
}

/**
 * Handle dApp connection request
 */
async function handleConnectDapp (
    requestedNetwork: 'test' | 'main' | undefined,
    sender: chrome.runtime.MessageSender
): Promise<MessageResponse> {
    // Check if wallet is initialized
    const isInitialized = await WalletManager.isInitialized()
    if (!isInitialized) {
        throw new Error('Wallet not initialized. Please create a wallet first.')
    }

    // Check if wallet is locked
    const isLocked = await WalletManager.isLocked()
    if (isLocked) {
        throw new Error('Wallet is locked. Please unlock your wallet to connect.')
    }

    // Get current network from storage
    const currentNetwork = await WalletManager.getNetwork()

    // If dApp requested a specific network and it doesn't match, ask user to switch
    if (requestedNetwork && requestedNetwork !== currentNetwork) {
        const requestId = Math.random().toString(36)
        const networkSwitchRequest = {
            type: 'network-switch' as const,
            origin: sender.url || 'Unknown',
            requestId,
            currentNetwork,
            requestedNetwork
        }

        // Store in chrome.storage so popup can access it
        await chrome.storage.local.set({ pendingApproval: networkSwitchRequest })

        // Open the extension popup
        await chrome.action.openPopup().catch(() => {
            console.log('Popup already open or could not be opened')
        })

        // Wait for user approval
        try {
            const approved = await new Promise<{ approved: boolean }>((resolve, reject) => {
                pendingApprovals.set(requestId, { resolve, reject })

                // Timeout after 5 minutes
                setTimeout(() => {
                    if (pendingApprovals.has(requestId)) {
                        pendingApprovals.delete(requestId)
                        chrome.storage.local.remove('pendingApproval')
                        reject(new Error('Network switch request timed out'))
                    }
                }, 300000)
            })

            if (!approved.approved) {
                return {
                    success: false,
                    error: 'User rejected network switch'
                }
            }

            // User approved - switch network
            await WalletManager.setNetwork(requestedNetwork)
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network switch failed'
            }
        }
    }

    // Create approval request for connection
    const requestId = Math.random().toString(36)
    const approvalRequest = {
        type: 'connect' as const,
        origin: sender.url || 'Unknown',
        requestId,
        network: requestedNetwork || currentNetwork
    }

    // Store in chrome.storage so popup can access it
    await chrome.storage.local.set({ pendingApproval: approvalRequest })

    // Open the extension popup
    await chrome.action.openPopup().catch(() => {
        // If openPopup fails (e.g., already open), that's OK
        console.log('Popup already open or could not be opened')
    })

    // Wait for user approval via message
    let approved: { approved: boolean }
    try {
        approved = await new Promise<{ approved: boolean }>((resolve, reject) => {
            pendingApprovals.set(requestId, { resolve, reject })

            // Timeout after 30 minutes
            setTimeout(() => {
                if (pendingApprovals.has(requestId)) {
                    pendingApprovals.delete(requestId)
                    chrome.storage.local.remove('pendingApproval')
                    reject(new Error('Approval request timed out'))
                }
            }, 1800000)
        })
    } catch (error) {
        // Timeout occurred
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Request timeout'
        }
    }

    if (!approved) {
        // User rejected - this is not an error, just a normal rejection
        return {
            success: false,
            error: 'User rejected the connection'
        }
    }

    // Get address
    const address = await WalletManager.getAddress()

    // Update activity
    await WalletManager.updateActivity()

    // Get final network (may have been switched)
    const finalNetwork = await WalletManager.getNetwork()

    return {
        success: true,
        data: {
            accounts: [address],
            origin: sender.url,
            network: finalNetwork
        }
    }
}

/**
 * Get accounts for dApp
 */
async function handleGetAccounts (): Promise<MessageResponse> {
    const isLocked = await WalletManager.isLocked()
    if (isLocked) {
        return {
            success: true,
            data: { accounts: [] }
        }
    }

    const address = await WalletManager.getAddress()
    return {
        success: true,
        data: { accounts: [address] }
    }
}

/**
 * Sign transaction from dApp
 */
async function handleSignTransaction (
    data: any,
    sender: chrome.runtime.MessageSender
): Promise<MessageResponse> {
    // Check if wallet is unlocked
    const isLocked = await WalletManager.isLocked()
    if (isLocked) {
        throw new Error('Wallet is locked. Please unlock first.')
    }

    // Show approval popup to user
    const requestId = Math.random().toString(36).substring(2)
    const origin = sender.url ? new URL(sender.url).origin : 'Unknown'

    // Store pending approval
    await chrome.storage.local.set({
        pendingApproval: {
            requestId,
            type: 'transaction',
            origin,
            data
        }
    })

    // Open the extension popup to show approval screen
    try {
        await chrome.action.openPopup()
    } catch (error) {
        // If openPopup fails (e.g., already open), that's okay
        console.log('Could not open popup automatically:', error)
    }

    // Wait for approval response
    let approved: boolean
    try {
        approved = await new Promise<boolean>((resolve, reject) => {
            pendingApprovals.set(requestId, { resolve, reject })

            // Timeout after 30 minutes
            setTimeout(() => {
                if (pendingApprovals.has(requestId)) {
                    pendingApprovals.delete(requestId)
                    chrome.storage.local.remove('pendingApproval')
                    reject(new Error('Approval timeout'))
                }
            }, 1800000)
        })
    } catch (error) {
        // Timeout occurred
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Request timeout'
        }
    }

    if (!approved) {
        // User rejected - this is not an error, just a normal rejection
        return {
            success: false,
            error: 'User rejected the request'
        }
    }

    const result = await WalletManager.sendTransaction(data)
    await WalletManager.updateActivity()

    return {
        success: true,
        data: result
    }
}

/**
 * Handle recover from storage accounts
 */
async function handleRecoverFromStorage (
    data: { storageAddresses: string[] },
    sender: chrome.runtime.MessageSender
): Promise<MessageResponse> {
    // Check if wallet is unlocked
    const isLocked = await WalletManager.isLocked()
    if (isLocked) {
        throw new Error('Wallet is locked. Please unlock first.')
    }

    // Show approval popup to user
    const requestId = Math.random().toString(36).substring(2)
    const origin = sender.url ? new URL(sender.url).origin : 'Unknown'

    // Store pending approval
    await chrome.storage.local.set({
        pendingApproval: {
            requestId,
            type: 'recoverFromStorage',
            origin,
            data
        }
    })

    // Open the extension popup to show approval screen
    try {
        await chrome.action.openPopup()
    } catch (error) {
        // If openPopup fails (e.g., already open), that's okay
        console.log('Could not open popup automatically:', error)
    }

    // Wait for approval response
    let approved: boolean
    try {
        approved = await new Promise<boolean>((resolve, reject) => {
            pendingApprovals.set(requestId, { resolve, reject })

            // Timeout after 30 minutes
            setTimeout(() => {
                if (pendingApprovals.has(requestId)) {
                    pendingApprovals.delete(requestId)
                    chrome.storage.local.remove('pendingApproval')
                    reject(new Error('Approval timeout'))
                }
            }, 1800000)
        })
    } catch (error) {
        // Timeout occurred
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Request timeout'
        }
    }

    if (!approved) {
        // User rejected - this is not an error, just a normal rejection
        return {
            success: false,
            error: 'User rejected the request'
        }
    }

    // Get wallet seed and network
    const seed = WalletManager.getSeed()
    const network = await WalletManager.getNetwork()

    // Call recoverFromStorageAccounts with requestId for progress tracking
    const result = await recoverFromStorageAccounts(
        data.storageAddresses,
        seed!,
        network,
        requestId
    )
    await WalletManager.updateActivity()

    return {
        success: result.success,
        data: result,
        error: result.success ? undefined : result.details
    }
}

/**
 * Create orders from dApp (order book integration)
 */
async function handleCreateOrders (
    data: any,
    sender: chrome.runtime.MessageSender
): Promise<MessageResponse> {
    // Check if wallet is unlocked
    const isLocked = await WalletManager.isLocked()
    if (isLocked) {
        throw new Error('Wallet is locked. Please unlock first.')
    }

    // Check network requirements
    const requestedNetwork = data.network as 'test' | 'main' | undefined
    const currentNetwork = await WalletManager.getNetwork()

    // If a specific network is requested and it differs from current, ask user to switch
    if (requestedNetwork && requestedNetwork !== currentNetwork) {
        const networkSwitchRequestId = Math.random().toString(36)

        // Store network switch approval request
        await chrome.storage.local.set({
            pendingApproval: {
                requestId: networkSwitchRequestId,
                type: 'network-switch',
                origin: sender.url || 'Unknown',
                data: {
                    currentNetwork,
                    requestedNetwork
                }
            }
        })

        // Open the extension popup
        await chrome.action.openPopup().catch(() => {
            console.log('Popup already open or could not be opened')
        })

        // Wait for user approval
        try {
            const approved = await new Promise<{ approved: boolean }>((resolve, reject) => {
                pendingApprovals.set(networkSwitchRequestId, { resolve, reject })

                // Timeout after 5 minutes
                setTimeout(() => {
                    if (pendingApprovals.has(networkSwitchRequestId)) {
                        pendingApprovals.delete(networkSwitchRequestId)
                        chrome.storage.local.remove('pendingApproval')
                        reject(new Error('Network switch request timed out'))
                    }
                }, 300000)
            })

            if (!approved.approved) {
                return {
                    success: false,
                    error: 'User rejected network switch'
                }
            }

            // User approved - switch network
            await WalletManager.setNetwork(requestedNetwork)
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network switch failed'
            }
        }
    }

    // Show approval popup to user
    const requestId = Math.random().toString(36).substring(2)
    const origin = sender.url ? new URL(sender.url).origin : 'Unknown'

    // Store pending approval
    await chrome.storage.local.set({
        pendingApproval: {
            requestId,
            type: 'createOrders',
            origin,
            data
        }
    })

    // Open the extension popup to show approval screen
    try {
        await chrome.action.openPopup()
    } catch (error) {
        // If openPopup fails (e.g., already open), that's okay
        console.log('Could not open popup automatically:', error)
    }

    // Wait for approval response
    let approved: boolean
    try {
        approved = await new Promise<boolean>((resolve, reject) => {
            pendingApprovals.set(requestId, { resolve, reject })

            // Timeout after 30 minutes
            setTimeout(() => {
                if (pendingApprovals.has(requestId)) {
                    pendingApprovals.delete(requestId)
                    chrome.storage.local.remove('pendingApproval')
                    reject(new Error('Approval timeout'))
                }
            }, 1800000)
        })
    } catch (error) {
        // Timeout occurred
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Request timeout'
        }
    }

    if (!approved) {
        // User rejected - this is not an error, just a normal rejection
        return {
            success: false,
            error: 'User rejected the request'
        }
    }

    // Get wallet seed and network
    const seed = WalletManager.getSeed()
    const network = await WalletManager.getNetwork()

    // Call createOrders directly, passing requestId for progress tracking
    try {
        const result = await createOrders(data, seed!, network, requestId)
        await WalletManager.updateActivity()

        // Store result for popup to retrieve
        await chrome.storage.local.set({
            [`order_result_${requestId}`]: {
                success: true,
                data: result
            }
        })

        // Clean up progress data
        await chrome.storage.local.remove(`order_progress_${requestId}`)

        return {
            success: true,
            data: result
        }
    } catch (error) {
        // Store error for popup to retrieve
        await chrome.storage.local.set({
            [`order_result_${requestId}`]: {
                success: false,
                error: error instanceof Error ? error.message : 'Order creation failed'
            }
        })

        // Clean up progress data
        await chrome.storage.local.remove(`order_progress_${requestId}`)

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Order creation failed'
        }
    }
}
