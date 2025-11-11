// Message sending utility for communicating with background script

import type { Message, MessageResponse, MessageType } from '@/core/types'

/**
 * Send message to background script
 */
export async function sendMessage<T = any> (
    type: MessageType,
    data?: any
): Promise<T> {
    return new Promise((resolve, reject) => {
        const message: Message = {
            type,
            data,
            requestId: Math.random().toString(36)
        }

        chrome.runtime.sendMessage(message, (response: MessageResponse) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message))
                return
            }

            if (!response) {
                reject(new Error('No response from background script'))
                return
            }

            if (response.success) {
                resolve(response.data as T)
            } else {
                reject(new Error(response.error || 'Unknown error'))
            }
        })
    })
}
