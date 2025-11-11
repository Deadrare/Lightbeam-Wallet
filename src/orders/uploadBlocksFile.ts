import { createSignedUpload } from '../queries/createSignedUpload'

/**
 * Upload blocks file to cloud storage
 */
export async function uploadBlocksFile (
    blocks: string[],
    startTime: number,
    minutesApart: number
): Promise<string> {
    // Get signed upload URL
    const signedUrl = await createSignedUpload('text/plain')

    // Format blocks with timestamps
    const blocksFileContent = blocks.map((blockHex, index) => {
        const minutesOffset = index * minutesApart
        const validFrom = new Date(startTime + minutesOffset * 60 * 1000).toISOString()
        return `${blockHex}|${validFrom}`
    }).join('\n')

    const blocksBlob = new Blob([blocksFileContent], { type: 'text/plain' })

    // Upload to signed URL
    const putResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: blocksBlob,
        headers: { 'Content-Type': 'text/plain' }
    })

    if (!putResponse.ok) {
        throw new Error(`Failed to upload blocks file: ${putResponse.statusText}`)
    }

    // Return the file URL (without query parameters)
    return signedUrl.split('?')[0]
}
