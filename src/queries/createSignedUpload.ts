import { getApolloClient } from '../lib/apollo'
import { CREATE_SIGNED_UPLOAD_MUTATION } from '../mutations/createSignedUpload.graphql'

/**
 * Create signed upload URL via GraphQL mutation
 */
export async function createSignedUpload (mimeType: string): Promise<string> {
    const client = await getApolloClient()

    const { data, errors } = await client.mutate({
        mutation: CREATE_SIGNED_UPLOAD_MUTATION,
        variables: {
            mimeType
        }
    })

    if (errors) {
        throw new Error(`Failed to get signed upload URL: ${errors[0].message}`)
    }

    const signedUrl = data?.createSignedUpload?.signedUrl

    if (!signedUrl) {
        throw new Error('No signed URL returned from createSignedUpload')
    }

    return signedUrl
}
