interface LogEntry {
  id: string
  amount: string
  reason: string
  timestamp: number
  action: string
}

interface AuditLogProps {
  log: LogEntry[]
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

export default function AuditLog({ log }: AuditLogProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Audit Log</h3>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {log.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-muted-foreground">No spending records yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {log.map((entry) => (
              <div key={entry.id} className="px-6 py-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-card-foreground">{entry.action}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {entry.amount} ETH
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{entry.reason}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(entry.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
