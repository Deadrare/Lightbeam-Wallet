// Wallet manager for Keeta network operations

import * as bip39 from 'bip39'
import { encrypt, decrypt } from './crypto'
import { getStorage, setStorage, getStorageMultiple, setStorageMultiple, clearStorage } from './storage'
import { DEFAULT_AUTO_LOCK_TIMEOUT } from './constants'
import { config, getConfigForNetwork } from '../config'
import type { NetworkType } from '../config'
import type { BalanceInfo, TransactionRequest, TransactionResponse } from './types'

// Import Keeta SDK (will be available after yarn install)
import * as KeetaNetModule from '@keetanetwork/keetanet-client'
// @ts-expect-error - default export may not be available
const KeetaNet = KeetaNetModule.default || KeetaNetModule

export class WalletManager {
    private static instance: WalletManager | null = null
    private currentAccount: any = null
    private currentSeed: string | null = null

    static getInstance (): WalletManager {
        if (!WalletManager.instance) {
            WalletManager.instance = new WalletManager()
        }
        return WalletManager.instance
    }

    /**
     * Check if wallet is initialized
     */
    async isInitialized (): Promise<boolean> {
        const encryptedSeed = await getStorage('encrypted_seed')
        return !!encryptedSeed
    }

    /**
     * Check if wallet is locked
     * A wallet is considered locked if either:
     * 1. The is_locked flag is true in storage, OR
     * 2. The seed is not loaded in memory (currentSeed is null)
     */
    async isLocked (): Promise<boolean> {
        const isLocked = await getStorage('is_locked')
        // Wallet is locked if storage says it's locked OR if seed is not in memory
        return isLocked !== false || this.currentSeed === null
    }

    /**
     * Generate a new BIP-39 mnemonic (12 words)
     */
    generateMnemonic (): string {
        return bip39.generateMnemonic(128) // 128 bits = 12 words
    }

    /**
     * Validate a mnemonic phrase
     */
    validateMnemonic (mnemonic: string): boolean {
        return bip39.validateMnemonic(mnemonic)
    }

    /**
     * Create a new wallet with a password
     */
    async createWallet (password: string): Promise<{ mnemonic: string, address: string }> {
        const mnemonic = this.generateMnemonic()
        const address = await this.importWallet(mnemonic, password)
        return { mnemonic, address }
    }

    /**
     * Import wallet from mnemonic
     */
    async importWallet (mnemonic: string, password: string): Promise<string> {
        if (!this.validateMnemonic(mnemonic)) {
            throw new Error('Invalid mnemonic phrase')
        }

        // Convert mnemonic to Keeta-compatible seed
        const seed = await KeetaNet.lib.Account.seedFromPassphrase(mnemonic, { asString: true })

        // Create account from seed (index 0)
        const account = KeetaNet.lib.Account.fromSeed(seed, 0)
        const address = account.publicKeyString.get()

        // Encrypt seed with password
        const encryptedSeed = await encrypt(seed, password)

        // Store encrypted seed and address
        await setStorageMultiple({
            encrypted_seed: encryptedSeed,
            wallet_address: address,
            network: config.KEETA_NETWORK,
            is_locked: false,
            auto_lock_timeout: DEFAULT_AUTO_LOCK_TIMEOUT,
            last_activity: Date.now()
        })

        // Keep account in memory
        this.currentAccount = account
        this.currentSeed = seed

        return address
    }

    /**
     * Unlock wallet with password
     */
    async unlockWallet (password: string): Promise<string> {
        const encryptedSeed = await getStorage('encrypted_seed')
        if (!encryptedSeed) {
            throw new Error('Wallet not initialized')
        }

        // Decrypt seed
        const seed = await decrypt(encryptedSeed, password)

        // Create account from seed
        const account = KeetaNet.lib.Account.fromSeed(seed, 0)
        const address = account.publicKeyString.get()

        // Update lock state
        await setStorageMultiple({
            is_locked: false,
            last_activity: Date.now()
        })

        // Keep account in memory
        this.currentAccount = account
        this.currentSeed = seed

        return address
    }

    /**
     * Lock wallet
     */
    async lockWallet (): Promise<void> {
        await setStorage('is_locked', true)
        // Don't clear while we have background order signing
        // this.currentAccount = null
        // this.currentSeed = null
    }

    /**
     * Get wallet address
     */
    async getAddress (): Promise<string> {
        const address = await getStorage('wallet_address')
        if (!address) {
            throw new Error('Wallet not initialized')
        }
        return address
    }

    /**
     * Get current network
     */
    async getNetwork (): Promise<NetworkType> {
        const network = await getStorage('network')
        return (network as NetworkType) || config.KEETA_NETWORK
    }

    /**
     * Set network
     */
    async setNetwork (network: NetworkType): Promise<void> {
        await setStorage('network', network)
    }

    /**
     * Get balance for the wallet
     */
    async getBalance (): Promise<BalanceInfo> {
        const address = await this.getAddress()
        const network = await this.getNetwork()
        const config = getConfigForNetwork(network)

        try {
            const response = await fetch(
                `${config.KEETA_API_URL}/node/ledger/account/${address}`
            )

            if (!response.ok) {
                throw new Error('Failed to fetch balance')
            }

            const data = await response.json()
            const balances = data.balances || []

            // Find base token balance
            const baseTokenBalance = balances.find(
                (b: any) => b.token === config.BASE_TOKEN
            )

            const resultBalance = baseTokenBalance?.balance || '0x0'

            return {
                balance: resultBalance,
                token: config.BASE_TOKEN
            }
        } catch (error) {
            console.error('Error fetching balance:', error)
            return {
                balance: '0x0',
                token: config.BASE_TOKEN
            }
        }
    }

    /**
     * Send transaction
     */
    async sendTransaction (request: TransactionRequest): Promise<TransactionResponse> {
        if (!this.currentAccount || !this.currentSeed) {
            throw new Error('Wallet is locked')
        }
        const network = await this.getNetwork()

        try {
            // Initialize Keeta client
            const networkName = network === 'test' ? 'test' : 'main'
            const client = await KeetaNet.UserClient.fromNetwork(networkName, this.currentAccount)

            // Clear any pending artifacts
            const pending = await client.pendingBlock()
            if (pending) {
                await client.recover()
            }
            await client.sync()

            // Create recipient account object
            const recipient = KeetaNet.lib.Account.fromPublicKeyString(request.to)

            // Determine token (base token or custom token)
            const tokenAccount = request.token === client.baseToken.publicKeyString.get()
                ? client.baseToken
                : KeetaNet.lib.Account.fromPublicKeyString(request.token)

            // Build and send transaction
            const builder = client.initBuilder()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            builder.send(recipient, BigInt(request.amount), tokenAccount as any)
            await client.publishBuilder(builder)

            // Clean up
            await client.destroy()

            // Update last activity
            await setStorage('last_activity', Date.now())

            return {
                hash: '',
                blockHeight: 0
            }
        } catch (error) {
            console.error('Error sending transaction:', error)
            throw new Error(
                error instanceof Error ? error.message : 'Transaction failed'
            )
        }
    }

    /**
     * Check auto-lock timeout
     */
    async checkAutoLock (): Promise<void> {
        const data = await getStorageMultiple([
            'is_locked',
            'last_activity',
            'auto_lock_timeout'
        ])

        if (data.is_locked) {
            return
        }

        const lastActivity = (data.last_activity as number) || 0
        const timeout = (data.auto_lock_timeout as number) || DEFAULT_AUTO_LOCK_TIMEOUT
        const now = Date.now()

        if (now - lastActivity > timeout) {
            await this.lockWallet()
        }
    }

    /**
     * Update last activity timestamp
     */
    async updateActivity (): Promise<void> {
        await setStorage('last_activity', Date.now())
    }

    /**
    /**
     * Get current seed (for order creation)
     */
    getSeed (): string | null {
        return this.currentSeed
    }

    /**
     * Get current account (for order creation)
     */
    getAccount (): any {
        return this.currentAccount
    }

    /**
     * Delete wallet (reset extension)
     */
    async deleteWallet (): Promise<void> {
        await clearStorage()
        this.currentAccount = null
        this.currentSeed = null
    }
}

export default WalletManager.getInstance()
