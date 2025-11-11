// Web Crypto API utilities for encryption/decryption

import { CRYPTO_PARAMS } from './constants'

/**
 * Generates a cryptographic key from a password using PBKDF2
 */
async function deriveKey (password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveKey']
    )

    return await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations: CRYPTO_PARAMS.PBKDF2_ITERATIONS,
            hash: 'SHA-256'
        },
        keyMaterial,
        {
            name: 'AES-GCM',
            length: CRYPTO_PARAMS.KEY_LENGTH
        },
        false,
        ['encrypt', 'decrypt']
    )
}

/**
 * Encrypts data with a password using AES-GCM
 */
export async function encrypt (data: string, password: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)

    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(CRYPTO_PARAMS.SALT_LENGTH))
    const iv = crypto.getRandomValues(new Uint8Array(CRYPTO_PARAMS.IV_LENGTH))

    // Derive key from password
    const key = await deriveKey(password, salt)

    // Encrypt data
    const encryptedBuffer = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv
        },
        key,
        dataBuffer
    )

    // Combine salt + IV + encrypted data
    const combined = new Uint8Array(
        salt.length + iv.length + encryptedBuffer.byteLength
    )
    combined.set(salt, 0)
    combined.set(iv, salt.length)
    combined.set(new Uint8Array(encryptedBuffer), salt.length + iv.length)

    // Convert to base64
    return btoa(String.fromCharCode(...combined))
}

/**
 * Decrypts data with a password using AES-GCM
 */
export async function decrypt (encryptedData: string, password: string): Promise<string> {
    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))

    // Extract salt, IV, and encrypted data
    const salt = combined.slice(0, CRYPTO_PARAMS.SALT_LENGTH)
    const iv = combined.slice(
        CRYPTO_PARAMS.SALT_LENGTH,
        CRYPTO_PARAMS.SALT_LENGTH + CRYPTO_PARAMS.IV_LENGTH
    )
    const encryptedBuffer = combined.slice(
        CRYPTO_PARAMS.SALT_LENGTH + CRYPTO_PARAMS.IV_LENGTH
    )

    // Derive key from password
    const key = await deriveKey(password, salt)

    // Decrypt data
    try {
        const decryptedBuffer = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv
            },
            key,
            encryptedBuffer
        )

        const decoder = new TextDecoder()
        return decoder.decode(decryptedBuffer)
    } catch (error) {
        throw new Error('Incorrect password or corrupted data')
    }
}

/**
 * Validates if a password can decrypt the encrypted data
 */
export async function validatePassword (
    encryptedData: string,
    password: string
): Promise<boolean> {
    try {
        await decrypt(encryptedData, password)
        return true
    } catch {
        return false
    }
}
