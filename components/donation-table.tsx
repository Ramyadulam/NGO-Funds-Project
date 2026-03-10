interface Donation {
  id: string
  donor: string
  amount: string
  purpose: string
  timestamp: number
}

interface DonationTableProps {
  donations: Donation[]
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function DonationTable({ donations }: DonationTableProps) {
  if (donations.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-muted-foreground">No donations yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
              Donor Address
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
              Purpose
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="px-6 py-4 text-sm font-mono text-card-foreground">
                {shortenAddress(donation.donor)}
              </td>
              <td className="px-6 py-4 text-sm text-card-foreground font-semibold">
                {donation.amount} ETH
              </td>
              <td className="px-6 py-4 text-sm text-card-foreground max-w-xs truncate">
                {donation.purpose}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                {formatDate(donation.timestamp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
