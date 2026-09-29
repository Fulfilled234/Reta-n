export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex-1 rounded-card bg-card border border-line px-4 py-3">
      <p className="text-sm text-muted">{label}</p>
      <p className="font-display text-2xl text-ink mt-0.5">{value}</p>
    </div>
  )
}
