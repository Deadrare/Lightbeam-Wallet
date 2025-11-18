// Inpage script - injected into web pages to provide window.keeta
// This runs in the page context, not the extension context

(function () {
    'use strict'

    class KeetaProvider {
        private _connected = false
        private _accounts: string[] = []
        private _listeners: Record<string, ((data: any) => void)[]> = {}
        private _network: 'test' | 'main' = 'test'

        async connect (network?: 'test' | 'main'): Promise<string[]> {
            return new Promise((resolve, reject) => {
                const requestId = Math.random().toString(36)

                window.postMessage({
                    type: 'KEETA_CONNECT_REQUEST',
                    requestId,
                    data: { network }
                }, '*')

                const handleResponse = (event: MessageEvent) => {
                    if (event.data.type === 'KEETA_CONNECT_RESPONSE' &&
                        event.data.requestId === requestId) {
                        window.removeEventListener('message', handleResponse)

                        if (event.data.error) {
                            reject(new Error(event.data.error))
                        } else {
                            this._connected = true
                            this._accounts = event.data.accounts || []
                            if (event.data.network) {
                                this._network = event.data.network
                            }
                            resolve(this._accounts)
                        }
                    }
                }

                window.addEventListener('message', handleResponse)

                // Timeout after 30 seconds
                setTimeout(() => {
                    window.removeEventListener('message', handleResponse)
                    reject(new Error('Connection timeout'))
                }, 180000)
            })
        }

        async getAccounts (): Promise<string[]> {
            return new Promise((resolve, reject) => {
                const requestId = Math.random().toString(36)

                window.postMessage({
                    type: 'KEETA_GET_ACCOUNTS_REQUEST',
                    requestId
                }, '*')

                const handleResponse = (event: MessageEvent) => {
                    if (event.data.type === 'KEETA_GET_ACCOUNTS_RESPONSE' &&
                        event.data.requestId === requestId) {
                        window.removeEventListener('message', handleResponse)

                        if (event.data.error) {
                            reject(new Error(event.data.error))
                        } else {
                            this._accounts = event.data.accounts || []
                            resolve(this._accounts)
                        }
                    }
                }

                window.addEventListener('message', handleResponse)

                setTimeout(() => {
                    window.removeEventListener('message', handleResponse)
                    reject(new Error('Request timeout'))
                }, 180000)
            })
        }

        async sendTransaction (to: string, amount: string, token?: string, network?: 'test' | 'main'): Promise<{
            hash: string
            success: boolean
            error?: string
        }> {
            if (!to) {
                throw new Error('Recipient address is required')
            }

            if (!amount) {
                throw new Error('Amount is required')
            }

            return new Promise((resolve, reject) => {
                const requestId = Math.random().toString(36)

                window.postMessage(
                    {
                        type: 'KEETA_SEND_TRANSACTION_REQUEST',
                        requestId,
                        data: { to, amount, token, network }
                    },
                    '*'
                )

                const handleResponse = (event: MessageEvent) => {
                    if (event.data.type === 'KEETA_SEND_TRANSACTION_RESPONSE' &&
                        event.data.requestId === requestId) {
                        window.removeEventListener('message', handleResponse)

                        if (event.data.error) {
                            reject(new Error(event.data.error))
                        } else {
                            resolve(event.data.result)
                        }
                    }
                }

                window.addEventListener('message', handleResponse)

                setTimeout(() => {
                    window.removeEventListener('message', handleResponse)
                    reject(new Error('Transaction request timeout'))
                }, 180000)
            })
        }

        async createOrders (ordersData: {
            orders: Array<{
                firstTokenAddress: string
                secondTokenAddress: string
                buyAmount: string
                sellAmount: string
                orderType: boolean
                priceDigits: number
                priceZeros: number
            }>
            dexAddress: string
            network?: 'test' | 'main'
        }): Promise<{ orderIds: string[]; success: boolean; orders?: any[] }> {
            const { orders, dexAddress, network } = ordersData

            if (!Array.isArray(orders)) {
                throw new Error('Invalid orders array')
            }

            if (!dexAddress) {
                throw new Error('DEX address is required')
            }

            return new Promise((resolve, reject) => {
                const requestId = Math.random().toString(36)

                window.postMessage(
                    {
                        type: 'KEETA_CREATE_ORDERS_REQUEST',
                        requestId,
                        data: { orders, dexAddress, network }
                    },
                    '*'
                )

                const handleResponse = (event: MessageEvent) => {
                    if (event.data.type === 'KEETA_CREATE_ORDERS_RESPONSE' &&
                        event.data.requestId === requestId) {
                        window.removeEventListener('message', handleResponse)

                        if (event.data.error) {
                            reject(new Error(event.data.error))
                        } else {
                            resolve(event.data.result)
                        }
                    }
                }

                window.addEventListener('message', handleResponse)

                setTimeout(() => {
                    window.removeEventListener('message', handleResponse)
                    reject(new Error('Request timeout'))
                }, 180000)
            })
        }

        async getNetwork (): Promise<'test' | 'main'> {
            return new Promise((resolve, reject) => {
                const requestId = Math.random().toString(36)

                window.postMessage(
                    {
                        type: 'KEETA_GET_NETWORK_REQUEST',
                        requestId
                    },
                    '*'
                )

                const handleResponse = (event: MessageEvent) => {
                    if (event.data.type === 'KEETA_GET_NETWORK_RESPONSE' &&
                        event.data.requestId === requestId) {
                        window.removeEventListener('message', handleResponse)

                        if (event.data.error) {
                            reject(new Error(event.data.error))
                        } else {
                            this._network = event.data.result
                            resolve(event.data.result)
                        }
                    }
                }

                window.addEventListener('message', handleResponse)

                setTimeout(() => {
                    window.removeEventListener('message', handleResponse)
                    reject(new Error('Request timeout'))
                }, 30000)
            })
        }

        async setNetwork (network: 'test' | 'main'): Promise<void> {
            return new Promise((resolve, reject) => {
                const requestId = Math.random().toString(36)

                window.postMessage(
                    {
                        type: 'KEETA_SET_NETWORK_REQUEST',
                        requestId,
                        data: { network }
                    },
                    '*'
                )

                const handleResponse = (event: MessageEvent) => {
                    if (event.data.type === 'KEETA_SET_NETWORK_RESPONSE' &&
                        event.data.requestId === requestId) {
                        window.removeEventListener('message', handleResponse)

                        if (event.data.error) {
                            reject(new Error(event.data.error))
                        } else {
                            this._network = network
                            resolve()
                        }
                    }
                }

                window.addEventListener('message', handleResponse)

                setTimeout(() => {
                    window.removeEventListener('message', handleResponse)
                    reject(new Error('Request timeout'))
                }, 30000)
            })
        }

        async recoverFromStorage (storageAddresses: string[], network?: 'test' | 'main'): Promise<{
            success: boolean
            recovered: string[]
            failed: string[]
            details: string
        }> {
            if (!Array.isArray(storageAddresses) || storageAddresses.length === 0) {
                throw new Error('Invalid storage addresses array')
            }

            return new Promise((resolve, reject) => {
                const requestId = Math.random().toString(36)

                window.postMessage(
                    {
                        type: 'KEETA_RECOVER_FROM_STORAGE_REQUEST',
                        requestId,
                        data: { storageAddresses, network }
                    },
                    '*'
                )

                const handleResponse = (event: MessageEvent) => {
                    if (event.data.type === 'KEETA_RECOVER_FROM_STORAGE_RESPONSE' &&
                        event.data.requestId === requestId) {
                        window.removeEventListener('message', handleResponse)

                        if (event.data.error) {
                            reject(new Error(event.data.error))
                        } else {
                            resolve(event.data.result)
                        }
                    }
                }

                window.addEventListener('message', handleResponse)

                setTimeout(() => {
                    window.removeEventListener('message', handleResponse)
                    reject(new Error('Recovery timeout'))
                }, 180000) // 180 second timeout for recovery
            })
        }

        async getStoragePoolSize (): Promise<number> {
            return new Promise((resolve, reject) => {
                const requestId = Math.random().toString(36)

                window.postMessage(
                    {
                        type: 'KEETA_GET_STORAGE_POOL_SIZE_REQUEST',
                        requestId
                    },
                    '*'
                )

                const handleResponse = (event: MessageEvent) => {
                    if (event.data.type === 'KEETA_GET_STORAGE_POOL_SIZE_RESPONSE' &&
                        event.data.requestId === requestId) {
                        window.removeEventListener('message', handleResponse)

                        if (event.data.error) {
                            reject(new Error(event.data.error))
                        } else {
                            resolve(event.data.size)
                        }
                    }
                }

                window.addEventListener('message', handleResponse)

                setTimeout(() => {
                    window.removeEventListener('message', handleResponse)
                    reject(new Error('Request timeout'))
                }, 180000)
            })
        }

        async getStoragePoolEnabled (): Promise<boolean> {
            return new Promise((resolve, reject) => {
                const requestId = Math.random().toString(36)

                window.postMessage(
                    {
                        type: 'KEETA_GET_STORAGE_POOL_ENABLED_REQUEST',
                        requestId
                    },
                    '*'
                )

                const handleResponse = (event: MessageEvent) => {
                    if (event.data.type === 'KEETA_GET_STORAGE_POOL_ENABLED_RESPONSE' &&
                        event.data.requestId === requestId) {
                        window.removeEventListener('message', handleResponse)

                        if (event.data.error) {
                            reject(new Error(event.data.error))
                        } else {
                            resolve(event.data.enabled)
                        }
                    }
                }

                window.addEventListener('message', handleResponse)

                setTimeout(() => {
                    window.removeEventListener('message', handleResponse)
                    reject(new Error('Request timeout'))
                }, 180000)
            })
        }

        async enableStoragePool (): Promise<boolean> {
            return new Promise((resolve, reject) => {
                const requestId = Math.random().toString(36)

                window.postMessage(
                    {
                        type: 'KEETA_ENABLE_STORAGE_POOL_REQUEST',
                        requestId
                    },
                    '*'
                )

                const handleResponse = (event: MessageEvent) => {
                    if (event.data.type === 'KEETA_ENABLE_STORAGE_POOL_RESPONSE' &&
                        event.data.requestId === requestId) {
                        window.removeEventListener('message', handleResponse)

                        if (event.data.error) {
                            reject(new Error(event.data.error))
                        } else {
                            resolve(event.data.success)
                        }
                    }
                }

                window.addEventListener('message', handleResponse)

                setTimeout(() => {
                    window.removeEventListener('message', handleResponse)
                    reject(new Error('Request timeout'))
                }, 180000)
            })
        }

        isConnected (): boolean {
            return this._connected
        }

        on (event: string, callback: (data: any) => void): void {
            if (!this._listeners[event]) {
                this._listeners[event] = []
            }
            this._listeners[event].push(callback)
        }

        off (event: string, callback: (data: any) => void): void {
            if (!this._listeners[event]) return
            this._listeners[event] = this._listeners[event].filter(cb => cb !== callback)
        }

        _emit (event: string, data: any): void {
            if (!this._listeners[event]) return
            this._listeners[event].forEach(callback => {
                try {
                    callback(data)
                } catch (err) {
                    console.error('Keeta provider event error:', err)
                }
            })
        }
    }

    // Create and expose provider
    (window as any).keeta = new KeetaProvider()

    // Dispatch event to notify page that provider is ready
    window.dispatchEvent(new Event('keeta#initialized'))
})()
