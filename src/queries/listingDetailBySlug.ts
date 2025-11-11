import { gql } from '@apollo/client'
import { getApolloClient } from '../lib/apollo'
import type { ListingField } from '@/gql-types'

const LISTING_DETAIL_BY_SLUG_QUERY = gql`
    query ListingDetailBySlug($slug: String!) {
        listingDetailBySlug(slug: $slug) {
            collectionTicker
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
 * Fetch listing detail by slug
 */
export async function listingDetailBySlug (
    slug: string
): Promise<ListingDetail | null> {
    const client = await getApolloClient()

    const { data, errors } = await client.query<{ listingDetailBySlug: ListingField | null }>({
        query: LISTING_DETAIL_BY_SLUG_QUERY,
        variables: {
            slug
        },
        fetchPolicy: 'network-only'
    })

    if (errors) {
        throw new Error(`GraphQL request failed: ${errors[0].message}`)
    }

    if (!data.listingDetailBySlug) {
        return null
    }

    const listing = data.listingDetailBySlug

    return {
        collectionTicker: listing.collectionTicker,
        slug: listing.slug || listing.collectionTicker,
        name: listing.name,
        imageUrl: listing.imageUrl,
        decimals: listing.decimals ?? undefined
    }
}
