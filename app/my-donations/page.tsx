'use client'

import { useState, useEffect } from 'react'
import { MOCK_DONATIONS } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'
import { donationAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function MyDonationsPage() {
    const [stats, setStats] = useState<any>(null)
    const [donations, setDonations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/login')
                    return
                }

                // Fetch Stats
                const statsData = await donationAPI.getUserStats()
                if (statsData.success) {
                    setStats(statsData.data)
                } else if (statsData.message === 'Not authorized to access this route') {
                    // Token likely expired
                    localStorage.removeItem('token')
                    router.push('/login')
                    return
                }

                // Fetch Donations
                const donationsData = await donationAPI.getUserDonations()
                if (donationsData.success) {
                    setDonations(donationsData.data)
                }

            } catch (error) {
                console.error("Error fetching donation data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [router])
    return (
        <main className="min-h-screen bg-background">
            <section className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground">My Donations</h2>
                    <p className="text-muted-foreground mt-1">A history of your contributions to various causes</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Contributed</CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {loading ? "..." : `$${stats?.totalAmount?.toLocaleString() || '0'}`}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Donations Count</CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {loading ? "..." : `${stats?.totalDonations || 0} Donations`}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Blockchain Status</CardDescription>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                                Verified
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card className="border-border">
                    <CardHeader>
                        <CardTitle>Donation History</CardTitle>
                        <CardDescription>All your transactions are securely stored and verified.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8 text-muted-foreground">Loading donations...</div>
                        ) : donations.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">No donations found. Start by making a contribution!</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>NGO Name</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Transaction ID</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {donations.map((donation) => (
                                        <TableRow key={donation._id}>
                                            <TableCell className="font-medium">{donation.ngo?.name || 'Unknown NGO'}</TableCell>
                                            <TableCell>${donation.amount.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={donation.paymentStatus === 'completed' ? 'default' : 'secondary'} className={donation.paymentStatus === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}>
                                                    {donation.paymentStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                                                    {donation.blockchainHash ? `${donation.blockchainHash.slice(0, 10)}...` : (donation.transactionId || 'N/A')}
                                                </code>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}
