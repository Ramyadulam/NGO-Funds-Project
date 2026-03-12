'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ngoAPI, donationAPI, type NGO } from '@/lib/api'
import { useWeb3 } from '@/lib/web3-context'
import { Search, Filter, MapPin, Target, TrendingUp, Heart, Sparkles, ArrowUpRight, Users, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'environment', label: 'Environment' },
  { value: 'poverty', label: 'Poverty Relief' },
  { value: 'animal-welfare', label: 'Animal Welfare' },
  { value: 'disaster-relief', label: 'Disaster Relief' },
  { value: 'other', label: 'Other' },
]

export default function DashboardPage() {
  const [ngos, setNgos] = useState<NGO[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(null)
  const [donationAmount, setDonationAmount] = useState('')
  const [donationMessage, setDonationMessage] = useState('')
  const [donating, setDonating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [stats, setStats] = useState<{ totalNGOs: number; totalRaised: number; totalTarget: number } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { isConnected, donateToNGO, connectWallet, isCorrectNetwork, switchToSepolia } = useWeb3()
  const router = useRouter()

  useEffect(() => {
    fetchNGOs()
    fetchStats()
  }, [selectedCategory, searchQuery])

  const fetchNGOs = async () => {
    setLoading(true)
    try {
      const data = await ngoAPI.getAll(selectedCategory, searchQuery)
      if (data.success) {
        setNgos(data.data)
      } else {
        toast.error('Failed to load NGOs')
      }
    } catch (error) {
      console.error('Error fetching NGOs:', error)
      toast.error('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await ngoAPI.getStats()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleDonate = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please log in to donate')
      router.push('/login')
      return
    }

    if (!isConnected) {
      toast.error('Please connect your MetaMask wallet')
      await connectWallet()
      return
    }

    if (!isCorrectNetwork) {
      toast.error('Please switch to the correct network')
      await switchToSepolia()
      return
    }

    if (!donationAmount || isNaN(Number(donationAmount)) || Number(donationAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (!selectedNgo) return

    setDonating(true)
    try {
      // Step 1: Execute Blockchain Transaction
      toast.loading('Please confirm the transaction in MetaMask...')
      const txHash = await donateToNGO(selectedNgo._id, donationAmount, donationMessage)
      toast.dismiss()
      toast.success('Blockchain transaction successful!')

      // Step 2: Call Backend API with the Hash
      const data = await donationAPI.create(selectedNgo._id, Number(donationAmount), donationMessage, txHash)

      if (data.success) {
        toast.success(`Successfully donated $${donationAmount} to ${selectedNgo.name}!`, {
          description: `Blockchain TX: ${txHash.slice(0, 10)}...`,
        })
        setDonationAmount('')
        setDonationMessage('')
        setSelectedNgo(null)
        setDialogOpen(false)
        fetchNGOs() // Refresh to show updated amounts
      } else {
        toast.error(data.message || 'Donation failed to record on backend')
      }
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.message || 'Something went wrong')
    } finally {
      setDonating(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      education: 'bg-blue-500/15 text-blue-600 border-blue-500/30 shadow-blue-500/10',
      healthcare: 'bg-green-500/15 text-green-600 border-green-500/30 shadow-green-500/10',
      environment: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 shadow-emerald-500/10',
      poverty: 'bg-orange-500/15 text-orange-600 border-orange-500/30 shadow-orange-500/10',
      'animal-welfare': 'bg-purple-500/15 text-purple-600 border-purple-500/30 shadow-purple-500/10',
      'disaster-relief': 'bg-red-500/15 text-red-600 border-red-500/30 shadow-red-500/10',
      other: 'bg-gray-500/15 text-gray-600 border-gray-500/30 shadow-gray-500/10',
    }
    return colors[category] || colors.other
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      {/* Stats Section */}
      {stats && (
        <section className="relative border-b border-border/50 bg-card/30 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-2xl p-6 flex items-center gap-5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Active NGOs</p>
                  <p className="text-4xl font-bold gradient-text">{stats.totalNGOs}</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 flex items-center gap-5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Raised</p>
                  <p className="text-4xl font-bold text-green-600">${stats.totalRaised?.toLocaleString()}</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 flex items-center gap-5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Goal</p>
                  <p className="text-4xl font-bold text-accent">${stats.totalTarget?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="relative max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header with Search and Filter */}
        <div className="mb-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border border-primary/20 px-4 py-1.5 text-xs font-medium text-primary bg-primary/5">
                <Sparkles className="h-3 w-3 mr-2" />
                Verified Organizations
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Explore <span className="gradient-text">NGOs</span>
              </h2>
              <p className="text-muted-foreground text-lg">Browse and support verified non-profit organizations</p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <Input
                placeholder="Search NGOs by name or mission..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 h-14 text-lg rounded-2xl border-2 border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary/50 shadow-lg focus:shadow-xl transition-all"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[220px] h-14 rounded-2xl border-2 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="rounded-lg">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* NGO Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="glass rounded-3xl overflow-hidden animate-pulse">
                <div className="h-56 bg-muted/50" />
                <CardHeader>
                  <div className="h-7 bg-muted/50 rounded-lg w-3/4" />
                  <div className="h-5 bg-muted/50 rounded-lg w-full mt-3" />
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted/50 rounded-full w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : ngos.length === 0 ? (
          <div className="text-center py-20">
            <div className="size-24 mx-auto mb-6 rounded-3xl bg-muted/50 flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-xl mb-4">No NGOs found matching your criteria</p>
            <Button variant="outline" className="rounded-full px-6" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ngos.map((ngo, index) => (
              <Card
                key={ngo._id}
                className="glass rounded-3xl overflow-hidden border-0 shadow-xl card-hover group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={ngo.image}
                    alt={ngo.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <Badge className={`absolute top-4 right-4 ${getCategoryColor(ngo.category)} rounded-full px-4 py-1.5 font-semibold shadow-lg border backdrop-blur-sm`}>
                    {ngo.category.replace('-', ' ')}
                  </Badge>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{ngo.name}</h3>
                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                      <MapPin className="h-4 w-4" />
                      {ngo.location}
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-5">
                  <CardDescription className="line-clamp-2 text-base leading-relaxed">{ngo.description}</CardDescription>

                  <div className="space-y-3">
                    <div className="flex justify-between text-base font-semibold">
                      <span className="text-primary">${ngo.raisedAmount?.toLocaleString()} raised</span>
                      <span className="text-muted-foreground">Goal: ${ngo.targetAmount?.toLocaleString()}</span>
                    </div>
                    <div className="relative">
                      <Progress value={ngo.progress || (ngo.raisedAmount / ngo.targetAmount) * 100} className="h-3 rounded-full" />
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary/20 to-primary/0 animate-shimmer"
                          style={{ width: `${ngo.progress || (ngo.raisedAmount / ngo.targetAmount) * 100}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground text-right font-medium">
                      {Math.round(ngo.progress || (ngo.raisedAmount / ngo.targetAmount) * 100)}% funded
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="px-6 pb-6 pt-0 gap-3">
                  <Link href={`/donate?ngoId=${ngo._id}`} className="flex-1">
                    <Button className="w-full btn-gradient text-white rounded-xl h-12 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group">
                      <Heart className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      Donate Now
                    </Button>
                  </Link>
                  <Link href={`/ngo/${ngo._id}`}>
                    <Button variant="outline" size="icon" className="size-12 rounded-xl border-2 hover:bg-primary/5 hover:border-primary transition-all group">
                      <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      <span className="sr-only">View Details</span>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
