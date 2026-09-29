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
  return raw ? (JSON.parse(raw) as Customer[]) : []
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

function uuid(): string {
  return crypto.randomUUID()
}

export { uuid }
