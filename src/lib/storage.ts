// Everything Retain stores lives on this device only, in the browser's
// localStorage — nothing is sent to a server. That's a deliberate trade for
// a one-person shop: no login to lose people at the door, and no account to
// ever be breached. The cost is that clearing browser data, or moving to a
// new phone, loses the list unless it's exported first (see exportBackup
// below and the "Export my list" button on Today).

import type { Customer, Shop } from '../types'

const SHOP_KEY = 'retain:shop'
const CUSTOMERS_KEY = 'retain:customers'

export function loadShop(): Shop | null {
  const raw = localStorage.getItem(SHOP_KEY)
  return raw ? (JSON.parse(raw) as Shop) : null
}

export function saveShop(shop: Shop) {
  localStorage.setItem(SHOP_KEY, JSON.stringify(shop))
}

export function loadCustomers(): Customer[] {
  const raw = localStorage.getItem(CUSTOMERS_KEY)
  if (!raw) return []
  const parsed = JSON.parse(raw) as Customer[]
  // Migrate records saved before visit history / nudge counters existed.
  return parsed.map((c) => ({
    ...c,
    visits: c.visits ?? (c.last_visit ? [{ id: crypto.randomUUID(), date: c.last_visit, amount: c.last_spend ?? null }] : []),
    nudges_tapped: c.nudges_tapped ?? (c.nudged_at ? 1 : 0),
    times_came_back: c.times_came_back ?? 0
  }))
}

export function saveCustomers(customers: Customer[]) {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers))
}

export function exportBackup(shop: Shop, customers: Customer[]) {
  const payload = { shop, customers, exported_at: new Date().toISOString() }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `retain-backup-${shop.name.replace(/\s+/g, '-').toLowerCase()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importBackup(file: File): Promise<{ shop: Shop; customers: Customer[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        if (!parsed.shop || !Array.isArray(parsed.customers)) {
          reject(new Error('That file doesn\u2019t look like a Retain backup.'))
          return
        }
        resolve({ shop: parsed.shop, customers: parsed.customers })
      } catch {
        reject(new Error('Couldn\u2019t read that file — is it a Retain backup JSON?'))
      }
    }
    reader.onerror = () => reject(new Error('Couldn\u2019t read that file.'))
    reader.readAsText(file)
  })
}

function uuid(): string {
  return crypto.randomUUID()
}

export { uuid }
