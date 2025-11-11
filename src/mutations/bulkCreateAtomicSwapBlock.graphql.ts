import { gql } from '@apollo/client'

export const BULK_CREATE_ATOMIC_SWAP_BLOCK_MUTATION = gql`
    mutation BulkCreateAtomicSwapBlock($input: BulkCreateAtomicSwapBlockInput!) {
        bulkCreateAtomicSwapBlock(input: $input) {
            success
            error
            createdCount
        }
    }
`
