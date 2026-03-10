'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Wallet } from 'lucide-react'
import { useWeb3 } from '@/lib/web3-context'
import { DonationForm } from '@/components/donation-form'
import { formatAddress } from '@/lib/blockchain-utils'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function DonateContent() {
  const searchParams = useSearchParams()
  const initialNgoId = searchParams.get('ngoId') || ''

  const [ngos, setNgos] = useState<any[]>([])
  const [selectedNgoId, setSelectedNgoId] = useState(initialNgoId)
  const [initLoading, setInitLoading] = useState(true)
  const { account, isConnected, isConnecting, connectWallet, isCorrectNetwork, networkName } = useWeb3()

  useEffect(() => {
    if (initialNgoId) {
      setSelectedNgoId(initialNgoId)
    }
  }, [initialNgoId])

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/ngos')
        const data = await res.json()
        if (data.success) {
          setNgos(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch NGOs', error)
        toast.error('Failed to load NGOs')
      } finally {
        setInitLoading(false)
      }
    }
    fetchNgos()
  }, [])

  const selectedNgo = ngos.find(ngo => ngo._id === selectedNgoId)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Make a Donation</h1>
        <p className="text-muted-foreground">Support NGOs using blockchain technology</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connection
          </CardTitle>
          <CardDescription>Connect your MetaMask wallet to make donations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">You need to connect your MetaMask wallet to continue.</p>
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                size="lg"
                className="w-full"
              >
                <Wallet className="h-5 w-5 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-900">✓ Wallet Connected</p>
                <p className="text-xs text-green-700 font-mono mt-1">{formatAddress(account as string, 6)}</p>
                <p className="text-xs text-green-700 mt-2">Network: {networkName}</p>
                {!isCorrectNetwork && (
                  <p className="text-xs text-amber-600 mt-2">⚠️ Switch to Ganache network to donate</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Select NGO and Donate</CardTitle>
            <CardDescription>Choose an NGO and enter donation details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select NGO</label>
              <Select value={selectedNgoId} onValueChange={setSelectedNgoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an NGO" />
                </SelectTrigger>
                <SelectContent>
                  {ngos.map(ngo => (
                    <SelectItem key={ngo._id} value={ngo._id}>
                      {ngo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedNgo && (
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">{selectedNgo.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedNgo.description}</p>
                <Badge variant="outline">{selectedNgo.category}</Badge>
              </div>
            )}

            {selectedNgo && <DonationForm ngoId={selectedNgo._id} ngoName={selectedNgo.name} />}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function DonatePage() {
  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <Suspense fallback={<div className="max-w-4xl mx-auto text-center py-20">Loading donation page...</div>}>
        <DonateContent />
      </Suspense>
    </main>
  )
}
