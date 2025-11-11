/**
 * Build an atomic swap block
 */
export async function buildAtomicSwapBlock (
    creatorClient: any,
    sendFromAccount: any,
    creatorAccount: any,
    signerAccount: any,
    sendToken: any,
    receiveToken: any,
    creatorSendAmount: bigint,
    creatorReceiveAmount: bigint,
    previous: any,
    forwardTo?: string,
    overrideTime?: number
): Promise<ArrayBuffer> {
    const KeetaSDK = await import('@keetanetwork/keetanet-client')

    // Create the send operation
    const sendOperation: any = {
        type: KeetaSDK.lib.Block.OperationType.SEND,
        to: signerAccount,
        amount: creatorSendAmount,
        token: sendToken
    }

    // Create the receive operation
    const receiveOperation: any = {
        type: KeetaSDK.lib.Block.OperationType.RECEIVE,
        from: signerAccount,
        amount: creatorReceiveAmount,
        token: receiveToken,
        exact: true
    }

    // If forwarding, add forward
    if (forwardTo) {
        receiveOperation.forward = KeetaSDK.lib.Account.fromPublicKeyString(forwardTo)
    }

    // Construct the builder
    const blockDate = new Date()
    if (overrideTime) {
        blockDate.setTime(overrideTime)
    }

    const creatorBlockBuilder = new KeetaSDK.lib.Block.Builder({
        account: sendFromAccount,
        signer: creatorAccount,
        network: creatorClient.network,
        previous: previous ?? KeetaSDK.lib.Block.NO_PREVIOUS,
        date: blockDate.toISOString()
    })

    // Add the operations
    creatorBlockBuilder.addOperation(sendOperation)
    creatorBlockBuilder.addOperation(receiveOperation)

    // Sign the block
    const creatorBlock = await creatorBlockBuilder.seal()

    // Return the unsigned bytes of the atomic swap block
    return creatorBlock.toBytes()
}
