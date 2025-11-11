import { WalletManager } from '@/core/WalletManager'
import * as crypto from '@/core/crypto'
import * as storage from '@/core/storage'

jest.mock('@/core/crypto')
jest.mock('@/core/storage')
jest.mock('@keetanetwork/keetanet-client', () => ({
    __esModule: true,
    default: {
        lib: {
            Account: {
                seedFromPassphrase: jest.fn().mockResolvedValue('mock_seed'),
                fromSeed: jest.fn().mockReturnValue({
                    publicKeyString: {
                        get: jest.fn().mockReturnValue('keeta_mock_address_12345')
                    }
                })
            }
        }
    }
}))

describe('WalletManager', () => {
    let walletManager: WalletManager

    beforeEach(() => {
        walletManager = WalletManager.getInstance()
        jest.clearAllMocks()
    })

    describe('getInstance', () => {
        it('should return singleton instance', () => {
            const instance1 = WalletManager.getInstance()
            const instance2 = WalletManager.getInstance()

            expect(instance1).toBe(instance2)
        })
    })

    describe('createWallet', () => {
        const testPassword = 'testPassword123!'

        beforeEach(() => {
            (crypto.encrypt as jest.Mock).mockResolvedValue('encrypted_seed')
            ;(storage.setStorageMultiple as jest.Mock).mockResolvedValue(undefined)
        })

        it('should create a new wallet with 12-word mnemonic', async () => {
            const result = await walletManager.createWallet(testPassword)

            expect(result).toHaveProperty('mnemonic')
            expect(result).toHaveProperty('address')
            expect(result.mnemonic.split(' ')).toHaveLength(12)
        })

        it('should store encrypted seed and address', async () => {
            await walletManager.createWallet(testPassword)

            expect(storage.setStorageMultiple).toHaveBeenCalled()
            expect(crypto.encrypt).toHaveBeenCalled()
        })
    })

    describe('importWallet', () => {
        const testPassword = 'testPassword123!'
        const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'

        beforeEach(() => {
            (crypto.encrypt as jest.Mock).mockResolvedValue('encrypted_seed')
            ;(storage.setStorageMultiple as jest.Mock).mockResolvedValue(undefined)
        })

        it('should import wallet from valid mnemonic', async () => {
            const result = await walletManager.importWallet(testMnemonic, testPassword)

            expect(result).toBeDefined()
            expect(typeof result).toBe('string')
        })

        it('should reject invalid mnemonic', async () => {
            const invalidMnemonic = 'invalid mnemonic phrase'

            await expect(
                walletManager.importWallet(invalidMnemonic, testPassword)
            ).rejects.toThrow()
        })
    })

    describe('unlockWallet', () => {
        const testPassword = 'testPassword123!'
        const testSeed = 'mock_seed'

        beforeEach(() => {
            (storage.getStorage as jest.Mock).mockImplementation((key) => {
                if (key === 'encrypted_seed') return Promise.resolve('encrypted_seed')
                return Promise.resolve(null)
            })
            ;(crypto.decrypt as jest.Mock).mockResolvedValue(testSeed)
            ;(storage.setStorage as jest.Mock).mockResolvedValue(undefined)
        })

        it('should unlock wallet with correct password', async () => {
            await walletManager.unlockWallet(testPassword)

            expect(storage.getStorage).toHaveBeenCalledWith('encrypted_seed')
            expect(crypto.decrypt).toHaveBeenCalledWith('encrypted_seed', testPassword)
        })

        it('should throw error if no wallet exists', async () => {
            (storage.getStorage as jest.Mock).mockResolvedValue(null)

            await expect(
                walletManager.unlockWallet(testPassword)
            ).rejects.toThrow()
        })
    })

    describe('lockWallet', () => {
        it('should lock the wallet', async () => {
            (storage.setStorage as jest.Mock).mockResolvedValue(undefined)

            await walletManager.lockWallet()

            expect(storage.setStorage).toHaveBeenCalledWith('is_locked', true)
        })
    })

    describe('isLocked', () => {
        it('should return true when wallet is locked', async () => {
            (storage.getStorage as jest.Mock).mockResolvedValue(true)

            const result = await walletManager.isLocked()

            expect(result).toBe(true)
        })

        it('should return false when wallet is unlocked', async () => {
            (storage.getStorage as jest.Mock).mockResolvedValue(false)

            const result = await walletManager.isLocked()

            expect(result).toBe(false)
        })
    })

    describe('isInitialized', () => {
        it('should return true when wallet exists', async () => {
            (storage.getStorage as jest.Mock).mockResolvedValue('encrypted_seed')

            const result = await walletManager.isInitialized()

            expect(result).toBe(true)
        })

        it('should return false when no wallet exists', async () => {
            (storage.getStorage as jest.Mock).mockResolvedValue(null)

            const result = await walletManager.isInitialized()

            expect(result).toBe(false)
        })
    })

    describe('getAddress', () => {
        it('should return stored wallet address', async () => {
            const testAddress = 'keeta_test123'
            ;(storage.getStorage as jest.Mock).mockResolvedValue(testAddress)

            const result = await walletManager.getAddress()

            expect(result).toBe(testAddress)
        })

        it('should return undefined when no address stored', async () => {
            (storage.getStorage as jest.Mock).mockResolvedValue(undefined)

            await expect(
                walletManager.getAddress()
            ).rejects.toThrow('Wallet not initialized')
        })
    })

    describe('getNetwork', () => {
        it('should return stored network', async () => {
            (storage.getStorage as jest.Mock).mockResolvedValue('main')

            const result = await walletManager.getNetwork()

            expect(result).toBe('main')
        })

        it('should return default network if none stored', async () => {
            (storage.getStorage as jest.Mock).mockResolvedValue(null)

            const result = await walletManager.getNetwork()

            expect(result).toBe('test')
        })
    })

    describe('setNetwork', () => {
        it('should set network', async () => {
            (storage.setStorage as jest.Mock).mockResolvedValue(undefined)

            await walletManager.setNetwork('main')

            expect(storage.setStorage).toHaveBeenCalledWith('network', 'main')
        })
    })
})
