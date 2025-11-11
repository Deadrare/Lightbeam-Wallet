/**
 * Build an atomic swap block for order operations
 * Used for creating and extending orders
 */

import * as KeetaNetModule from '@keetanetwork/keetanet-client'
// @ts-expect-error - default export may not be available
const KeetaNet = KeetaNetModule.default || KeetaNetModule

export async function buildAtomicSwapBlockOperation (
    client: any,
    sendFromAccount: any,
    creatorAccount: any,
    signerAccount: any,
    sendToken: any,
    receiveToken: any,
    sendAmount: bigint,
    receiveAmount: bigint,
    previous: any,
    forwardTo?: string,
    overrideTime?: number
): Promise<ArrayBuffer> {
    const sendOperation = {
        type: KeetaNet.lib.Block.OperationType.SEND,
        to: signerAccount,
        amount: sendAmount,
        token: sendToken
    }

    const receiveOperation: any = {
        type: KeetaNet.lib.Block.OperationType.RECEIVE,
        from: signerAccount,
        amount: receiveAmount,
        token: receiveToken,
        exact: true
    }

    if (forwardTo) {
        receiveOperation.forward = KeetaNet.lib.Account.fromPublicKeyString(forwardTo)
    }

    const blockDate = new Date()
    if (overrideTime) {
        blockDate.setTime(overrideTime)
    }

    const blockBuilder = new KeetaNet.lib.Block.Builder({
        account: sendFromAccount,
        signer: creatorAccount,
        network: client.network,
        previous: previous ?? KeetaNet.lib.Block.NO_PREVIOUS,
        date: blockDate.toISOString()
    })

    blockBuilder.addOperation(sendOperation)
    blockBuilder.addOperation(receiveOperation)

    const block = await blockBuilder.seal()
    return block.toBytes()
}
