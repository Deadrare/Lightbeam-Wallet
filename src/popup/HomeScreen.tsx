/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect } from 'react'
import { Copy, Send, Download, Lock, Settings, RefreshCw } from 'lucide-react'
import Avatar from 'boring-avatars'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'
import { Avatar as ShadcnAvatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription
} from '@/components/ui/Drawer'
import { sendMessage } from '@/lib/messaging'
import { MessageType } from '@/core/types'
import { truncateAddress, copyToClipboard } from '@/lib/utils'
import formatPrice from '@/utils/formatPrice'
import { SendScreen } from './SendScreen'
import { ReceiveScreen } from './ReceiveScreen'
import { SettingsScreen } from './SettingsScreen'
import { OrdersScreen } from './OrdersScreen'
import { StagingConfig, ProductionConfig } from '@/config'
import { listingsBulkByCollection } from '@/queries/listingsBulkByCollection'

type Screen = 'home' | 'receive' | 'settings' | 'orders'

interface TokenBalance {
    token: string
    balance: string
}

interface TokenWithMetadata extends TokenBalance {
    name?: string
    imageUrl?: string
    decimals?: number
}

interface OnChainTokenMetadata {
    token: string
    name: string
    description?: string
    decimals: number
}

/**
 * Fetch token metadata from Keeta blockchain
 */
async function fetchTokenMetadataFromKeeta (
    tokenAddress: string,
    networkConfig: typeof StagingConfig | typeof ProductionConfig
): Promise<OnChainTokenMetadata | null> {
    try {
        const response = await fetch(`${networkConfig.KEETA_API_URL}/node/ledger/account/${tokenAddress}`)
        if (!response.ok) {
            return null
        }
        const data = await response.json()

        // Decode the metadata field if it exists
        let decimalPlaces = 9 // Default to 9 decimals
        if (data.info?.metadata) {
            try {
                const decodedMetadata = JSON.parse(atob(data.info.metadata))
                decimalPlaces = decodedMetadata.decimalPlaces || 0
            } catch (e) {
                console.error('Failed to decode metadata for', tokenAddress, e)
            }
        }

        return {
            token: tokenAddress,
            name: data.info?.name || tokenAddress.slice(0, 10),
            description: data.info?.description,
            decimals: decimalPlaces
        }
    } catch (error) {
        console.error('Failed to fetch metadata for', tokenAddress, error)
        return null
    }
}

const convertHexToDecimal = (balance: string, decimals?: number): string => {
    try {
        const balanceHex = balance.startsWith('0x') ? balance.slice(2) : balance
        const balanceBigInt = BigInt('0x' + balanceHex)
        const tokenDecimals = decimals ?? 9 // KTA uses 9 decimals by default
        const divisor = 10n ** BigInt(tokenDecimals)
        const wholePart = balanceBigInt / divisor
        const fractionalPart = balanceBigInt % divisor
        const fractionalStr = fractionalPart.toString().padStart(tokenDecimals, '0')
        const trimmedFractional = fractionalStr.replace(/0+$/, '')

        if (trimmedFractional) {
            return `${wholePart.toString()}.${trimmedFractional}`
        }
        return wholePart.toString()
    } catch {
        return '0'
    }
}

export const HomeScreen: React.FC = () => {
    const [screen, setScreen] = useState<Screen>('home')
    const [address, setAddress] = useState('')
    const [balance, setBalance] = useState('0')
    const [network, setNetwork] = useState<'test' | 'main'>('test')
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [tokenBalances, setTokenBalances] = useState<TokenWithMetadata[]>([])
    const [ktaMetadata, setKtaMetadata] = useState<{ token: string; name: string; decimals: number; slug: string } | null>(null)
    const [sendDrawerOpen, setSendDrawerOpen] = useState(false)
    const [selectedToken, setSelectedToken] = useState<{ token: string; name?: string; decimals?: number; balance?: string } | null>(null)

    useEffect(() => {
        loadWalletData()

        // Listen for network changes
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
            if (areaName === 'local' && changes.wallet_network) {
                // Network changed, reload wallet data
                loadWalletData()
            }
        }

        chrome.storage.onChanged.addListener(handleStorageChange)

        // Auto-refresh every 10 seconds
        const refreshInterval = setInterval(() => {
            loadWalletData(false) // Pass false to skip showing loading state
        }, 10000)

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange)
            clearInterval(refreshInterval)
        }
    }, [])

    const loadWalletData = async (showLoading = true) => {
        if (showLoading) {
            setLoading(true)
        }
        try {
            const [addressData, balanceData, networkData] = await Promise.all([
                sendMessage<{ address: string }>(MessageType.GET_ADDRESS),
                sendMessage<{ balance: string }>(MessageType.GET_BALANCE),
                sendMessage<{ network: 'test' | 'main' }>(MessageType.GET_NETWORK)
            ])

            setAddress(addressData.address)
            setBalance(balanceData.balance)
            setNetwork(networkData.network)

            // Fetch KTA metadata from Keeta blockchain
            try {
                const networkConfig = networkData.network === 'main' ? ProductionConfig : StagingConfig
                const ktaMetadata = await fetchTokenMetadataFromKeeta(networkConfig.BASE_TOKEN, networkConfig)

                if (ktaMetadata) {
                    setKtaMetadata({
                        token: ktaMetadata.token,
                        slug: 'KTA',
                        name: ktaMetadata.name,
                        decimals: ktaMetadata.decimals
                    })
                } else {
                    console.error('Failed to fetch KTA metadata from Keeta')
                }
            } catch (error) {
                console.error('Failed to fetch KTA metadata:', error)
            }

            // Fetch all token balances
            await loadTokenBalances(addressData.address, networkData.network)
        } catch (err) {
            console.error('Failed to load wallet data:', err)
        } finally {
            if (showLoading) {
                setLoading(false)
            }
        }
    }

    const loadTokenBalances = async (addr: string, net: 'test' | 'main') => {
        try {
            // Get the appropriate config for the network
            const networkConfig = net === 'main' ? ProductionConfig : StagingConfig

            const response = await fetch(`${networkConfig.KEETA_API_URL}/node/ledger/account/${addr}`)
            if (!response.ok) {
                throw new Error('Failed to fetch token balances')
            }

            const data = await response.json()
            const balances = data.balances || []

            // Ensure base token is always included, even with zero balance
            const baseTokenInBalances = balances.find((b: TokenBalance) => b.token === networkConfig.BASE_TOKEN)
            if (!baseTokenInBalances) {
                balances.push({
                    token: networkConfig.BASE_TOKEN,
                    balance: '0x0'
                })
            }

            // Fetch metadata for tokens
            if (balances.length > 0) {
                const tokensWithMetadata = await fetchTokenMetadata(balances, net)
                setTokenBalances(tokensWithMetadata)
            } else {
                setTokenBalances([])
            }
        } catch (error) {
            console.error('Error fetching token balances:', error)
            setTokenBalances([])
        }
    }

    const fetchTokenMetadata = async (tokens: TokenBalance[], net: 'test' | 'main'): Promise<TokenWithMetadata[]> => {
        try {
            const networkConfig = net === 'main' ? ProductionConfig : StagingConfig
            const tokenIds = tokens.map(t => t.token)

            // Fetch on-chain metadata from Keeta for each token
            const metadataPromises = tokenIds.map(tokenAddress =>
                fetchTokenMetadataFromKeeta(tokenAddress, networkConfig)
            )

            const onChainMetadata = await Promise.all(metadataPromises)
            const metadataMap = new Map(
                onChainMetadata
                    .filter((m): m is NonNullable<typeof m> => m !== null)
                    .map(m => [m.token, m])
            )

            // Fetch images from GraphQL (only field we need from there)
            let imageMap = new Map<string, string>()
            try {
                const graphqlMetadata = await listingsBulkByCollection(tokenIds)
                imageMap = new Map(
                    Array.from(graphqlMetadata.entries()).map(([token, data]) => [token, data.imageUrl])
                )
            } catch (error) {
                console.error('Error fetching token images from GraphQL:', error)
            }

            // Merge balances with on-chain metadata and GraphQL images
            return tokens.map(token => {
                const metadata = metadataMap.get(token.token)
                return {
                    ...token,
                    name: metadata?.name,
                    imageUrl: imageMap.get(token.token),
                    decimals: metadata?.decimals
                }
            })
        } catch (error) {
            console.error('Error fetching token metadata:', error)
            // Return tokens without metadata on error
            return tokens.map(token => ({ ...token }))
        }
    }

    const handleCopyAddress = async () => {
        const success = await copyToClipboard(address)
        if (success) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleLock = async () => {
        await sendMessage(MessageType.LOCK_WALLET)
        window.location.reload()
    }

    const handleRefresh = () => {
        loadWalletData()
    }

    const handleOpenSendDrawer = (token?: string, name?: string, decimals?: number, balance?: string) => {
        setSelectedToken(token ? { token, name, decimals, balance } : null)
        setSendDrawerOpen(true)
    }

    const handleCloseSendDrawer = () => {
        setSendDrawerOpen(false)
        setSelectedToken(null)
        loadWalletData()
    }

    if (screen === 'receive') {
        return <ReceiveScreen address={address} onBack={() => setScreen('home')} />
    }
    if (screen === 'settings') {
        return <SettingsScreen onBack={() => setScreen('home')} onNavigateToOrders={() => setScreen('orders')} />
    }

    if (screen === 'orders') {
        return <OrdersScreen onBack={() => setScreen('settings')} />
    }

    return (
        <div className='p-4 space-y-6'>
            {/* Header */}
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                    <Avatar
                        size={32}
                        name={address}
                        variant='beam'
                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                    />
                    <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={handleCopyAddress}
                                className='text-sm font-medium hover:text-muted-foreground transition-colors flex items-center gap-1'
                            >
                                {truncateAddress(address, 6)}
                                <Copy className='w-3 h-3' />
                            </button>
                            {copied && <span className='text-xs text-muted-foreground'>Copied!</span>}
                        </div>
                        <span className='text-xs px-1.5 py-0.5 rounded text-muted-foreground bg-background-3 self-start'>
                            {network === 'test' ? 'Testnet' : 'Mainnet'}
                        </span>
                    </div>
                </div>
                <div className='flex items-center gap-1'>
                    <Button variant='ghost' size='sm' onClick={handleRefresh}>
                        <RefreshCw className='w-4 h-4' />
                    </Button>
                    <Button variant='ghost' size='sm' onClick={() => setScreen('settings')}>
                        <Settings className='w-4 h-4' />
                    </Button>
                    <Button variant='ghost' size='sm' onClick={handleLock}>
                        <Lock className='w-4 h-4' />
                    </Button>
                </div>
            </div>

            {/* Balance Section */}
            <div className='flex flex-col items-center gap-3 py-6'>
                {loading
                    ? (
                        <>
                            <Skeleton className='h-14 w-[280px]' />
                            <Skeleton className='h-5 w-[80px]' />
                        </>
                    )
                    : (
                        <>
                            <div className='flex flex-col items-center'>
                                <div className='text-3xl font-bold'>{formatPrice(convertHexToDecimal(balance, ktaMetadata?.decimals))}</div>
                                <div className='text-sm text-muted-foreground'>{ktaMetadata?.name || 'KTA'}</div>
                            </div>
                        </>
                    )}
            </div>

            {/* Actions */}
            <div className='grid grid-cols-2 gap-3'>
                <Button
                    onClick={() => handleOpenSendDrawer(ktaMetadata?.token, ktaMetadata?.name, ktaMetadata?.decimals, balance)}
                    variant='outline'
                    size='lg'
                    disabled={!ktaMetadata}
                >
                    <Send className='w-5 h-5 mr-2' />
                    Send
                </Button>
                <Button
                    onClick={() => setScreen('receive')}
                    variant='outline'
                    size='lg'
                >
                    <Download className='w-5 h-5 mr-2' />
                    Receive
                </Button>
            </div>

            {/* Token List */}
            {!loading && tokenBalances.length > 0 && (
                <div className='space-y-2'>
                    <h3 className='text-sm font-medium text-muted-foreground px-1'>Tokens</h3>
                    <div className='space-y-2'>
                        {tokenBalances.map((tokenBalance) => (
                            <Card
                                key={tokenBalance.token}
                                className='flex items-center justify-between p-3 cursor-pointer hover:bg-accent transition-colors'
                                onClick={() => handleOpenSendDrawer(tokenBalance.token, tokenBalance.name, tokenBalance.decimals, tokenBalance.balance)}
                            >
                                <div className='flex items-center gap-3'>
                                    <ShadcnAvatar className='h-8 w-8'>
                                        <AvatarImage src={tokenBalance.imageUrl} alt={tokenBalance.name || 'Token'} />
                                        <AvatarFallback className='text-xs font-medium'>
                                            {tokenBalance.name
                                                ? tokenBalance.name.slice(0, 2).toUpperCase()
                                                : truncateAddress(tokenBalance.token, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </ShadcnAvatar>
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-medium'>
                                            {tokenBalance.name || truncateAddress(tokenBalance.token, 8)}
                                        </span>
                                        {tokenBalance.name && (
                                            <span className='text-xs text-muted-foreground'>
                                                {truncateAddress(tokenBalance.token, 8)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <div className='text-sm font-medium'>
                                        {formatPrice(convertHexToDecimal(tokenBalance.balance, tokenBalance.decimals))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Send Drawer */}
            <Drawer open={sendDrawerOpen} onOpenChange={setSendDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Send {selectedToken?.name || 'KTA'}</DrawerTitle>
                        <DrawerDescription>
                            Transfer tokens to another address
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className='px-4 pb-4'>
                        <SendScreen
                            onBack={handleCloseSendDrawer}
                            token={selectedToken?.token}
                            tokenName={selectedToken?.name}
                            tokenDecimals={selectedToken?.decimals}
                            tokenBalance={selectedToken?.balance}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
