import { encrypt, decrypt } from '@/core/crypto'

describe('crypto', () => {
    const testPassword = 'testPassword123!'
    const testData = 'sensitive wallet data'

    describe('encrypt', () => {
        it('should encrypt data successfully', async () => {
            const encrypted = await encrypt(testData, testPassword)

            expect(encrypted).toBeDefined()
            expect(typeof encrypted).toBe('string')
            expect(encrypted).not.toBe(testData)
            expect(encrypted.length).toBeGreaterThan(0)
        })

        it('should produce different encrypted output each time', async () => {
            const encrypted1 = await encrypt(testData, testPassword)
            const encrypted2 = await encrypt(testData, testPassword)

            expect(encrypted1).not.toBe(encrypted2)
        })

        it('should handle empty string', async () => {
            const encrypted = await encrypt('', testPassword)
            expect(encrypted).toBeDefined()
        })
    })

    describe('decrypt', () => {
        it('should decrypt data successfully', async () => {
            const encrypted = await encrypt(testData, testPassword)
            const decrypted = await decrypt(encrypted, testPassword)

            expect(decrypted).toBe(testData)
        })

        it('should fail with wrong password', async () => {
            const encrypted = await encrypt(testData, testPassword)

            await expect(
                decrypt(encrypted, 'wrongPassword')
            ).rejects.toThrow()
        })

        it('should fail with invalid encrypted data', async () => {
            await expect(
                decrypt('invalid-encrypted-data', testPassword)
            ).rejects.toThrow()
        })

        it('should handle empty encrypted string', async () => {
            const encrypted = await encrypt('', testPassword)
            const decrypted = await decrypt(encrypted, testPassword)

            expect(decrypted).toBe('')
        })
    })

    describe('encryption/decryption cycle', () => {
        it('should handle various data types', async () => {
            const testCases = [
                'simple string',
                'string with special chars !@#$%^&*()',
                '{"json": "object"}',
                '1234567890',
                'very long string'.repeat(100)
            ]

            for (const testCase of testCases) {
                const encrypted = await encrypt(testCase, testPassword)
                const decrypted = await decrypt(encrypted, testPassword)
                expect(decrypted).toBe(testCase)
            }
        })

        it('should handle different passwords', async () => {
            const passwords = ['password1', 'p@ssw0rd!', 'very-long-password-123456']

            for (const password of passwords) {
                const encrypted = await encrypt(testData, password)
                const decrypted = await decrypt(encrypted, password)
                expect(decrypted).toBe(testData)
            }
        })
    })
})
