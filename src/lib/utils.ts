import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn (...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
}

/**
 * Format KTA amount for display
 */
export function formatKTA (amount: string): string {
    const num = BigInt(amount)
    const divisor = BigInt(1_000_000_000) // 9 decimals
    const whole = num / divisor
    const fraction = num % divisor

    if (fraction === BigInt(0)) {
        return whole.toString()
    }

    // Show up to 4 decimal places
    const fractionStr = fraction.toString().padStart(9, '0')
    const trimmed = fractionStr.substring(0, 4).replace(/0+$/, '')

    return `${whole}.${trimmed || '0'}`
}

/**
 * Format price for display with compact notation (like lightbeam)
 */
export function formatPrice (amount: string): string {
    const numericAmount = formatKTA(amount)
    const priceNum = Number.parseFloat(numericAmount)

    // Use precision based on price magnitude
    const setPrecision = (price: number): number => {
        if (price < 10) {
            return parseFloat(price.toPrecision(3))
        }
        return parseFloat(price.toPrecision(4))
    }

    const formatter = Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 4
    })

    const newNumber = setPrecision(priceNum)
    return formatter.format(newNumber)
}

/**
 * Truncate address for display
 */
export function truncateAddress (address: string, chars = 8): string {
    if (address.length <= chars * 2 + 3) {
        return address
    }
    return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard (text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch {
        return false
    }
}

/**
 * Validate Keeta address
 */
export function isValidKeetaAddress (address: string): boolean {
    return /^keeta_[a-z0-9]{60,70}$/i.test(address)
}
