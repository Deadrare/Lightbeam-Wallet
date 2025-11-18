import { gql } from '@apollo/client'
import { getApolloClient } from '../lib/apollo'
import { OpenAtomicOrderSort } from '@/gql-types'

const LIST_OPEN_ATOMIC_ORDERS_FULL_CHAIN_QUERY = gql`
    query ListOpenAtomicOrdersFullChain($filters: OpenAtomicOrderFiltersField, $pagination: AtomicOrderBookPagination!) {
        listOpenAtomicOrdersFullChain(filters: $filters, pagination: $pagination) {
            results {
                id
                escrowAddress
                firstTokenAddress
                secondTokenAddress
                buyAmount
                sellAmount
                price
                orderType
                generatedAt
                createdAt
                validUntil
                unsignedBytes
                forwardToAddress
            }
        }
    }
`

export interface Order {
    id: string
    escrowAddress: string
    firstTokenAddress: string
    secondTokenAddress: string
    buyAmount: string
    sellAmount: string
    price: string
    orderType: boolean
    generatedAt: string
    createdAt: string
    validUntil: string
    unsignedBytes: string
    forwardToAddress?: string
}

/**
 * Fetch open atomic orders (full chain - all orders, not just lowest index) from GraphQL API
 */
export async function listOpenAtomicOrdersFullChain (
    ownerAddress: string,
    expiresAfter?: string
): Promise<Order[]> {
    const client = await getApolloClient()

    const { data, errors } = await client.query({
        query: LIST_OPEN_ATOMIC_ORDERS_FULL_CHAIN_QUERY,
        variables: {
            filters: {
                ownerAddress,
                showExpired: true,
                expiresAfter
            },
            pagination: {
                limit: 100,
                offset: 0
            },
            sort: OpenAtomicOrderSort.MoreRecentExpires
        },
        fetchPolicy: 'network-only'
    })

    if (errors) {
        throw new Error(`GraphQL request failed: ${errors[0].message}`)
    }

    const orders = data?.listOpenAtomicOrdersFullChain?.results || []
    return orders
}
