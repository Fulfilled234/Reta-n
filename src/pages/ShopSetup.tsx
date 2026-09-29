import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo, Wordmark } from '../components/Logo'
import { useShop } from '../context/ShopContext'
import { SHOP_TYPE_LABEL, ShopType } from '../types'

const TYPES = Object.keys(SHOP_TYPE_LABEL) as ShopType[]

export default function ShopSetup() {
  const { createShop } = useShop()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [type, setType] = useState<ShopType>('salon')
  const [area, setArea] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    await createShop(name.trim(), type, area.trim())
    setBusy(false)
    navigate('/today')
  }

  return (
    <div className="min-h-full bg-paper flex flex-col">
      <div className="px-5 pt-6">
        <div className="flex items-center gap-2.5">
          <Logo />
          <Wordmark />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <p className="text-sm text-muted uppercase tracking-wide">Your shop</p>
          <h1 className="font-display text-3xl text-ink mt-1">Put your name on it.</h1>
          <p className="text-muted mt-2">This is what your customers will see in your nudge messages.</p>

          <label className="text-sm text-muted mt-6 block">Shop name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Glow by Teni"
            className="w-full rounded-card border border-line bg-card px-4 py-3 text-ink mt-1.5 focus:border-brand"
          />

          <p className="text-sm text-muted mt-5">Type</p>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {TYPES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`rounded-pill px-4 py-2 text-sm font-medium border ${
                  type === t ? 'bg-brand text-white border-brand' : 'bg-card text-ink border-line'
                }`}
              >
                {SHOP_TYPE_LABEL[t]}
              </button>
            ))}
          </div>

          <label className="text-sm text-muted mt-5 block">Area (optional)</label>
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Ikeja, Lagos"
            className="w-full rounded-card border border-line bg-card px-4 py-3 text-ink mt-1.5 focus:border-brand"
          />

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-pill bg-brand text-white font-medium py-3.5 mt-7 disabled:opacity-60"
          >
            {busy ? 'Setting up…' : 'Open my shop'}
          </button>
        </form>
      </div>
    </div>
  )
}
