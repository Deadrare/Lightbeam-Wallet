export type NetworkType = 'test' | 'main'

type Config = {
    API_URL: string
    DEPLOYMENT: string
    KEETA_NETWORK: NetworkType
    KEETA_API_URL: string
    DEX_ADDRESS: string
    BASE_TOKEN: string
    USDC_TOKEN: string
    AUTO_EXTEND_THRESHOLD_DAYS: number
    CHECK_ORDERS_PERIOD_MIN: number
    MINUTES_APART: number
    EXTENSION_DAYS: number
}

export const DEPLOYMENTS = {
    DEVELOPMENT: 'DEVELOPMENT',
    STAGING: 'STAGING',
    STAGING_LOCAL: 'STAGING_LOCAL',
    PRODUCTION: 'PRODUCTION',
    PRODUCTION_LOCAL: 'PRODUCTION_LOCAL'
}

const DefaultConfig: Config = {
    API_URL: 'http://0.0.0.0:8080',
    DEPLOYMENT: 'DEVELOPMENT',
    KEETA_NETWORK: 'test',
    KEETA_API_URL: 'https://rep2.test.network.api.keeta.com/api',
    DEX_ADDRESS: '',
    BASE_TOKEN: 'keeta_anyiff4v34alvumupagmdyosydeq24lc4def5mrpmmyhx3j6vj2uucckeqn52',
    USDC_TOKEN: 'keeta_antuh77tkl7empry3tw7ofk2s6erb2qr3rfzm5cp2mw2zyebbf2anw5iufcj6',

    // Auto-extend configuration
    AUTO_EXTEND_THRESHOLD_DAYS: 6,
    CHECK_ORDERS_PERIOD_MIN: 0.5,

    // Order block generation
    MINUTES_APART: 4,
    EXTENSION_DAYS: 1
}

export const DevelopmentConfig: Config = {
    ...DefaultConfig
}

export const StagingConfig: Config = {
    ...DefaultConfig,
    API_URL: 'https://router-staging.deadrare.io/',
    DEPLOYMENT: 'STAGING',
    KEETA_NETWORK: 'test',
    KEETA_API_URL: 'https://rep2.test.network.api.keeta.com/api',
    DEX_ADDRESS: 'keeta_aabne43iyphlgibdvdx2yy2tiuukmrhtnec5quvda6qszbd26w6npyiik3tg5wi',
    BASE_TOKEN: 'keeta_anyiff4v34alvumupagmdyosydeq24lc4def5mrpmmyhx3j6vj2uucckeqn52'
}

export const StagingLocalConfig: Config = {
    ...StagingConfig,
    DEPLOYMENT: 'STAGING_LOCAL'
}

export const ProductionConfig: Config = {
    ...DefaultConfig,
    API_URL: 'https://router.deadrare.io/',
    DEPLOYMENT: 'PRODUCTION',
    KEETA_NETWORK: 'main',
    KEETA_API_URL: 'https://rep2.main.network.api.keeta.com/api',
    DEX_ADDRESS: '',
    BASE_TOKEN: 'keeta_anqdilpazdekdu4acw65fj7smltcp26wbrildkqtszqvverljpwpezmd44ssg',
    USDC_TOKEN: '22Nb9JajRpAh9A2fWNgoKt867PA6zNyi541rtoraDfKXV'
}

export const ProductionLocalConfig: Config = {
    ...ProductionConfig,
    DEPLOYMENT: 'PRODUCTION_LOCAL'
}

const getConfig = (): Config => {
    // Network is now determined by user selection stored in chrome.storage
    // This will be initialized asynchronously, so we return a default
    // The actual config will be retrieved via getConfigForNetwork()
    return StagingConfig // Default to testnet
}

/**
 * Get configuration for a specific network
 */
export const getConfigForNetwork = (network: NetworkType): Config => {
    if (network === 'main') {
        return ProductionConfig
    }
    return StagingConfig
}

/**
 * Get current network from storage
 */
export const getCurrentNetwork = async (): Promise<NetworkType> => {
    // Try to get from chrome.storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
        try {
            const result = await chrome.storage.local.get('wallet_network')
            return (result.wallet_network as NetworkType) || 'test'
        } catch (error) {
            console.error('Failed to get network from storage:', error)
        }
    }
    return 'test' // Default to testnet
}

/**
 * Set current network in storage
 */
export const setCurrentNetwork = async (network: NetworkType): Promise<void> => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.set({ wallet_network: network })
    }
}

/**
 * Get current configuration based on stored network
 */
export const getCurrentConfig = async (): Promise<Config> => {
    const network = await getCurrentNetwork()
    return getConfigForNetwork(network)
}

export default getConfig

export const config = getConfig()
