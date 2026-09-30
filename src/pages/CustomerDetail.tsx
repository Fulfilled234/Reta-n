import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Logo, Wordmark } from '../components/Logo'
import { NudgeSheet } from '../components/NudgeSheet'
import { useShop } from '../context/ShopContext'
import { daysSince, formatNgPhoneDisplay, normalizeNgPhone } from '../lib/whatsapp'

export default function CustomerDetail() {
  const { id } = useParams()
  const { shop, customers, addVisit, markNudged, markCameBack, updateCustomer, deleteCustomer } = useShop()
  const navigate = useNavigate()

  const customer = customers.find((c) => c.id === id)

  const [showNudge, setShowNudge] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(customer?.name ?? '')
  const [editPhone, setEditPhone] = useState(customer?.phone ?? '')
  const [editError, setEditError] = useState<string | null>(null)
  const [visitAmount, setVisitAmount] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const lifetime = useMemo(
    () => (customer?.visits ?? []).reduce((sum, v) => sum + (v.amount ?? 0), 0),
    [customer]
  )

  if (!shop) return null
  if (!customer) {
    return (
      <div className="min-h-full bg-paper flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-ink font-medium">Customer not found</p>
          <button onClick={() => navigate('/customers')} className="text-brand-dark underline mt-2">
            Back to customers
          </button>
        </div>
      </div>
    )
  }

  const quietDays = daysSince(customer.last_visit)
  const statusLabel =
    customer.status === 'nudged' ? 'Nudge sent' : quietDays >= shop.quiet_after_days ? 'Quiet' : 'Active'
  const statusColor =
    customer.status === 'nudged'
      ? 'bg-brand-light text-brand-dark'
      : quietDays >= shop.quiet_after_days
      ? 'bg-quiet-light text-quiet'
      : 'bg-brand-light text-brand-dark'

  function handleSaveEdit() {
    setEditError(null)
    if (!normalizeNgPhone(editPhone)) {
      setEditError('That doesn\u2019t look like a Nigerian mobile number.')
      return
    }
    updateCustomer(customer!.id, { name: editName.trim(), phone: editPhone.trim() })
    setEditing(false)
  }

  function handleAddVisit() {
    const amount = visitAmount ? Number(visitAmount) : undefined
    addVisit(customer!.id, amount)
    setVisitAmount('')
  }

  function handleDelete() {
    deleteCustomer(customer!.id)
    navigate('/customers')
  }

  return (
    <div className="min-h-full bg-paper pb-10">
      <div className="max-w-md mx-auto px-5 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo />
            <Wordmark />
          </div>
        </div>

        <button onClick={() => navigate('/customers')} className="text-muted mt-5">
          ← All customers
        </button>

        {editing ? (
          <div className="mt-4">
            <label className="text-sm text-muted">Name</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-card border border-line bg-card px-4 py-3 text-ink mt-1.5 focus:border-brand"
            />
            <label className="text-sm text-muted mt-3 block">WhatsApp number</label>
            <input
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="w-full rounded-card border border-line bg-card px-4 py-3 text-ink mt-1.5 focus:border-brand"
            />
            {editError && <p className="text-sm text-lost mt-1.5">{editError}</p>}
            <div className="flex gap-3 mt-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 rounded-pill bg-brand text-white font-medium py-3"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setEditName(customer.name)
                  setEditPhone(customer.phone)
                  setEditError(null)
                }}
                className="flex-1 rounded-pill border border-line text-ink font-medium py-3"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between mt-4">
            <div>
              <h1 className="font-display text-3xl text-ink">{customer.name}</h1>
              <p className="text-muted mt-0.5">{formatNgPhoneDisplay(customer.phone)}</p>
            </div>
            <span className={`text-sm px-3 py-1 rounded-pill shrink-0 ${statusColor}`}>{statusLabel}</span>
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <div className="flex-1 rounded-card bg-card border border-line px-3 py-2.5 text-center">
            <p className="text-xs text-muted">Quiet for</p>
            <p className="font-display text-xl text-ink">{quietDays}d</p>
          </div>
          <div className="flex-1 rounded-card bg-card border border-line px-3 py-2.5 text-center">
            <p className="text-xs text-muted">Visits</p>
            <p className="font-display text-xl text-ink">{customer.visits.length}</p>
          </div>
          <div className="flex-1 rounded-card bg-card border border-line px-3 py-2.5 text-center">
            <p className="text-xs text-muted">Lifetime</p>
            <p className="font-display text-xl text-ink">₦{lifetime.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowNudge(true)}
            className="flex-1 rounded-pill bg-brand text-white font-medium py-3"
          >
            Nudge
          </button>
          <button
            onClick={() => markCameBack(customer.id)}
            className="flex-1 rounded-pill border border-line text-ink font-medium py-3"
          >
            Came back
          </button>
        </div>

        <div className="rounded-card bg-card border border-line p-4 mt-5">
          <p className="font-display text-lg text-ink">Add a visit</p>
          <div className="flex gap-2 mt-2.5">
            <input
              type="number"
              inputMode="numeric"
              value={visitAmount}
              onChange={(e) => setVisitAmount(e.target.value)}
              placeholder="Amount spent (optional)"
              className="flex-1 rounded-card border border-line bg-paper px-4 py-2.5 text-ink focus:border-brand"
            />
            <button
              onClick={handleAddVisit}
              className="w-11 h-11 rounded-full bg-brand text-white flex items-center justify-center text-xl shrink-0"
              aria-label="Add visit"
            >
              +
            </button>
          </div>
        </div>

        <div className="rounded-card bg-card border border-line p-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg text-ink">Details</p>
            {!editing && (
              <button onClick={() => setEditing(true)} className="text-sm text-brand-dark font-medium">
                Edit
              </button>
            )}
          </div>
          <p className="text-sm text-muted mt-1.5">
            Added {new Date(customer.created_at).toLocaleDateString('en-GB')} · {customer.nudges_tapped}{' '}
            nudge{customer.nudges_tapped === 1 ? '' : 's'} tapped · {customer.times_came_back} marked as
            came back
          </p>
        </div>

        <div className="mt-5">
          <p className="font-display text-lg text-ink mb-2">Visit history</p>
          <div className="rounded-card bg-card border border-line divide-y divide-line">
            {customer.visits.map((v) => (
              <div key={v.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-ink">
                  {new Date(v.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-muted">{v.amount ? `₦${v.amount.toLocaleString()}` : '—'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-line">
          {confirmDelete ? (
            <div className="rounded-card bg-lost-light p-4">
              <p className="text-ink">
                This removes <span className="font-medium">{customer.name}</span> and their full history.
                This can't be undone.
              </p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-pill bg-lost text-white font-medium py-2.5"
                >
                  Delete for good
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 rounded-pill border border-line text-ink font-medium py-2.5"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-lost font-medium flex items-center gap-1.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M9 7V4h6v3m-8 0l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" />
              </svg>
              Delete customer
            </button>
          )}
        </div>
      </div>

      {showNudge && (
        <NudgeSheet
          customer={customer}
          shop={shop}
          onClose={() => setShowNudge(false)}
          onNudged={() => {
            markNudged(customer.id)
            setShowNudge(false)
          }}
          onCameBack={() => {
            markCameBack(customer.id)
            setShowNudge(false)
          }}
        />
      )}
    </div>
  )
}
