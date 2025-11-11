import { gql } from '@apollo/client'
import { getApolloClient } from '../lib/apollo'
import type { ListingField } from '@/gql-types'

const LISTINGS_BULK_BY_COLLECTION_QUERY = gql`
    query TokenMetadata($collections: [ID!]!) {
        listingsBulkByCollection(collections: $collections) {
            collectionTicker
            slug
            name
            imageUrl
            decimals
        }
    }
`

export interface TokenMetadata {
    collectionTicker: string
    slug: string
    name: string
    imageUrl: string
    decimals?: number
}

/**
 * Fetch token metadata for multiple tokens using bulk listing query
 */
export async function listingsBulkByCollection (
    tokenIds: string[]
): Promise<Map<string, TokenMetadata>> {
    const client = await getApolloClient()

    const { data, errors } = await client.query<{ listingsBulkByCollection: Array<ListingField | null> }>({
        query: LISTINGS_BULK_BY_COLLECTION_QUERY,
        variables: {
            collections: tokenIds
        },
        fetchPolicy: 'network-only'
    })

    if (errors) {
        throw new Error(`GraphQL request failed: ${errors[0].message}`)
    }

    // Create a map of token metadata
    const metadataMap = new Map<string, TokenMetadata>()
    data.listingsBulkByCollection.forEach(listing => {
        if (listing) {
            metadataMap.set(listing.collectionTicker, {
                collectionTicker: listing.collectionTicker,
                slug: listing.slug || listing.collectionTicker,
                name: listing.name,
                imageUrl: listing.imageUrl,
                decimals: listing.decimals ?? undefined
            })
        }
    })

    return metadataMap
}
