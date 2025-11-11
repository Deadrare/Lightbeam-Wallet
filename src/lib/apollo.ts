import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { StagingConfig, ProductionConfig } from '../config'
import WalletManager from '../core/WalletManager'

let apolloClient: ApolloClient<any> | null = null
let currentNetwork: 'test' | 'main' | null = null

/**
 * Fetch with timeout to prevent hanging requests
 */
const fetchWithTimeout = (url: RequestInfo | URL, options: RequestInit = {}, timeout = 60000) => {
    return new Promise<Response>((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Request timeout after ${timeout}ms`))
        }, timeout)

        fetch(url, options)
            .then(response => {
                clearTimeout(timer)
                resolve(response)
            })
            .catch(err => {
                clearTimeout(timer)
                reject(err)
            })
    })
}

export const getApolloClient = async (): Promise<ApolloClient<any>> => {
    const network = await WalletManager.getNetwork()

    // Reset client if network changed
    if (currentNetwork !== network) {
        apolloClient = null
        currentNetwork = network
    }

    if (!apolloClient) {
        const API_URL = network === 'main' ? ProductionConfig.API_URL : StagingConfig.API_URL

        apolloClient = new ApolloClient({
            link: new HttpLink({
                uri: API_URL,
                fetch: (uri, options) => fetchWithTimeout(uri, options, 120000) // 2 minute timeout for bulk operations
            }),
            cache: new InMemoryCache(),
            defaultOptions: {
                query: {
                    fetchPolicy: 'network-only',
                    errorPolicy: 'all'
                },
                mutate: {
                    errorPolicy: 'all'
                }
            }
        })
    }

    return apolloClient
}

export const resetApolloClient = () => {
    apolloClient = null
    currentNetwork = null
}
