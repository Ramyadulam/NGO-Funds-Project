interface StatsCardsProps {
  totalDonations: string
  totalSpent: string
  currentBalance: string
}

export default function StatsCards({
  totalDonations,
  totalSpent,
  currentBalance,
}: StatsCardsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Total Donations Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-sm font-medium text-muted-foreground mb-2">Total Donations</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-card-foreground">{totalDonations}</span>
          <span className="text-sm text-muted-foreground">ETH</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">All-time donations received</p>
      </div>

      {/* Total Spent Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-sm font-medium text-muted-foreground mb-2">Total Spent</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-card-foreground">{totalSpent}</span>
          <span className="text-sm text-muted-foreground">ETH</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Funds used for operations</p>
      </div>

      {/* Current Balance Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-sm font-medium text-muted-foreground mb-2">Current Balance</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">{currentBalance}</span>
          <span className="text-sm text-muted-foreground">ETH</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Available funds</p>
      </div>
    </div>
  )
}
