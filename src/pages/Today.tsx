import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo, Wordmark } from '../components/Logo'
import { StatCard } from '../components/StatCard'
import { CustomerRow } from '../components/CustomerRow'
import { NudgeSheet } from '../components/NudgeSheet'
import { useShop } from '../context/ShopContext'
import { daysSince } from '../lib/whatsapp'
import type { Customer } from '../types'

export default function Today() {
  const { shop, customers, markNudged, markCameBack, exportMyList } = useShop()
  const navigate = useNavigate()
  const [active, setActive] = useState<Customer | null>(null)

  const quietAfter = shop?.quiet_after_days ?? 7

  const { quiet, moneyAtStake, broughtBack, nudgesSent } = useMemo(() => {
    const quiet = customers.filter((c) => daysSince(c.last_visit) >= quietAfter && c.status !== 'nudged')
    const nudged = customers.filter((c) => c.status === 'nudged')
    const money = quiet.reduce((sum, c) => sum + (c.last_spend ?? 0), 0)
    return {
      quiet,
      moneyAtStake: money,
      broughtBack: customers.filter((c) => c.nudged_at && c.status === 'active').length,
      nudgesSent: nudged.length
    }
  }, [customers, quietAfter])

  if (!shop) return null

  return (
    <div className="min-h-full bg-paper pb-10">
      <div className="max-w-md mx-auto px-5 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo />
            <Wordmark />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm bg-card border border-line rounded-pill px-3 py-1 text-ink">
              {shop.plan === 'free' ? 'Free' : 'Pro'}
            </span>
            <button onClick={exportMyList} className="text-sm text-muted underline">
              Export my list
            </button>
          </div>
        </div>

        <p className="text-sm text-muted uppercase tracking-wide mt-6">
          {shop.area ? `${shop.area}` : 'Your shop'}
        </p>
        <h1 className="font-display text-3xl text-ink">{shop.name}</h1>

        {quiet.length > 0 ? (
          <div className="rounded-card bg-quiet text-white p-5 mt-4">
            <p className="text-xs uppercase tracking-wide opacity-80">Quiet for {quietAfter}+ days</p>
            <p className="font-display text-4xl mt-1">{quiet.length}</p>
            <p className="text-sm opacity-90 mt-1.5">
              {moneyAtStake > 0
                ? `About ₦${moneyAtStake.toLocaleString()} in repeat business is going quiet. Tap a name to send.`
                : 'Tap a name below, then send from your WhatsApp.'}
            </p>
          </div>
        ) : (
          <div className="rounded-card bg-brand-light p-5 mt-4">
            <p className="text-brand-dark font-medium">Nobody's gone quiet. You're on top of it.</p>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <StatCard label="Brought back" value={broughtBack} />
          <StatCard label="Nudges sent" value={nudgesSent} />
        </div>

        <div className="flex items-center justify-between mt-7">
          <h2 className="font-display text-xl text-ink">Needs a nudge</h2>
          <span className="text-sm text-muted">{quiet.length}</span>
        </div>

        <div className="space-y-2.5 mt-3">
          {quiet.length === 0 && customers.length === 0 && (
            <div className="rounded-card border border-dashed border-line px-4 py-8 text-center">
              <p className="text-ink font-medium">No customers logged yet</p>
              <p className="text-sm text-muted mt-1">Add your first one below — it takes ten seconds.</p>
            </div>
          )}
          {quiet.map((c) => (
            <CustomerRow key={c.id} customer={c} onOpen={setActive} />
          ))}
          {customers
            .filter((c) => c.status === 'nudged')
            .map((c) => (
              <CustomerRow key={c.id} customer={c} onOpen={setActive} />
            ))}
        </div>
      </div>

      <button
        onClick={() => navigate('/log-visit')}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-pill bg-forest text-white font-medium px-6 py-3.5 shadow-lg flex items-center gap-2"
      >
        <span className="text-lg leading-none">+</span> Log a visit
      </button>

      {active && (
        <NudgeSheet
          customer={active}
          shop={shop}
          onClose={() => setActive(null)}
          onNudged={async () => {
            await markNudged(active.id)
            setActive(null)
          }}
          onCameBack={async () => {
            await markCameBack(active.id)
            setActive(null)
          }}
        />
      )}
    </div>
  )
}
