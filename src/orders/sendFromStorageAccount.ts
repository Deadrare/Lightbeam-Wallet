/**
 * Send tokens from a storage account
 */

import * as KeetaNetModule from '@keetanetwork/keetanet-client'
// @ts-expect-error - default export may not be available
const KeetaNet = KeetaNetModule.default || KeetaNetModule

export async function sendFromStorageAccount (
    client: any,
    signerAccount: any,
    storageAddress: string,
    recipientAddress: string,
    tokenAddress: string,
    amount: string
): Promise<void> {
    const storageAccount = KeetaNet.lib.Account.fromPublicKeyString(storageAddress)
    const recipientAccount = KeetaNet.lib.Account.fromPublicKeyString(recipientAddress)
    const tokenAccount = tokenAddress === client.baseToken.publicKeyString.get()
        ? client.baseToken
        : KeetaNet.lib.Account.fromPublicKeyString(tokenAddress)

    const previousInfo = await client.client.getAccountHeadInfo(storageAccount)
    const previous = previousInfo?.block.hash?.get()

    const blockBuilder = new KeetaNet.lib.Block.Builder({
        account: storageAccount,
        signer: signerAccount,
        network: client.network,
        previous: previous ?? KeetaNet.lib.Block.NO_PREVIOUS,
        date: new Date().toISOString()
    })

    blockBuilder.addOperation({
        type: KeetaNet.lib.Block.OperationType.SEND,
        to: recipientAccount,
        amount: BigInt(amount),
        token: tokenAccount
    })

    const block = await blockBuilder.seal()

    await client.client.transmit([block], {
        generateFeeBlock: async (voteStaple: any) => {
            const votes = voteStaple.votes
            if (votes && votes.length > 0 && votes[0].fee) {
                const feeAmount = BigInt(votes[0].fee.amount)
                const feeRecipient = typeof votes[0].fee.payTo === 'string'
                    ? KeetaNet.lib.Account.fromPublicKeyString(votes[0].fee.payTo).assertAccount()
                    : votes[0].fee.payTo

                const feeBuilder = client.initBuilder()
                feeBuilder.send(feeRecipient, feeAmount, client.baseToken)
                return await feeBuilder.computeFeeBlock(voteStaple)
            }
            throw new Error('Unable to extract fee information from vote staple')
        }
    })
}
