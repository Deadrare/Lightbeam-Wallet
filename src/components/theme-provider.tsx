'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface Props {
    children: React.ReactNode
    attribute?: 'class' | 'data-theme' | 'data-mode'
    defaultTheme?: string
    enableSystem?: boolean
    disableTransitionOnChange?: boolean
}

export function ThemeProvider ({ children, ...props }: Props) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
