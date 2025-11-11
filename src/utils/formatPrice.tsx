import React, { ReactNode, ClipboardEvent } from 'react'
import BigNumber from 'bignumber.js'

export const toFullString = (input: number): string => {
    BigNumber.config({ EXPONENTIAL_AT: 32 })
    return new BigNumber(input).toString()
}

const setPrecision = (price: string): number => {
    const priceNum = Number.parseFloat(price)
    if (priceNum < 10) {
        return parseFloat(priceNum.toPrecision(3))
    }
    return parseFloat(priceNum.toPrecision(4))
}

const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 18
})

const formatPrice = (price: string): ReactNode => {
    const newNumber = setPrecision(price)

    const onCopy = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        e.nativeEvent.stopImmediatePropagation()
        navigator.clipboard.writeText(toFullString(Number(price)))
    }

    if (newNumber && newNumber < 0.000001) {
        const notDot = newNumber.toString().replace('.', '')
        const [left, right] = notDot.split('e-')
        return <span onCopy={onCopy}>0.0<sub className='align-baseline text-[0.65em]'>{Number(right) - 1}</sub>{left}</span>
    }

    return formatter.format(newNumber)
}

export default formatPrice
