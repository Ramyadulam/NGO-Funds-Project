'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ngoAPI, donationAPI, type NGO, type Donation } from '@/lib/api'
import { useWeb3 } from '@/lib/web3-context'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, DollarSign, Users, Building2, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react'

const CATEGORIES = [
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'environment', label: 'Environment' },
  { value: 'poverty', label: 'Poverty Relief' },
  { value: 'animal-welfare', label: 'Animal Welfare' },
  { value: 'disaster-relief', label: 'Disaster Relief' },
  { value: 'other', label: 'Other' },
]

interface FormData {
  name: string
  description: string
  category: string
  location: string
  targetAmount: string
  image: string
  walletAddress: string
}

const initialFormData: FormData = {
  name: '',
  description: '',
  category: '',
  location: '',
  targetAmount: '',
  image: '',
  walletAddress: ''
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [ngos, setNgos] = useState<NGO[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [stats, setStats] = useState<{ totalNGOs: number; totalRaised: number; totalTarget: number } | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [editingNgo, setEditingNgo] = useState<NGO | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [ngoToDelete, setNgoToDelete] = useState<NGO | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { isConnected, registerNGOOnBlockchain, connectWallet, isCorrectNetwork, switchToGanache } = useWeb3()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (!token || !userStr) {
      setIsLoggedIn(false)
      setLoading(false)
      return
    }

    try {
      const user = JSON.parse(userStr)
      setIsLoggedIn(true)
      setIsAdmin(user.role === 'admin')

      if (user.role === 'admin') {
        fetchData()
      }
    } catch (e) {
      console.error('Error parsing user:', e)
      setIsLoggedIn(false)
    }
    setLoading(false)
  }

  const fetchData = async () => {
    try {
      // Fetch NGOs
      const ngosData = await ngoAPI.getAll()
      if (ngosData.success) {
        setNgos(ngosData.data)
      }

      // Fetch all donations (admin only)
      const donationsData = await donationAPI.getAllDonations()
      if (donationsData.success) {
        setDonations(donationsData.data)
      }

      // Fetch stats
      const statsData = await ngoAPI.getStats()
      if (statsData.success) {
        setStats(statsData.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  const handleCreateNGO = async () => {
    if (!formData.name || !formData.description || !formData.category || !formData.location || !formData.targetAmount) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      // Step 1: Backend Call to get Mongo ID
      const data = await ngoAPI.create({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        targetAmount: Number(formData.targetAmount),
        image: formData.image || undefined,
        walletAddress: formData.walletAddress || undefined,
        isRegisteredOnChain: true // We'll handle it below
      })

      if (data.success) {
        const mongoId = data.data._id

        // Step 2: Blockchain Registration
        try {
          if (!isConnected) {
            toast.info('Please connect your wallet to register on blockchain')
            await connectWallet()
          }

          if (!isCorrectNetwork) {
            await switchToGanache()
          }

          toast.loading('Registering NGO on blockchain...')
          const txHash = await registerNGOOnBlockchain(
            mongoId,
            formData.name,
            formData.walletAddress || (await (window as any).ethereum.request({ method: 'eth_accounts' }))[0]
          )
          toast.dismiss()
          toast.success('NGO registered on blockchain!')

          toast.success('NGO created and registered successfully!')
        } catch (bcError: any) {
          toast.dismiss()
          console.error("Blockchain registration failed:", bcError)
          toast.warning('NGO created in database but blockchain registration failed. You can retry later.')
        }

        setCreateDialogOpen(false)
        setFormData(initialFormData)
        fetchData()
      } else {
        toast.error(data.message || 'Failed to create NGO')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditNGO = async () => {
    if (!editingNgo) return

    if (!formData.name || !formData.description || !formData.category || !formData.location || !formData.targetAmount) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const data = await ngoAPI.update(editingNgo._id, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        targetAmount: Number(formData.targetAmount),
        image: formData.image || undefined,
      })

      if (data.success) {
        toast.success('NGO updated successfully!')
        setEditDialogOpen(false)
        setEditingNgo(null)
        setFormData(initialFormData)
        fetchData()
      } else {
        toast.error(data.message || 'Failed to update NGO')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteNGO = async () => {
    if (!ngoToDelete) return

    setSubmitting(true)
    try {
      const data = await ngoAPI.delete(ngoToDelete._id)

      if (data.success) {
        toast.success('NGO deleted successfully!')
        setDeleteDialogOpen(false)
        setNgoToDelete(null)
        fetchData()
      } else {
        toast.error(data.message || 'Failed to delete NGO')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const openEditDialog = (ngo: NGO) => {
    setEditingNgo(ngo)
    setFormData({
      name: ngo.name,
      description: ngo.description,
      category: ngo.category,
      location: ngo.location,
      targetAmount: ngo.targetAmount.toString(),
      image: ngo.image || '',
      walletAddress: ngo.walletAddress || ''
    })
    setEditDialogOpen(true)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </main>
    )
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please log in to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/login">
              <Button className="w-full">Log In</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-destructive/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>Your account does not have admin privileges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Only administrators can access this panel. If you believe this is an error, please contact support.
            </p>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage NGOs, view donations, and monitor platform activity</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData(initialFormData)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New NGO
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New NGO</DialogTitle>
                <DialogDescription>Add a new organization to the platform</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">NGO Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Education For All"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the NGO's mission and goals..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Category *</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="targetAmount">Target Amount (USD) *</Label>
                    <Input
                      id="targetAmount"
                      name="targetAmount"
                      type="number"
                      value={formData.targetAmount}
                      onChange={handleInputChange}
                      placeholder="100000"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Mumbai, Maharashtra"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image URL (Optional)</Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="walletAddress">NGO Wallet Address (for receiving funds) *</Label>
                  <Input
                    id="walletAddress"
                    name="walletAddress"
                    value={formData.walletAddress}
                    onChange={handleInputChange}
                    placeholder="0x..."
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateNGO} disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create NGO'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total NGOs</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalNGOs}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${stats.totalRaised?.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Goal</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalTarget?.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{donations.length}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs for NGOs and Donations */}
        <Tabs defaultValue="ngos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="ngos">Manage NGOs</TabsTrigger>
            <TabsTrigger value="donations">All Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="ngos">
            <Card>
              <CardHeader>
                <CardTitle>All NGOs</CardTitle>
                <CardDescription>View and manage all organizations on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {ngos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No NGOs found. Create one to get started!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ngos.map((ngo) => (
                        <TableRow key={ngo._id}>
                          <TableCell className="font-medium">{ngo.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{ngo.category}</Badge>
                          </TableCell>
                          <TableCell>{ngo.location}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24">
                                <div className="text-xs text-muted-foreground mb-1">
                                  ${ngo.raisedAmount?.toLocaleString()} / ${ngo.targetAmount?.toLocaleString()}
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${Math.min(100, (ngo.raisedAmount / ngo.targetAmount) * 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(ngo)}>
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => { setNgoToDelete(ngo); setDeleteDialogOpen(true); }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>All Donations</CardTitle>
                <CardDescription>Complete history of all platform donations</CardDescription>
              </CardHeader>
              <CardContent>
                {donations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No donations yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Donor</TableHead>
                        <TableHead>NGO</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Transaction ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donations.map((donation) => (
                        <TableRow key={donation._id}>
                          <TableCell className="font-medium">
                            {donation.isAnonymous ? 'Anonymous' : donation.donor?.name || 'Unknown'}
                          </TableCell>
                          <TableCell>{donation.ngo?.name || 'Unknown NGO'}</TableCell>
                          <TableCell className="text-green-600 font-semibold">
                            ${donation.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={donation.paymentStatus === 'completed' ? 'default' : 'secondary'}
                              className={donation.paymentStatus === 'completed' ? 'bg-green-600' : ''}
                            >
                              {donation.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {donation.transactionId?.slice(0, 12)}...
                            </code>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit NGO</DialogTitle>
              <DialogDescription>Update the organization details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">NGO Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-targetAmount">Target Amount (USD) *</Label>
                  <Input
                    id="edit-targetAmount"
                    name="targetAmount"
                    type="number"
                    value={formData.targetAmount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location *</Label>
                <Input
                  id="edit-location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Image URL (Optional)</Label>
                <Input
                  id="edit-image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleEditNGO} disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive">Delete NGO</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{ngoToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteNGO} disabled={submitting}>
                {submitting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}
