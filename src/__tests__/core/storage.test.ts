import { getStorage, setStorage, removeStorage, clearStorage } from '@/core/storage'

describe('storage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('getStorage', () => {
        it('should get data from Chrome storage', async () => {
            const mockData = { wallet_address: 'keeta_test123' }
            ;(chrome.storage.local.get as jest.Mock).mockImplementation((_keys, callback) => {
                callback(mockData)
            })

            const result = await getStorage('wallet_address')

            expect(chrome.storage.local.get).toHaveBeenCalled()
            expect(result).toBe('keeta_test123')
        })

        it('should return undefined for missing key', async () => {
            const emptyData = {}
            ;(chrome.storage.local.get as jest.Mock).mockImplementation((_keys, callback) => {
                callback(emptyData)
            })

            const result = await getStorage('wallet_address')

            expect(result).toBeUndefined()
        })
    })

    describe('setStorage', () => {
        it('should set data in Chrome storage', async () => {
            // eslint-disable-next-line node/no-callback-literal
            (chrome.storage.local.set as jest.Mock).mockImplementation((_data, callback) => {
                callback?.()
            })

            await setStorage('wallet_address', 'keeta_test123')

            expect(chrome.storage.local.set).toHaveBeenCalled()
        })

        it('should handle errors', async () => {
            const error = new Error('Storage error')
            ;(chrome.storage.local.set as jest.Mock).mockImplementation(() => {
                throw error
            })

            await expect(setStorage('wallet_address', 'test')).rejects.toThrow('Storage error')
        })
    })

    describe('removeStorage', () => {
        it('should remove data from Chrome storage', async () => {
            (chrome.storage.local.remove as jest.Mock).mockImplementation((keys, callback) => {
                callback?.()
            })

            await removeStorage('wallet_address')

            expect(chrome.storage.local.remove).toHaveBeenCalled()
        })
    })

    describe('clearStorage', () => {
        it('should clear all Chrome storage', async () => {
            (chrome.storage.local.clear as jest.Mock).mockImplementation((callback) => {
                callback?.()
            })

            await clearStorage()

            expect(chrome.storage.local.clear).toHaveBeenCalled()
        })
    })
})
