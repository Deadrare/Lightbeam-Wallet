/**
 * Recover funds from storage accounts back to main wallet
 * Used when order creation fails or to clean up abandoned storage accounts
 */

import * as KeetaNetModule from '@keetanetwork/keetanet-client'
import { sendFromStorageAccount } from './sendFromStorageAccount'

// @ts-expect-error - default export may not be available
const KeetaNet = KeetaNetModule.default || KeetaNetModule

export async function recoverFromStorageAccounts (
    storageAddresses: string[],
    currentSeed: string,
    network: 'test' | 'main',
    requestId?: string
): Promise<{ success: boolean; recovered: string[]; failed: string[]; details: string }> {
    const updateProgress = async (message: string, value: number) => {
        if (requestId) {
            await chrome.storage.local.set({
                [`recovery_progress_${requestId}`]: {
                    message,
                    value,
                    timestamp: Date.now()
                }
            })
        }
    }

    if (!storageAddresses || storageAddresses.length === 0) {
        return { success: true, recovered: [], failed: [], details: 'No storage accounts to recover' }
    }

    try {
        await updateProgress('Initializing wallet...', 5)

        // Create account from seed for signing operations
        const signerAccount = KeetaNet.lib.Account.fromSeed(currentSeed, 0)
        const ownerAddress = signerAccount.publicKeyString.get()

        await updateProgress('Connecting to network...', 10)

        // Initialize Keeta client
        const networkName = network === 'test' ? 'test' : 'main'
        const client = await KeetaNet.UserClient.fromNetwork(networkName, signerAccount)

        await updateProgress('Syncing blockchain...', 15)

        // Sync blockchain - this will handle any pending blocks
        await client.sync()

        const recovered: string[] = []
        const failed: string[] = []
        const details: string[] = []

        const totalAccounts = storageAddresses.length

        // Process each storage account
        for (let i = 0; i < storageAddresses.length; i++) {
            const storageAddress = storageAddresses[i]
            const accountNumber = i + 1
            const progressPerAccount = 70 / totalAccounts
            const accountStartProgress = 20 + (i * progressPerAccount)

            try {
                await updateProgress(`Checking account ${accountNumber} of ${totalAccounts}...`, accountStartProgress)

                console.log(`Recovering all tokens from storage account: ${storageAddress}`)
                const storageAccount = KeetaNet.lib.Account.fromPublicKeyString(storageAddress)

                // Get the storage account's balances
                const balances = await client.client.getAllBalances(storageAccount)

                if (!balances || balances.length === 0) {
                    console.log(`Storage account ${storageAddress} has no balances`)
                    details.push(`${storageAddress}: No balances found`)
                    recovered.push(storageAddress)
                    continue
                }

                // Log account balances for debugging
                console.log(`Storage account ${storageAddress} balances:`, {
                    balances: balances.map((b: { token: { publicKeyString: { get: () => string } }; balance: bigint }) => ({ token: b.token.publicKeyString.get(), balance: b.balance.toString() }))
                })

                let recoveredTokens = 0

                // Recover all tokens from this storage account
                for (const balanceEntry of balances) {
                    const tokenId = balanceEntry.token.publicKeyString.get()
                    const tokenBalance = balanceEntry.balance

                    if (tokenBalance > 0n) {
                        console.log(`Recovering ${tokenBalance} of token ${tokenId} from ${storageAddress}`)

                        await updateProgress(`Recovering tokens from account ${accountNumber}...`, accountStartProgress + (progressPerAccount * 0.5))

                        // Use sendFromStorageAccount to send tokens back to owner
                        await sendFromStorageAccount(
                            client,
                            signerAccount,
                            storageAddress,
                            ownerAddress,
                            tokenId,
                            tokenBalance.toString()
                        )

                        recoveredTokens++
                        console.log(`Successfully recovered ${tokenBalance} of token ${tokenId} from ${storageAddress}`)
                    }
                }

                if (recoveredTokens > 0) {
                    details.push(`${storageAddress}: Recovered ${recoveredTokens} token type(s)`)
                } else {
                    details.push(`${storageAddress}: No token balances to recover (might already be recovered)`)
                }

                recovered.push(storageAddress)
            } catch (error) {
                console.error(`Failed to recover from storage account ${storageAddress}:`, error)
                const errorMsg = error instanceof Error ? error.message : 'Unknown error'
                details.push(`${storageAddress}: Failed - ${errorMsg}`)
                failed.push(storageAddress)
            }
        }

        await updateProgress('Finalizing recovery...', 95)

        // Clean up
        await client.destroy()

        const summary = `Recovered ${recovered.length} accounts, ${failed.length} failed. ${details.join('; ')}`

        return {
            success: failed.length === 0,
            recovered,
            failed,
            details: summary
        }
    } catch (error) {
        console.error('Error recovering from storage accounts:', error)
        throw new Error(
            error instanceof Error ? error.message : 'Recovery failed'
        )
    }
}
