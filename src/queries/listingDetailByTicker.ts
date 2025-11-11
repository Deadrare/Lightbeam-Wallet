import { gql } from '@apollo/client'
import { getApolloClient } from '../lib/apollo'
import type { ListingField } from '@/gql-types'

const LISTING_DETAIL_BY_TICKER_QUERY = gql`
    query ListingDetailByTicker($collectionTicker: String!) {
        listingDetail(collectionTicker: $collectionTicker) {
            id
            slug
            name
            imageUrl
            decimals
        }
    }
`

export interface ListingDetail {
    collectionTicker: string
    slug: string
    name: string
    imageUrl: string
    decimals?: number
}

/**
 * Fetch listing detail by collection ticker (token address)
 */
export async function listingDetailByTicker (
    collectionTicker: string
): Promise<ListingDetail | null> {
    const client = await getApolloClient()

    const { data, errors } = await client.query<{ listingDetail: ListingField | null }>({
        query: LISTING_DETAIL_BY_TICKER_QUERY,
        variables: {
            collectionTicker
        },
        fetchPolicy: 'network-only'
    })

    if (errors) {
        console.error('GraphQL request failed:', errors[0].message)
        return null
    }

    if (!data.listingDetail) {
        return null
    }

    const listing = data.listingDetail

    return {
        collectionTicker: listing.collectionTicker,
        slug: listing.slug || listing.collectionTicker,
        name: listing.name,
        imageUrl: listing.imageUrl,
        decimals: listing.decimals ?? undefined
    }
}
