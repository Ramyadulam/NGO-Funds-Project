'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { ngoAPI, donationAPI, type NGO, type Donation } from '@/lib/api'
import { useWeb3 } from '@/lib/web3-context'
import { MapPin, Target, TrendingUp, Heart, ArrowLeft, Calendar, User, DollarSign, Clock } from 'lucide-react'
import Link from 'next/link'

export default function NGODetailPage() {
    const params = useParams()
    const router = useRouter()
    const ngoId = params.id as string

    const [ngo, setNgo] = useState<NGO | null>(null)
    const [donations, setDonations] = useState<Donation[]>([])
    const [loading, setLoading] = useState(true)
    const [donationAmount, setDonationAmount] = useState('')
    const [donationMessage, setDonationMessage] = useState('')
    const [donating, setDonating] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(() => {
        if (ngoId) {
            fetchNGO()
            fetchDonations()
        }
    }, [ngoId])

    const fetchNGO = async () => {
        try {
            const data = await ngoAPI.getById(ngoId)
            if (data.success) {
                setNgo(data.data)
            } else {
                toast.error('NGO not found')
                router.push('/dashboard')
            }
        } catch (error) {
            console.error('Error fetching NGO:', error)
            toast.error('Failed to load NGO details')
        } finally {
            setLoading(false)
        }
    }

    const fetchDonations = async () => {
        try {
            const data = await donationAPI.getNGODonations(ngoId)
            if (data.success) {
                setDonations(data.data)
            }
        } catch (error) {
            console.error('Error fetching donations:', error)
        }
    }

    const { isConnected, donateToNGO, connectWallet, isCorrectNetwork, switchToGanache } = useWeb3()

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
            await switchToGanache()
            return
        }

        if (!donationAmount || isNaN(Number(donationAmount)) || Number(donationAmount) <= 0) {
            toast.error('Please enter a valid amount')
            return
        }

        if (!ngo) return

        setDonating(true)
        try {
            // Step 1: Execute Blockchain Transaction
            toast.loading('Please confirm the transaction in MetaMask...')
            const txHash = await donateToNGO(ngo._id, donationAmount, donationMessage)
            toast.dismiss()
            toast.success('Blockchain transaction successful!')

            // Step 2: Call Backend API with the Hash
            const data = await donationAPI.create(ngo._id, Number(donationAmount), donationMessage, txHash)

            if (data.success) {
                toast.success(`Successfully donated $${donationAmount} to ${ngo.name}!`, {
                    description: `Blockchain TX: ${txHash.slice(0, 10)}...`,
                })
                setDonationAmount('')
                setDonationMessage('')
                setDialogOpen(false)
                fetchNGO() // Refresh to show updated amounts
                fetchDonations() // Refresh donations list
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
            education: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
            healthcare: 'bg-green-500/10 text-green-600 border-green-500/20',
            environment: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
            poverty: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
            'animal-welfare': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
            'disaster-relief': 'bg-red-500/10 text-red-600 border-red-500/20',
            other: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
        }
        return colors[category] || colors.other
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-muted rounded w-32" />
                        <div className="h-64 bg-muted rounded-xl" />
                        <div className="h-24 bg-muted rounded-xl" />
                    </div>
                </div>
            </main>
        )
    }

    if (!ngo) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-2">NGO Not Found</h2>
                    <p className="text-muted-foreground mb-4">The NGO you're looking for doesn't exist.</p>
                    <Link href="/dashboard">
                        <Button>Back to Dashboard</Button>
                    </Link>
                </div>
            </main>
        )
    }

    const progress = ngo.progress || (ngo.raisedAmount / ngo.targetAmount) * 100

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Link>

                {/* Hero Section */}
                <div className="relative rounded-2xl overflow-hidden mb-8">
                    <img
                        src={ngo.image}
                        alt={ngo.name}
                        className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <Badge className={`${getCategoryColor(ngo.category)} mb-3`}>
                            {ngo.category.replace('-', ' ')}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{ngo.name}</h1>
                        <div className="flex items-center gap-4 text-white/80">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {ngo.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Since {new Date(ngo.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About This NGO</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">{ngo.description}</p>
                            </CardContent>
                        </Card>

                        {/* Recent Donations */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Donations</CardTitle>
                                <CardDescription>Transparent record of all contributions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {donations.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No donations yet. Be the first to contribute!
                                    </p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Donor</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {donations.slice(0, 10).map((donation) => (
                                                <TableRow key={donation._id}>
                                                    <TableCell className="font-medium">
                                                        {donation.isAnonymous ? 'Anonymous' : donation.donor?.name || 'Unknown'}
                                                    </TableCell>
                                                    <TableCell className="text-green-600 font-semibold">
                                                        ${donation.amount.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {new Date(donation.createdAt).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={donation.paymentStatus === 'completed' ? 'default' : 'secondary'} className={donation.paymentStatus === 'completed' ? 'bg-green-600' : ''}>
                                                            {donation.paymentStatus}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Progress Card */}
                        <Card className="border-primary/20 bg-primary/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-primary" />
                                    Funding Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-primary">${ngo.raisedAmount?.toLocaleString()}</span>
                                        <span className="text-muted-foreground">${ngo.targetAmount?.toLocaleString()}</span>
                                    </div>
                                    <Progress value={progress} className="h-3" />
                                    <p className="text-center text-sm font-medium text-muted-foreground">
                                        {Math.round(progress)}% of goal reached
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-foreground">{donations.length}</p>
                                        <p className="text-xs text-muted-foreground">Total Donors</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-foreground">
                                            ${donations.length > 0 ? Math.round(ngo.raisedAmount / donations.length).toLocaleString() : 0}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Avg Donation</p>
                                    </div>
                                </div>

                                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full" size="lg">
                                            <Heart className="h-4 w-4 mr-2" />
                                            Donate Now
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Donate to {ngo.name}</DialogTitle>
                                            <DialogDescription>
                                                Your donation will be recorded on the blockchain for complete transparency.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="amount">Amount (USD)</Label>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    placeholder="Enter amount (e.g., 50)"
                                                    value={donationAmount}
                                                    onChange={(e) => setDonationAmount(e.target.value)}
                                                    min="1"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="message">Message (Optional)</Label>
                                                <Textarea
                                                    id="message"
                                                    placeholder="Leave a message of support..."
                                                    value={donationMessage}
                                                    onChange={(e) => setDonationMessage(e.target.value)}
                                                    rows={3}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter className="gap-2">
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button onClick={handleDonate} disabled={donating}>
                                                {donating ? 'Processing...' : 'Confirm Donation'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>

                        {/* Created By */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Created By</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{ngo.createdBy?.name || 'Admin'}</p>
                                        <p className="text-sm text-muted-foreground">{ngo.createdBy?.email || 'admin@ngo.com'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    )
}
