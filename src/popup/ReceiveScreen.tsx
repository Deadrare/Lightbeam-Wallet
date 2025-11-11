import React, { useState } from 'react'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { copyToClipboard } from '@/lib/utils'

interface ReceiveScreenProps {
    address: string
    onBack: () => void
}

export const ReceiveScreen: React.FC<ReceiveScreenProps> = ({ address, onBack }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        const success = await copyToClipboard(address)
        if (success) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className='p-4 space-y-4'>
            <div className='flex items-center gap-2'>
                <Button variant='ghost' size='sm' onClick={onBack}>
                    <ArrowLeft className='w-4 h-4' />
                </Button>
                <h1 className='text-xl font-bold'>Receive KTA</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Address</CardTitle>
                    <CardDescription>Share this address to receive KTA</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='p-4 bg-muted rounded-md break-all text-sm font-mono'>
                        {address}
                    </div>

                    <Button onClick={handleCopy} className='w-full'>
                        {copied
                            ? (
                                <>
                                    <Check className='w-4 h-4 mr-2' />
                                    Copied!
                                </>
                            )
                            : (
                                <>
                                    <Copy className='w-4 h-4 mr-2' />
                                    Copy Address
                                </>
                            )}
                    </Button>

                    <div className='text-xs text-muted-foreground text-center'>
                        Only send KTA tokens to this address
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
