/**
 * Convert a hex balance string to a decimal string with the specified number of decimals
 * @param balance - The balance in hex format (with or without 0x prefix)
 * @param decimals - Number of decimal places
 * @returns Formatted decimal string
 */
export const convertHexToDecimal = (balance: string, decimals: number): string => {
    try {
        const balanceHex = balance.startsWith('0x') ? balance.slice(2) : balance
        const balanceBigInt = BigInt('0x' + balanceHex)
        const divisor = 10n ** BigInt(decimals)
        const wholePart = balanceBigInt / divisor
        const fractionalPart = balanceBigInt % divisor
        const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
        const trimmedFractional = fractionalStr.replace(/0+$/, '')

        if (trimmedFractional) {
            return `${wholePart.toString()}.${trimmedFractional}`
        }
        return wholePart.toString()
    } catch {
        return '0'
    }
}
