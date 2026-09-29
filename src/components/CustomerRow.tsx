import { daysSince } from '../lib/whatsapp'
import type { Customer } from '../types'

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function CustomerRow({
  customer,
  onOpen
}: {
  customer: Customer
  onOpen: (customer: Customer) => void
}) {
  const quietDays = daysSince(customer.last_visit)
  const isNudged = customer.status === 'nudged'
  const isLost = quietDays >= 21 && customer.status !== 'active'

  const badgeColor = isLost ? 'bg-lost-light text-lost' : isNudged ? 'bg-brand-light text-brand-dark' : 'bg-quiet-light text-quiet'
  const avatarColor = isLost ? 'bg-lost-light text-lost' : isNudged ? 'bg-brand-light text-brand-dark' : 'bg-quiet-light text-quiet'

  return (
    <button
      onClick={() => onOpen(customer)}
      className="w-full flex items-center gap-3 rounded-card bg-card border border-line px-4 py-3 text-left hover:border-brand/40 transition-colors"
    >
      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-display text-sm ${avatarColor}`}>
        {initials(customer.name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-ink truncate">{customer.name}</p>
        <p className="text-sm text-muted">
          {isNudged ? 'Nudge sent' : `${quietDays} day${quietDays === 1 ? '' : 's'} quiet`}
        </p>
      </div>
      <span className={`text-sm px-3 py-1 rounded-pill shrink-0 ${badgeColor}`}>
        {isNudged ? 'Sent' : isLost ? 'Lost' : 'Nudge'}
      </span>
    </button>
  )
}
