import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Logo, Wordmark } from '../components/Logo'
import { StatCard } from '../components/StatCard'
import { CustomerRow } from '../components/CustomerRow'
import { NudgeSheet } from '../components/NudgeSheet'
import { TabBar } from '../components/TabBar'
import { useShop } from '../context/ShopContext'
import { daysSince, formatNgPhoneDisplay } from '../lib/whatsapp'
import type { Customer } from '../types'

export default function Today() {
  const { shop, customers, markNudged, markCameBack, exportMyList } = useShop()
  const navigate = useNavigate()
  const location = useLocation()
  const [active, setActive] = useState<Customer | null>(null)
  const [toast, setToast] = useState<string | null>(
    (location.state as { savedName?: string } | null)?.savedName
      ? `Saved ${(location.state as { savedName?: string }).savedName}`
      : null
  )

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const quietAfter = shop?.quiet_after_days ?? 7

  const { quiet, nudged, active: stillActive, moneyAtStake, broughtBack, nudgesSent } = useMemo(() => {
    const quiet = customers.filter((c) => daysSince(c.last_visit) >= quietAfter && c.status !== 'nudged')
    const nudged = customers.filter((c) => c.status === 'nudged')
    const stillActive = customers.filter(
      (c) => c.status === 'active' && daysSince(c.last_visit) < quietAfter
    )
    const money = quiet.reduce((sum, c) => sum + (c.last_spend ?? 0), 0)
    return {
      quiet,
      nudged,
      active: stillActive,
      moneyAtStake: money,
      broughtBack: customers.filter((c) => c.nudged_at && c.status === 'active').length,
      nudgesSent: nudged.length
    }
  }, [customers, quietAfter])

  if (!shop) return null

  return (
    <div className="min-h-full bg-paper pb-32">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-forest text-white text-sm px-4 py-2.5 rounded-pill shadow-lg">
          {toast}
        </div>
      )}
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
          {quiet.length === 0 && customers.length > 0 && (
            <p className="text-sm text-muted">No customers yet. Log your first visit below.</p>
          )}
          {quiet.map((c) => (
            <CustomerRow key={c.id} customer={c} onOpen={setActive} />
          ))}
        </div>

        {nudged.length > 0 && (
          <>
            <div className="flex items-center justify-between mt-8">
              <h2 className="font-display text-xl text-ink">Already nudged</h2>
              <span className="text-sm text-muted">{nudged.length}</span>
            </div>
            <p className="text-sm text-muted mt-1">Waiting to see if they come back.</p>
            <div className="space-y-2.5 mt-3">
              {nudged.map((c) => (
                <CustomerRow key={c.id} customer={c} onOpen={setActive} />
              ))}
            </div>
          </>
        )}

        {stillActive.length > 0 && (
          <>
            <div className="flex items-center justify-between mt-8">
              <h2 className="font-display text-xl text-ink">Recently visited</h2>
              <span className="text-sm text-muted">{stillActive.length}</span>
            </div>
            <p className="text-sm text-muted mt-1">
              Quiet for less than {quietAfter} days — nothing to do yet.
            </p>
            <div className="space-y-2 mt-3">
              {stillActive.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-card bg-card border border-line px-4 py-3"
                >
                  <div>
                    <p className="text-ink font-medium">{c.name}</p>
                    <p className="text-sm text-muted">{formatNgPhoneDisplay(c.phone)}</p>
                  </div>
                  <span className="text-sm text-muted">
                    {daysSince(c.last_visit) === 0 ? 'Today' : `${daysSince(c.last_visit)}d ago`}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => navigate('/customers')}
          className="w-full flex items-center justify-center gap-2 rounded-card border border-dashed border-line text-muted py-3 mt-8"
        >
          See all {customers.length} customer{customers.length === 1 ? '' : 's'}
        </button>
      </div>

      <button
        onClick={() => navigate('/log-visit')}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 rounded-pill bg-forest text-white font-medium px-6 py-3.5 shadow-lg flex items-center gap-2"
      >
        <span className="text-lg leading-none">+</span> Log a visit
      </button>

      <TabBar />

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
