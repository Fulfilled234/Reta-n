import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo, Wordmark } from '../components/Logo'
import { TabBar } from '../components/TabBar'
import { useShop } from '../context/ShopContext'
import { daysSince, formatNgPhoneDisplay } from '../lib/whatsapp'

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
}

export default function Customers() {
  const { customers } = useShop()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q ? customers.filter((c) => c.name.toLowerCase().includes(q)) : customers
    return [...list].sort((a, b) => a.name.localeCompare(b.name))
  }, [customers, query])

  return (
    <div className="min-h-full bg-paper pb-28">
      <div className="max-w-md mx-auto px-5 pt-6">
        <div className="flex items-center gap-2.5">
          <Logo />
          <Wordmark />
        </div>

        <div className="flex items-center justify-between mt-6">
          <h1 className="font-display text-2xl text-ink">All customers</h1>
          <span className="text-sm text-muted">{customers.length}</span>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name"
          className="w-full rounded-card border border-line bg-card px-4 py-3 text-ink mt-4 focus:border-brand"
        />

        <div className="space-y-2.5 mt-4">
          {filtered.length === 0 && (
            <div className="rounded-card border border-dashed border-line px-4 py-8 text-center">
              <p className="text-ink font-medium">
                {customers.length === 0 ? 'No customers yet' : 'No matches'}
              </p>
              <p className="text-sm text-muted mt-1">
                {customers.length === 0 ? 'Log your first visit from Today.' : 'Try a different name.'}
              </p>
            </div>
          )}
          {filtered.map((c) => {
            const quiet = daysSince(c.last_visit)
            return (
              <button
                key={c.id}
                onClick={() => navigate(`/customers/${c.id}`)}
                className="w-full flex items-center gap-3 rounded-card bg-card border border-line px-4 py-3 text-left"
              >
                <div className="w-11 h-11 rounded-full bg-brand-light text-brand-dark flex items-center justify-center font-display text-sm shrink-0">
                  {initials(c.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-ink font-medium truncate">{c.name}</p>
                  <p className="text-sm text-muted">{formatNgPhoneDisplay(c.phone)}</p>
                </div>
                <span className="text-sm text-muted shrink-0">
                  {quiet === 0 ? 'Today' : `${quiet}d`}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <TabBar />
    </div>
  )
}
