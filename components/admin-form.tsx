'use client'

import React from "react"

import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface LogEntry {
  id: string
  amount: string
  reason: string
  timestamp: number
  action: string
}

interface AdminFormProps {
  onFundsMarked: (entry: LogEntry) => void
}

interface FormData {
  amount: string
  reason: string
}

export default function AdminForm({ onFundsMarked }: AdminFormProps) {
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    reason: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.reason) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      // Mock API call
      const response = await fetch('/api/admin/mark-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: formData.amount,
          reason: formData.reason,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Add to audit log
        onFundsMarked({
          id: data.id || Math.random().toString(36),
          amount: formData.amount,
          reason: formData.reason,
          timestamp: Math.floor(Date.now() / 1000),
          action: 'Funds Marked',
        })

        setFormData({ amount: '', reason: '' })
        setSuccess(true)

        setTimeout(() => setSuccess(false), 3000)
      } else {
        alert('Failed to mark funds. Please try again.')
      }
    } catch (error) {
      console.error('Error marking funds:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Mark Funds as Used</h3>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm font-semibold">Funds marked successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div>
          <label htmlFor="admin-amount" className="block text-sm font-medium text-card-foreground mb-2">
            Amount to Spend (ETH)
          </label>
          <input
            type="number"
            id="admin-amount"
            name="amount"
            placeholder="0.5"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="admin-reason" className="block text-sm font-medium text-card-foreground mb-2">
            Reason for Spending
          </label>
          <textarea
            id="admin-reason"
            name="reason"
            placeholder="e.g., Medical supplies purchase, Staff salaries, Operations"
            rows={4}
            value={formData.reason}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !formData.amount || !formData.reason}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Mark Funds as Used'}
        </Button>
      </form>
    </div>
  )
}
