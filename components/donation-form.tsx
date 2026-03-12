'use client'

import React from "react"
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useWeb3 } from '@/lib/web3-context'
import { isValidDonationAmount, formatCurrency, formatTxHash } from '@/lib/blockchain-utils'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Wallet, Info } from 'lucide-react'
import { donationAPI } from '@/lib/api'

interface DonationFormProps {
  ngoId: string
  ngoName: string
}

interface FormData {
  amount: string
  message: string
}

interface SuccessMessage {
  show: boolean
  hash?: string
  blockchainTx?: string
}

export function DonationForm({ ngoId, ngoName }: DonationFormProps) {
  const { account, isConnected, isCorrectNetwork, donateToNGO, connectWallet, switchToSepolia } = useWeb3()
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<SuccessMessage>({ show: false })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const validateForm = (): string | null => {
    if (!formData.amount) return 'Please enter a donation amount'
    if (!isValidDonationAmount(formData.amount)) return 'Please enter a valid amount (greater than 0)'
    if (parseFloat(formData.amount) < 0.01) return 'Minimum donation is 0.01 ETH'
    if (!formData.message) return 'Please enter a donation message'
    if (formData.message.length > 500) return 'Message must be less than 500 characters'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    if (!isConnected) {
      setError('Please connect your wallet to donate')
      return
    }

    if (!isCorrectNetwork) {
      setError('Please switch to Sepolia network to donate')
      return
    }

    setLoading(true)
    setError(null)
    try {
      // 1. BLOCKCHAIN TRANSACTION FIRST - Get real transaction hash
      const txHash = await donateToNGO(ngoId, formData.amount, formData.message)

      if (!txHash) {
        throw new Error('Blockchain transaction failed')
      }

      // 2. THEN record to backend with actual transaction hash
      const data = await donationAPI.create(
        ngoId,
        Number(formData.amount),
        formData.message,
        txHash
      )

      if (!data.success) {
        console.warn('Backend recording failed, but blockchain transaction succeeded')
        console.warn('Transaction hash:', txHash)
      }

      setSuccess({
        show: true,
        hash: txHash,
        blockchainTx: formatTxHash(txHash),
      })
      setFormData({ amount: '', message: '' })

      setTimeout(() => setSuccess({ show: false }), 7000)
    } catch (error: any) {
      const errorMessage = error?.message || 'Donation failed. Please try again.'
      setError(errorMessage)
      console.error('Error submitting donation:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {success.show && (
        <Alert className="border-green-200 bg-green-50 text-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <p className="font-semibold mb-2">🎉 Donation Successful!</p>
            <p className="text-sm mb-2">Your donation has been recorded and transferred to {ngoName}.</p>
            {success.blockchainTx && (
              <p className="text-xs font-mono break-all text-green-700">
                TX: {success.blockchainTx}
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50 text-red-900">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isConnected ? (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Wallet className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="space-y-3">
            <p className="text-yellow-900 font-semibold">Connect Your Wallet to Donate</p>
            <Button
              onClick={connectWallet}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect MetaMask
            </Button>
          </AlertDescription>
        </Alert>
      ) : !isCorrectNetwork ? (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="space-y-3">
            <p className="text-orange-900 font-semibold">Switch to Sepolia Network</p>
            <Button
              onClick={switchToSepolia}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              Switch to Sepolia
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {isConnected && isCorrectNetwork && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-card-foreground mb-2">
              Donation Amount (ETH)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="0.5"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum: 0.01 ETH (you'll donate {formData.amount ? formatCurrency(formData.amount) : '0 ETH'})
            </p>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2">
              Donation Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Why are you supporting this NGO? Share your thoughts..."
              rows={4}
              maxLength={500}
              value={formData.message}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.message.length}/500 characters
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !formData.amount || !formData.message || !isConnected || !isCorrectNetwork}
            className="w-full"
          >
            {loading ? 'Processing Donation...' : 'Donate to ' + ngoName}
          </Button>
        </form>
      )}

      <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
        <div className="flex gap-2">
          <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Blockchain Transparency:</p>
            <ul className="space-y-1 text-xs">
              <li>✓ Your donation is recorded on the Sepolia test network</li>
              <li>✓ The NGO receives funds through a smart contract</li>
              <li>✓ All transactions are immutable and auditable</li>
              <li>✓ You receive a transaction hash as proof</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
