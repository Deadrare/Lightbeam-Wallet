// Wallet constants

// Storage keys
export const STORAGE_KEYS = {
    ENCRYPTED_SEED: 'encrypted_seed',
    WALLET_ADDRESS: 'wallet_address',
    NETWORK: 'network',
    IS_LOCKED: 'is_locked',
    AUTO_LOCK_TIMEOUT: 'auto_lock_timeout',
    LAST_ACTIVITY: 'last_activity'
}

// Auto-lock timeout (15 minutes in milliseconds)
export const DEFAULT_AUTO_LOCK_TIMEOUT = 15 * 60 * 1000

// Encryption parameters
export const CRYPTO_PARAMS = {
    PBKDF2_ITERATIONS: 100000,
    SALT_LENGTH: 16,
    IV_LENGTH: 12,
    KEY_LENGTH: 256
}
