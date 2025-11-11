import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { webcrypto } from 'crypto'

/* eslint-disable @typescript-eslint/no-explicit-any */
// Polyfill TextEncoder/TextDecoder for Node environment
global.TextEncoder = TextEncoder as any
global.TextDecoder = TextDecoder as any

// Polyfill Web Crypto API
Object.defineProperty(global, 'crypto', {
    value: webcrypto,
    writable: true
})

// Mock Chrome API
global.chrome = {
    storage: {
        local: {
            get: jest.fn(),
            set: jest.fn(),
            remove: jest.fn(),
            clear: jest.fn()
        }
    },
    runtime: {
        sendMessage: jest.fn(),
        onMessage: {
            addListener: jest.fn(),
            removeListener: jest.fn()
        }
    },
    tabs: {
        query: jest.fn(),
        sendMessage: jest.fn()
    }
} as any

// Ensure btoa/atob are available
if (typeof btoa === 'undefined') {
    global.btoa = (str: string) => Buffer.from(str, 'binary').toString('base64')
}
if (typeof atob === 'undefined') {
    global.atob = (str: string) => Buffer.from(str, 'base64').toString('binary')
}

// Mock Buffer if not available
if (typeof Buffer === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    global.Buffer = require('buffer/').Buffer
}
/* eslint-enable @typescript-eslint/no-explicit-any */
