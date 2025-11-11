import { getApolloClient } from '../lib/apollo'
import { BULK_CREATE_ATOMIC_SWAP_BLOCK_MUTATION } from '../mutations/bulkCreateAtomicSwapBlock.graphql'

/**
 * Register blocks with order via GraphQL mutation
 */
export async function bulkCreateAtomicSwapBlock (
    atomicOrderId: number,
    fileUrl: string,
    blockCount: number,
    fromTime: string,
    skipValidation = true
): Promise<void> {
    const client = await getApolloClient()

    const { data, errors } = await client.mutate({
        mutation: BULK_CREATE_ATOMIC_SWAP_BLOCK_MUTATION,
        variables: {
            input: {
                atomicOrderId,
                fileUrl,
                blockCount,
                fromTime,
                skipValidation
            }
        },
        // Increase timeout for this specific mutation
        context: {
            timeout: 120000 // 2 minutes
        }
    })

    if (errors) {
        console.error('[bulkCreateAtomicSwapBlock] GraphQL errors:', errors)
        throw new Error(`Failed to register blocks: ${errors[0].message}`)
    }

    if (!data?.bulkCreateAtomicSwapBlock?.success) {
        const error = data?.bulkCreateAtomicSwapBlock?.error || 'Unknown error'
        console.error('[bulkCreateAtomicSwapBlock] Validation failed:', {
            error,
            atomicOrderId,
            fileUrl,
            blockCount,
            fromTime,
            skipValidation,
            response: data?.bulkCreateAtomicSwapBlock
        })
        throw new Error(`Failed to register blocks: ${error}`)
    }

    console.log('[bulkCreateAtomicSwapBlock] Successfully registered blocks for order:', atomicOrderId)
}
