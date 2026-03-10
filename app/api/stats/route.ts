import { NextResponse } from 'next/server'

// Mock donation data
const mockDonations = [
  {
    id: '1',
    donor: '0xabcd1234abcd1234abcd1234abcd1234abcd1234',
    amount: '1.5',
    purpose: 'Education Support Programs',
    timestamp: Math.floor(Date.now() / 1000) - 86400 * 5,
  },
  {
    id: '2',
    donor: '0x1234abcd1234abcd1234abcd1234abcd1234abcd',
    amount: '2.0',
    purpose: 'Emergency Medical Relief',
    timestamp: Math.floor(Date.now() / 1000) - 86400 * 3,
  },
  {
    id: '3',
    donor: '0xefgh5678efgh5678efgh5678efgh5678efgh5678',
    amount: '0.75',
    purpose: 'Community Development',
    timestamp: Math.floor(Date.now() / 1000) - 86400,
  },
  {
    id: '4',
    donor: '0xijkl9012ijkl9012ijkl9012ijkl9012ijkl9012',
    amount: '3.25',
    purpose: 'Food Distribution Program',
    timestamp: Math.floor(Date.now() / 1000) - 43200,
  },
  {
    id: '5',
    donor: '0xmnop3456mnop3456mnop3456mnop3456mnop3456',
    amount: '1.1',
    purpose: 'Infrastructure Improvement',
    timestamp: Math.floor(Date.now() / 1000) - 3600,
  },
]

export async function GET() {
  try {
    // Calculate stats
    const totalDonations = mockDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0).toFixed(2)
    const totalSpent = (parseFloat(totalDonations) * 0.4).toFixed(2) // Mock: 40% spent
    const currentBalance = (parseFloat(totalDonations) - parseFloat(totalSpent)).toFixed(2)

    return NextResponse.json({
      totalDonations,
      totalSpent,
      currentBalance,
      donations: mockDonations,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
