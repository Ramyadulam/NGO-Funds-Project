import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, reason } = body

    if (!amount || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Mock recording the fund usage
    const transactionHash = '0x' + Math.random().toString(16).slice(2, 66)

    return NextResponse.json(
      {
        success: true,
        id: Math.random().toString(36),
        transactionHash,
        amount,
        reason,
        timestamp: Math.floor(Date.now() / 1000),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin error:', error)
    return NextResponse.json(
      { error: 'Failed to mark funds' },
      { status: 500 }
    )
  }
}
