/**
 * Generate atomic swap blocks with time extension for order creation
 */

import * as KeetaNetModule from '@keetanetwork/keetanet-client'
import { buildAtomicSwapBlockOperation } from './buildAtomicSwapBlockOperation'
// @ts-expect-error - default export may not be available
const KeetaNet = KeetaNetModule.default || KeetaNetModule

export async function generateAtomicSwapBlocks (
    client: any,
    creatorAccount: any,
    orderStorageAddress: string,
    ownerStorageAddress: string,
    sendTokenAddress: string,
    receiveTokenAddress: string,
    sendAmount: string,
    receiveAmount: string,
    dexAddress: string
): Promise<string> {
    const signerAccount = KeetaNet.lib.Account.fromPublicKeyString(dexAddress).assertAccount()
    const sendFromAccount = KeetaNet.lib.Account.fromPublicKeyString(orderStorageAddress)

    // Token addresses are passed in send/receive order to match the amounts
    // sendAmount corresponds to sendTokenAddress
    // receiveAmount corresponds to receiveTokenAddress
    const sendToken = sendTokenAddress === client.baseToken.publicKeyString.get()
        ? client.baseToken
        : KeetaNet.lib.Account.fromPublicKeyString(sendTokenAddress)
    const receiveToken = receiveTokenAddress === client.baseToken.publicKeyString.get()
        ? client.baseToken
        : KeetaNet.lib.Account.fromPublicKeyString(receiveTokenAddress)

    if (!sendToken.isToken() || !receiveToken.isToken()) {
        throw new Error('Invalid token')
    }

    const previousInfo = await client.client.getAccountHeadInfo(sendFromAccount)
    const previous = previousInfo?.block.hash?.get()

    // Build first atomic swap block
    const firstBlockBytes = await buildAtomicSwapBlockOperation(
        client,
        sendFromAccount,
        creatorAccount,
        signerAccount,
        sendToken,
        receiveToken,
        BigInt(sendAmount),
        BigInt(receiveAmount),
        previous,
        ownerStorageAddress,
        0
    )
    const firstBlockHex = Buffer.from(firstBlockBytes).toString('hex')

    // Return just the first block - time-extended blocks are handled in the background
    return firstBlockHex
}
