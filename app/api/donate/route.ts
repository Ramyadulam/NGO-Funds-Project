import { NextRequest, NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/api-config'

// Proxy donations API to real backend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward to Express backend
    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('Donation proxy error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process donation' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/donations`, {
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('Fetch donations proxy error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch donations' },
      { status: 500 }
    )
  }
}
