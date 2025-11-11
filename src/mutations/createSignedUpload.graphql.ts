import { gql } from '@apollo/client'

export const CREATE_SIGNED_UPLOAD_MUTATION = gql`
    mutation CreateSignedUpload($mimeType: String!) {
        createSignedUpload(mimeType: $mimeType) {
            signedUrl
            name
        }
    }
`
