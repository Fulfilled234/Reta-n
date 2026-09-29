import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { loadShop, saveShop, loadCustomers, saveCustomers, exportBackup, uuid } from '../lib/storage'
import type { Customer, Shop, ShopType } from '../types'

const QUIET_AFTER_DAYS_DEFAULT = 7
const FREE_PLAN_LIMIT = 20

interface ShopContextValue {
  shop: Shop | null
  customers: Customer[]
  loading: boolean
  createShop: (name: string, type: ShopType, area: string) => void
  addCustomer: (name: string, phone: string, spend?: number) => { error: string | null }
  markNudged: (customerId: string) => void
  markCameBack: (customerId: string) => void
  exportMyList: () => void
}

const ShopContext = createContext<ShopContextValue | null>(null)

export function ShopProvider({ children }: { children: ReactNode }) {
  const [shop, setShop] = useState<Shop | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setShop(loadShop())
    setCustomers(loadCustomers())
    setLoading(false)
  }, [])

  function createShop(name: string, type: ShopType, area: string) {
    const newShop: Shop = {
      id: uuid(),
      name,
      type,
      area: area || null,
      plan: 'free',
      quiet_after_days: QUIET_AFTER_DAYS_DEFAULT,
      created_at: new Date().toISOString()
    }
    saveShop(newShop)
    setShop(newShop)
  }

  function addCustomer(name: string, phone: string, spend?: number) {
    if (shop?.plan === 'free' && customers.length >= FREE_PLAN_LIMIT) {
      return { error: `Free plan is limited to ${FREE_PLAN_LIMIT} customers. Upgrade to Pro to add more.` }
    }
    const newCustomer: Customer = {
      id: uuid(),
      shop_id: shop?.id ?? '',
      name,
      phone,
      last_visit: new Date().toISOString(),
      last_spend: spend ?? null,
      status: 'active',
      nudged_at: null,
      created_at: new Date().toISOString()
    }
    const next = [newCustomer, ...customers]
    saveCustomers(next)
    setCustomers(next)
    return { error: null }
  }

  function markNudged(customerId: string) {
    const next = customers.map((c) =>
      c.id === customerId ? { ...c, status: 'nudged' as const, nudged_at: new Date().toISOString() } : c
    )
    saveCustomers(next)
    setCustomers(next)
  }

  function markCameBack(customerId: string) {
    const next = customers.map((c) =>
      c.id === customerId
        ? { ...c, status: 'active' as const, last_visit: new Date().toISOString(), nudged_at: null }
        : c
    )
    saveCustomers(next)
    setCustomers(next)
  }

  function exportMyList() {
    if (!shop) return
    exportBackup(shop, customers)
  }

  return (
    <ShopContext.Provider
      value={{ shop, customers, loading, createShop, addCustomer, markNudged, markCameBack, exportMyList }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used inside ShopProvider')
  return ctx
}
