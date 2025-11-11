/**
 * Keeta Network Storage Account Creation
 *
 * Creates a storage account with permissions for token holding and deposits
 */

import * as KeetaNetModule from '@keetanetwork/keetanet-client'
// @ts-expect-error - default export may not be available
const KeetaNet = KeetaNetModule.default || KeetaNetModule

export interface StorageAccountResult {
    storageAccount: any;
    storageAddress: string;
}

export interface StorageAccountBlock {
    blocks: any;
    storageAccounts: any[];
    storageAddresses: string[];
}

/**
 * Build a storage account creation block using higher-level API
 *
 * @param creatorClient - Creator's Keeta client
 * @param numberOfAccounts - Number of storage accounts to create (default: 1)
 * @returns Storage account block bytes and account info
 */
export async function buildStorageAccountBlock (
    creatorClient: any,
    numberOfAccounts = 1
): Promise<StorageAccountBlock> {
    // Use initBuilder with higher-level API for proper operation handling
    const builder = creatorClient.initBuilder()

    const storageAccounts: any[] = []
    const storageAddresses: string[] = []
    const pendingStorageAccounts: any[] = []

    // Create multiple storage accounts in the same builder
    for (let i = 0; i < numberOfAccounts; i++) {
        const pendingStorageAccount = builder.generateIdentifier(KeetaNet.lib.Account.AccountKeyAlgorithm.STORAGE)
        pendingStorageAccounts.push(pendingStorageAccount)
    }

    // Compute blocks once for all pending accounts (reduces network requests)
    await builder.computeBlocks()

    // Now resolve all pending accounts and set their permissions
    for (let i = 0; i < numberOfAccounts; i++) {
        const pendingStorageAccount = pendingStorageAccounts[i]
        const storageAccount = pendingStorageAccount.account
        const storageAddress = storageAccount.publicKeyString.get()

        storageAccounts.push(storageAccount)
        storageAddresses.push(storageAddress)

        // Set default permissions for storage account
        await builder.setInfo({
            name: '',
            description: '',
            metadata: '',
            defaultPermission: new KeetaNet.lib.Permissions([
                'STORAGE_CAN_HOLD', // Allow anyone to hold any token
                'STORAGE_DEPOSIT' // Allow anyone to deposit
            ])
        }, { account: storageAccount })
    }

    // Compute and extract the blocks
    const { blocks } = await creatorClient.computeBuilderBlocks(builder)

    // Return all storage accounts created
    return {
        blocks,
        storageAccounts,
        storageAddresses
    }
}

/**
 * Build a send token block
 *
 * @param creatorClient - Creator's Keeta client
 * @param sendFromAccount - Account to send from
 * @param signerAccount - Account signing the block
 * @param recipientAccount - Recipient account
 * @param token - Token to send
 * @param amount - Amount to send
 * @param previous - Previous block hash (or undefined for first block)
 * @returns Block bytes
 */
export async function buildSendBlock (
    creatorClient: any,
    sendFromAccount: any,
    signerAccount: any,
    recipientAccount: any,
    token: any,
    amount: bigint,
    previous: any
): Promise<ArrayBuffer> {
    // Build send block using lower-level Block.Builder API
    const blockBuilder = new KeetaNet.lib.Block.Builder({
        account: sendFromAccount as any,
        signer: signerAccount as any,
        network: creatorClient.network as any,
        previous: (previous ?? KeetaNet.lib.Block.NO_PREVIOUS) as any,
        date: new Date().toISOString()
    })

    // Add SEND operation
    blockBuilder.addOperation({
        type: KeetaNet.lib.Block.OperationType.SEND,
        to: recipientAccount as any,
        amount,
        token: token as any
    })

    // Seal the block
    const block = await blockBuilder.seal()

    return block.toBytes()
}

/**
 * Create a storage account with permissions using lower-level API
 *
 * @param creatorClient - Creator's Keeta client (must be synced)
 * @param owner - Owner address for the storage account
 * @param numberOfAccounts - Number of storage accounts to create (default: 1)
 * @returns Object with storageAddresses array
 */
/**
 * Create a storage account with permissions using lower-level API
 *
 * @param creatorClient - Creator's Keeta client (must be synced)
 * @param numberOfAccounts - Number of storage accounts to create (default: 1)
 * @returns Object with storageAddresses array
 */
export async function createStorageAccount (
    creatorClient: any,
    numberOfAccounts = 1
): Promise<{ storageAddresses: string[] }> {
    // Build storage account block using higher-level API
    const { blocks, storageAccounts, storageAddresses } = await buildStorageAccountBlock(
        creatorClient,
        numberOfAccounts
    )

    // Reconstruct and transmit the block
    await creatorClient.client.transmit([...blocks], {
        generateFeeBlock: async (voteStaple: any) => {
            const votes = voteStaple.votes
            if (votes && votes.length > 0 && votes[0].fee) {
                const feeAmount = BigInt(votes[0].fee.amount)
                const feeRecipient = typeof votes[0].fee.payTo === 'string'
                    ? KeetaNet.lib.Account.fromPublicKeyString(votes[0].fee.payTo).assertAccount()
                    : votes[0].fee.payTo

                const feeBuilder = creatorClient.initBuilder()
                feeBuilder.send(feeRecipient, feeAmount, creatorClient.baseToken)
                return await feeBuilder.computeFeeBlock(voteStaple)
            }
            throw new Error('Unable to extract fee information from vote staple')
        }
    })

    return { storageAddresses }
}

/**
 * Send tokens to a storage account using lower-level API
 *
 * @param senderClient - Sender's Keeta client (must be synced)
 * @param storageAddress - Storage account address
 * @param tokenAddress - Token address to send
 * @param amount - Amount to send (in base units)
 */
export async function sendToStorageAccount (
    senderClient: any,
    storageAddress: string,
    tokenAddress: string,
    amount: bigint
): Promise<void> {
    const senderAccount = senderClient.account
    const storageAccount = KeetaNet.lib.Account.fromPublicKeyString(storageAddress)
    const token = KeetaNet.lib.Account.fromPublicKeyString(tokenAddress)

    // Get previous block using lower-level API
    const previousInfo = await senderClient.client.getAccountHeadInfo(senderAccount)
    const previous = previousInfo?.block.hash?.get()

    // Build send block using buildSendBlock helper
    const blockBytes = await buildSendBlock(
        senderClient,
        senderAccount,
        senderAccount,
        storageAccount,
        token,
        amount,
        previous
    )

    // Reconstruct and transmit the block
    const block = new KeetaNet.lib.Block(blockBytes as any)
    await senderClient.client.transmit([block], {
        generateFeeBlock: async (voteStaple: any) => {
            const votes = voteStaple.votes
            if (votes && votes.length > 0 && votes[0].fee) {
                const feeAmount = BigInt(votes[0].fee.amount)
                const feeRecipient = typeof votes[0].fee.payTo === 'string'
                    ? KeetaNet.lib.Account.fromPublicKeyString(votes[0].fee.payTo).assertAccount()
                    : votes[0].fee.payTo

                const feeBuilder = senderClient.initBuilder()
                feeBuilder.send(feeRecipient, feeAmount, senderClient.baseToken)
                return await feeBuilder.computeFeeBlock(voteStaple)
            }
            throw new Error('Unable to extract fee information from vote staple')
        }
    })
}

/**
 * Send tokens from a storage account using lower-level API
 *
 * @param senderClient - Keeta client of account with SEND_ON_BEHALF permission (must be synced)
 * @param storageAddress - Storage account address to send from
 * @param recipientAddress - Recipient account address
 * @param tokenAddress - Token address to send
 * @param amount - Amount to send (in base units)
 */
export async function sendFromStorageAccount (
    senderClient: any,
    storageAddress: string,
    recipientAddress: string,
    tokenAddress: string,
    amount: bigint
): Promise<void> {
    const senderAccount = senderClient.account
    const storageAccount = KeetaNet.lib.Account.fromPublicKeyString(storageAddress)
    const recipientAccount = KeetaNet.lib.Account.fromPublicKeyString(recipientAddress)
    const tokenAccount = tokenAddress === senderClient.baseToken.publicKeyString.get() ? senderClient.baseToken : KeetaNet.lib.Account.fromPublicKeyString(tokenAddress)

    // Get previous block of storage account using lower-level API
    const previousInfo = await senderClient.client.getAccountHeadInfo(storageAccount)
    const previous = previousInfo?.block.hash?.get()

    // Build send block using buildSendBlock helper (sending from storage account)
    const blockBytes = await buildSendBlock(
        senderClient,
        storageAccount,
        senderAccount,
        recipientAccount,
        tokenAccount,
        amount,
        previous
    )

    // Reconstruct and transmit the block
    const block = new KeetaNet.lib.Block(blockBytes as any)
    await senderClient.client.transmit([block], {
        generateFeeBlock: async (voteStaple: any) => {
            const votes = voteStaple.votes
            if (votes && votes.length > 0 && votes[0].fee) {
                const feeAmount = BigInt(votes[0].fee.amount)
                const feeRecipient = typeof votes[0].fee.payTo === 'string'
                    ? KeetaNet.lib.Account.fromPublicKeyString(votes[0].fee.payTo).assertAccount()
                    : votes[0].fee.payTo

                const feeBuilder = senderClient.initBuilder()
                feeBuilder.send(feeRecipient, feeAmount, senderClient.baseToken)
                return await feeBuilder.computeFeeBlock(voteStaple)
            }
            throw new Error('Unable to extract fee information from vote staple')
        }
    })
}
