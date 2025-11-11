// Type definitions for messages between popup, background, and content scripts

export enum MessageType {
    // Wallet management
    CREATE_WALLET = 'CREATE_WALLET',
    IMPORT_WALLET = 'IMPORT_WALLET',
    UNLOCK_WALLET = 'UNLOCK_WALLET',
    LOCK_WALLET = 'LOCK_WALLET',
    GET_WALLET_STATE = 'GET_WALLET_STATE',

    // Account operations
    GET_ADDRESS = 'GET_ADDRESS',
    GET_BALANCE = 'GET_BALANCE',
    SEND_TRANSACTION = 'SEND_TRANSACTION',

    // Network
    GET_NETWORK = 'GET_NETWORK',
    SET_NETWORK = 'SET_NETWORK',

    // Settings
    GET_AUTO_EXTEND_SETTING = 'GET_AUTO_EXTEND_SETTING',
    SET_AUTO_EXTEND_SETTING = 'SET_AUTO_EXTEND_SETTING',
    GET_STORAGE_POOL_ENABLED = 'GET_STORAGE_POOL_ENABLED',
    SET_STORAGE_POOL_ENABLED = 'SET_STORAGE_POOL_ENABLED',
    GET_STORAGE_POOL_SIZE = 'GET_STORAGE_POOL_SIZE',

    // dApp integration
    CONNECT_DAPP = 'CONNECT_DAPP',
    GET_ACCOUNTS = 'GET_ACCOUNTS',
    SIGN_TRANSACTION = 'SIGN_TRANSACTION',
    APPROVAL_RESPONSE = 'APPROVAL_RESPONSE',

    // Order book operations
    CREATE_ORDERS = 'CREATE_ORDERS',
    RECOVER_FROM_STORAGE = 'RECOVER_FROM_STORAGE'
}

export interface Message<T = any> {
    type: MessageType
    data?: T
    requestId?: string
    network?: 'test' | 'main'
}

export interface MessageResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    requestId?: string
}

// Wallet state
export interface WalletState {
    isInitialized: boolean
    isLocked: boolean
    address?: string
    network: 'test' | 'main'
}

// Balance response
export interface BalanceInfo {
    balance: string
    token: string
}

// Transaction request
export interface TransactionRequest {
    to: string
    amount: string
    token: string
}

// Transaction response
export interface TransactionResponse {
    hash: string
    blockHeight: number
}

// Order creation request
export interface CreateOrdersRequest {
    orders: any[] // Array of order data to be signed and submitted
}

// Order creation response
export interface CreateOrdersResponse {
    orderIds: string[]
    success: boolean
}
