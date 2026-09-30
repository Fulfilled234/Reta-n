import { useRef, useState } from 'react'
import { Logo, Wordmark } from '../components/Logo'
import { TabBar } from '../components/TabBar'
import { useShop } from '../context/ShopContext'
import { SHOP_TYPE_LABEL, ShopType } from '../types'

const QUIET_OPTIONS = [3, 5, 7, 14, 21, 30]
const TYPES = Object.keys(SHOP_TYPE_LABEL) as ShopType[]

export default function Settings() {
  const { shop, customers, updateShop, exportMyList, importMyList } = useShop()
  const [name, setName] = useState(shop?.name ?? '')
  const [area, setArea] = useState(shop?.area ?? '')
  const [importError, setImportError] = useState<string | null>(null)
  const [importOk, setImportOk] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!shop) return null

  function handleNameBlur() {
    if (name.trim() && name.trim() !== shop!.name) updateShop({ name: name.trim() })
  }

  function handleAreaBlur() {
    if (area.trim() !== (shop!.area ?? '')) updateShop({ area: area.trim() || null })
  }

  async function handleImportFile(file: File) {
    setImportError(null)
    setImportOk(false)
    const { error } = await importMyList(file)
    if (error) {
      setImportError(error)
      return
    }
    setImportOk(true)
    setTimeout(() => setImportOk(false), 2500)
  }

  return (
    <div className="min-h-full bg-paper pb-28">
      <div className="max-w-md mx-auto px-5 pt-6">
        <div className="flex items-center gap-2.5">
          <Logo />
          <Wordmark />
        </div>
        <h1 className="font-display text-3xl text-ink mt-6">Settings</h1>

        {/* Shop */}
        <section className="rounded-card bg-card border border-line p-5 mt-5">
          <p className="font-display text-xl text-ink">Shop</p>

          <label className="text-sm text-muted mt-4 block">Shop name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            className="w-full rounded-card border border-line bg-paper px-4 py-3 text-ink mt-1.5 focus:border-brand"
          />

          <label className="text-sm text-muted mt-4 block">Area</label>
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            onBlur={handleAreaBlur}
            className="w-full rounded-card border border-line bg-paper px-4 py-3 text-ink mt-1.5 focus:border-brand"
          />

          <p className="text-sm text-muted mt-4">Type</p>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => updateShop({ type: t })}
                className={`rounded-pill px-4 py-2 text-sm font-medium border ${
                  shop.type === t ? 'bg-brand text-white border-brand' : 'bg-paper text-ink border-line'
                }`}
              >
                {SHOP_TYPE_LABEL[t]}
              </button>
            ))}
          </div>
        </section>

        {/* Quiet after */}
        <section className="rounded-card bg-card border border-line p-5 mt-4">
          <p className="font-display text-xl text-ink">Quiet after</p>
          <p className="text-sm text-muted mt-1">
            How many days without a visit before a customer needs a nudge.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {QUIET_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => updateShop({ quiet_after_days: n })}
                className={`rounded-pill px-4 py-2 text-sm font-medium border ${
                  shop.quiet_after_days === n ? 'bg-brand text-white border-brand' : 'bg-paper text-ink border-line'
                }`}
              >
                {n} days
              </button>
            ))}
          </div>
        </section>

        {/* Plan */}
        <section className="rounded-card bg-card border border-line p-5 mt-4">
          <p className="font-display text-xl text-ink">Plan</p>
          <p className="text-sm text-muted mt-1">
            Free holds 20 customers and one shop. Pro (₦5,000/month) removes the limit and unlocks the AI
            rewrite, multiple shops, and a weekly reminder. You have {customers.length} customer
            {customers.length === 1 ? '' : 's'} saved.
          </p>
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => updateShop({ plan: 'free' })}
              className={`flex-1 rounded-pill py-3 font-medium ${
                shop.plan === 'free' ? 'bg-brand text-white' : 'border border-line text-ink'
              }`}
            >
              Free
            </button>
            <button
              onClick={() => updateShop({ plan: 'pro' })}
              className={`flex-1 rounded-pill py-3 font-medium ${
                shop.plan === 'pro' ? 'bg-brand text-white' : 'border border-line text-ink'
              }`}
            >
              Pro
            </button>
          </div>
          <p className="text-xs text-muted mt-2.5">
            This switch doesn't take a payment yet — it's here so you can preview what Pro unlocks.
          </p>
        </section>

        {/* Backup */}
        <section className="rounded-card bg-card border border-line p-5 mt-4">
          <p className="font-display text-xl text-ink">Backup</p>
          <p className="text-sm text-muted mt-1">
            Your data lives only on this device. Export a file to keep it safe or move phones.
          </p>
          <div className="flex gap-3 mt-3">
            <button
              onClick={exportMyList}
              className="flex-1 flex items-center justify-center gap-2 rounded-pill border border-line text-ink font-medium py-3"
            >
              ↓ Export
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 rounded-pill border border-line text-ink font-medium py-3"
            >
              ↑ Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImportFile(file)
                e.target.value = ''
              }}
            />
          </div>
          {importError && <p className="text-sm text-lost mt-2">{importError}</p>}
          {importOk && <p className="text-sm text-brand-dark mt-2">Import complete.</p>}
          <p className="text-xs text-muted mt-2.5">Importing replaces the customers currently on this device.</p>
        </section>
      </div>
      <TabBar />
    </div>
  )
}
