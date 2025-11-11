import { cn, truncateAddress, formatKTA, isValidKeetaAddress } from '@/lib/utils'

describe('utils', () => {
    describe('cn', () => {
        it('should merge class names', () => {
            expect(cn('class1', 'class2')).toBe('class1 class2')
        })

        it('should handle conditional classes', () => {
            expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3')
        })

        it('should handle empty inputs', () => {
            expect(cn()).toBe('')
            expect(cn('')).toBe('')
        })

        it('should handle arrays', () => {
            expect(cn(['class1', 'class2'])).toBe('class1 class2')
        })
    })

    describe('truncateAddress', () => {
        it('should truncate long address with ellipsis', () => {
            const address = 'keeta_anqdilpazdekdu4acw65fj7smltcp26wbrildkqtszqvverljpwpezmd44ssg'
            const formatted = truncateAddress(address)

            expect(formatted).toContain('...')
            expect(formatted.startsWith('keeta_')).toBe(true)
        })

        it('should not truncate short addresses', () => {
            const address = 'keeta_short'
            const formatted = truncateAddress(address)

            expect(formatted).toBe(address)
        })

        it('should handle custom lengths', () => {
            const address = 'keeta_anqdilpazdekdu4acw65fj7smltcp26wbrildkqtszqvverljpwpezmd44ssg'
            const formatted = truncateAddress(address, 10)

            expect(formatted).toContain('...')
        })

        it('should handle empty address', () => {
            expect(truncateAddress('')).toBe('')
        })
    })

    describe('formatKTA', () => {
        it('should format amounts correctly', () => {
            expect(formatKTA('1000000000')).toBe('1')
        })

        it('should handle zero', () => {
            expect(formatKTA('0')).toBe('0')
        })

        it('should handle decimal amounts', () => {
            const result = formatKTA('1234567890')
            expect(result).toBeDefined()
        })
    })

    describe('isValidKeetaAddress', () => {
        it('should validate correct Keeta address', () => {
            const validAddress = 'keeta_anqdilpazdekdu4acw65fj7smltcp26wbrildkqtszqvverljpwpezmd44ssg'
            expect(isValidKeetaAddress(validAddress)).toBe(true)
        })

        it('should reject address without keeta_ prefix', () => {
            expect(isValidKeetaAddress('anqdilpazdekdu4acw65fj7smltcp26wbrildkqtszqvverljpwpezmd44ssg')).toBe(false)
        })

        it('should reject short addresses', () => {
            expect(isValidKeetaAddress('keeta_short')).toBe(false)
        })

        it('should reject empty address', () => {
            expect(isValidKeetaAddress('')).toBe(false)
        })
    })
})
