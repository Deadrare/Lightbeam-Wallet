import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { sendMessage } from '@/lib/messaging'
import { MessageType } from '@/core/types'

interface WelcomeScreenProps {
    onWalletCreated: () => void
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onWalletCreated }) => {
    const [mode, setMode] = useState<'welcome' | 'create' | 'import'>('welcome')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [mnemonic, setMnemonic] = useState('')
    const [generatedMnemonic, setGeneratedMnemonic] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleCreateWallet = async () => {
        setError('')

        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const result = await sendMessage<{ mnemonic: string, address: string }>(
                MessageType.CREATE_WALLET,
                { password }
            )
            setGeneratedMnemonic(result.mnemonic)
        } catch (err: any) {
            setError(err.message || 'Failed to create wallet')
        } finally {
            setLoading(false)
        }
    }

    const handleImportWallet = async () => {
        setError('')

        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (!mnemonic.trim()) {
            setError('Please enter your recovery phrase')
            return
        }

        setLoading(true)

        try {
            await sendMessage(MessageType.IMPORT_WALLET, {
                mnemonic: mnemonic.trim(),
                password
            })
            onWalletCreated()
        } catch (err: any) {
            setError(err.message || 'Failed to import wallet')
        } finally {
            setLoading(false)
        }
    }

    const handleContinueAfterCreate = () => {
        onWalletCreated()
    }

    if (generatedMnemonic) {
        return (
            <div className='p-6 space-y-4'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-xl'>Save Recovery Phrase</CardTitle>
                        <CardDescription>
                            Write down these 12 words in order. You&apos;ll need them to recover your wallet.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='grid grid-cols-3 gap-2 p-4 bg-muted rounded-md'>
                            {generatedMnemonic.split(' ').map((word, i) => (
                                <div key={i} className='text-sm'>
                                    <span className='text-muted-foreground'>{i + 1}.</span> {word}
                                </div>
                            ))}
                        </div>
                        <div className='text-sm text-destructive'>
                            ⚠️ Never share your recovery phrase. Anyone with these words can access your wallet.
                        </div>
                        <Button onClick={handleContinueAfterCreate} className='w-full'>
                            I&apos;ve Saved My Recovery Phrase
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (mode === 'create') {
        return (
            <div className='p-6 space-y-4'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-xl'>Create Wallet</CardTitle>
                        <CardDescription>Set a password to encrypt your wallet</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='password'>Password</Label>
                            <Input
                                id='password'
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter password'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='confirm'>Confirm Password</Label>
                            <Input
                                id='confirm'
                                type='password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Confirm password'
                            />
                        </div>
                        {error && <div className='text-sm text-destructive'>{error}</div>}
                        <div className='flex gap-2'>
                            <Button variant='outline' onClick={() => setMode('welcome')} className='flex-1'>
                                Back
                            </Button>
                            <Button onClick={handleCreateWallet} disabled={loading} className='flex-1'>
                                {loading ? 'Creating...' : 'Create Wallet'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (mode === 'import') {
        return (
            <div className='p-6 space-y-4'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-xl'>Import Wallet</CardTitle>
                        <CardDescription>Enter your 12 or 24-word recovery phrase</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='mnemonic'>Recovery Phrase</Label>
                            <textarea
                                id='mnemonic'
                                value={mnemonic}
                                onChange={(e) => setMnemonic(e.target.value)}
                                placeholder='Enter your recovery phrase'
                                className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                                rows={3}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='password'>Password</Label>
                            <Input
                                id='password'
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter password'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='confirm'>Confirm Password</Label>
                            <Input
                                id='confirm'
                                type='password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Confirm password'
                            />
                        </div>
                        {error && <div className='text-sm text-destructive'>{error}</div>}
                        <div className='flex gap-2'>
                            <Button variant='outline' onClick={() => setMode('welcome')} className='flex-1'>
                                Back
                            </Button>
                            <Button onClick={handleImportWallet} disabled={loading} className='flex-1'>
                                {loading ? 'Importing...' : 'Import Wallet'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className='p-6 space-y-4'>
            <div className='text-center space-y-2 py-8'>
                <h1 className='text-3xl font-bold'>Lightbeam Wallet</h1>
                <p className='text-muted-foreground'>Keeta Network Wallet</p>
            </div>
            <div className='space-y-3'>
                <Button onClick={() => setMode('create')} className='w-full' size='lg'>
                    Create New Wallet
                </Button>
                <Button onClick={() => setMode('import')} variant='outline' className='w-full' size='lg'>
                    Import Wallet
                </Button>
            </div>
        </div>
    )
}
