import { useMemo, useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { formatNgPhoneDisplay, normalizeNgPhone } from '../lib/whatsapp'

export default function LogVisit() {
  const { customers, addCustomer, markCameBack } = useShop()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newSpend, setNewSpend] = useState('')
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const matches = useMemo(() => {
    if (!query.trim()) return []
    const q = query.trim().toLowerCase()
    return customers.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 6)
  }, [query, customers])

  async function handleReturningVisit(customerId: string, name: string) {
    setBusy(true)
    await markCameBack(customerId)
    setBusy(false)
    navigate('/today', { state: { savedName: name } })
  }

  const [limitError, setLimitError] = useState<string | null>(null)

  async function handleAddNew(e: FormEvent) {
    e.preventDefault()
    setPhoneError(null)
    setLimitError(null)
    if (!normalizeNgPhone(newPhone)) {
      setPhoneError('That doesn\u2019t look like a Nigerian mobile number — try 0803 123 4567.')
      return
    }
    setBusy(true)
    const { error } = addCustomer(newName.trim(), newPhone.trim(), newSpend ? Number(newSpend) : undefined)
    setBusy(false)
    if (error) {
      setLimitError(error)
      return
    }
    navigate('/today', { state: { savedName: newName.trim() } })
  }

  return (
    <div className="min-h-full bg-paper">
      <div className="max-w-md mx-auto px-5 pt-6 pb-10">
        <button onClick={() => navigate('/today')} className="text-muted mb-4">
          ← Back
        </button>
        <h1 className="font-display text-3xl text-ink">Log a visit</h1>
        <p className="text-muted mt-1.5">Search a returning customer, or add someone new.</p>

        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowNewForm(false)
          }}
          placeholder="Search by name"
          className="w-full rounded-card border border-line bg-card px-4 py-3 text-ink mt-5 focus:border-brand"
        />

        {query.trim() && (
          <div className="mt-3 space-y-2">
            {matches.map((c) => (
              <button
                key={c.id}
                disabled={busy}
                onClick={() => handleReturningVisit(c.id, c.name)}
                className="w-full flex items-center justify-between rounded-card border border-line bg-card px-4 py-3 text-left disabled:opacity-60"
              >
                <div>
                  <p className="text-ink font-medium">{c.name}</p>
                  <p className="text-sm text-muted">{formatNgPhoneDisplay(c.phone)}</p>
                </div>
                <span className="text-sm text-brand-dark font-medium">Log visit</span>
              </button>
            ))}

            <button
              onClick={() => {
                setNewName(query)
                setShowNewForm(true)
              }}
              className="w-full rounded-card border border-dashed border-line px-4 py-3 text-left text-muted"
            >
              + Add "{query}" as a new customer
            </button>
          </div>
        )}

        {showNewForm && (
          <form onSubmit={handleAddNew} className="mt-6 border-t border-line pt-6">
            <p className="text-sm text-muted uppercase tracking-wide">New customer</p>

            <label className="text-sm text-muted mt-4 block">Name</label>
            <input
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-card border border-line bg-card px-4 py-3 text-ink mt-1.5 focus:border-brand"
            />

            <label className="text-sm text-muted mt-4 block">WhatsApp number</label>
            <input
              required
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="0803 123 4567"
              className="w-full rounded-card border border-line bg-card px-4 py-3 text-ink mt-1.5 focus:border-brand"
            />
            {phoneError && <p className="text-sm text-lost mt-1.5">{phoneError}</p>}

            <label className="text-sm text-muted mt-4 block">Amount spent today (optional)</label>
            <input
              type="number"
              inputMode="numeric"
              value={newSpend}
              onChange={(e) => setNewSpend(e.target.value)}
              placeholder="8000"
              className="w-full rounded-card border border-line bg-card px-4 py-3 text-ink mt-1.5 focus:border-brand"
            />
            <p className="text-xs text-muted mt-1.5">
              Used to show how much repeat business is at stake when they go quiet.
            </p>

            {limitError && <p className="text-sm text-lost mt-4">{limitError}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-pill bg-brand text-white font-medium py-3.5 mt-6 disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Save customer'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
