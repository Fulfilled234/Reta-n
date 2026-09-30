import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  loadShop,
  saveShop,
  loadCustomers,
  saveCustomers,
  exportBackup,
  importBackup,
  uuid
} from '../lib/storage'
import type { Customer, Shop, ShopType } from '../types'

const QUIET_AFTER_DAYS_DEFAULT = 7
const FREE_PLAN_LIMIT = 20

interface ShopContextValue {
  shop: Shop | null
  customers: Customer[]
  loading: boolean
  createShop: (name: string, type: ShopType, area: string) => void
  updateShop: (fields: Partial<Pick<Shop, 'name' | 'area' | 'type' | 'quiet_after_days' | 'plan'>>) => void
  addCustomer: (name: string, phone: string, spend?: number) => { error: string | null }
  updateCustomer: (customerId: string, fields: Partial<Pick<Customer, 'name' | 'phone'>>) => void
  deleteCustomer: (customerId: string) => void
  addVisit: (customerId: string, amount?: number) => void
  markNudged: (customerId: string) => void
  markCameBack: (customerId: string) => void
  exportMyList: () => void
  importMyList: (file: File) => Promise<{ error: string | null }>
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

  function updateShop(fields: Partial<Pick<Shop, 'name' | 'area' | 'type' | 'quiet_after_days' | 'plan'>>) {
    if (!shop) return
    const next = { ...shop, ...fields }
    saveShop(next)
    setShop(next)
  }

  function addCustomer(name: string, phone: string, spend?: number) {
    if (shop?.plan === 'free' && customers.length >= FREE_PLAN_LIMIT) {
      return { error: `Free plan is limited to ${FREE_PLAN_LIMIT} customers. Upgrade to Pro to add more.` }
    }
    const now = new Date().toISOString()
    const newCustomer: Customer = {
      id: uuid(),
      shop_id: shop?.id ?? '',
      name,
      phone,
      last_visit: now,
      last_spend: spend ?? null,
      status: 'active',
      nudged_at: null,
      created_at: now,
      visits: [{ id: uuid(), date: now, amount: spend ?? null }],
      nudges_tapped: 0,
      times_came_back: 0
    }
    const next = [newCustomer, ...customers]
    saveCustomers(next)
    setCustomers(next)
    return { error: null }
  }

  function updateCustomer(customerId: string, fields: Partial<Pick<Customer, 'name' | 'phone'>>) {
    const next = customers.map((c) => (c.id === customerId ? { ...c, ...fields } : c))
    saveCustomers(next)
    setCustomers(next)
  }

  function deleteCustomer(customerId: string) {
    const next = customers.filter((c) => c.id !== customerId)
    saveCustomers(next)
    setCustomers(next)
  }

  function addVisit(customerId: string, amount?: number) {
    const now = new Date().toISOString()
    const next = customers.map((c) =>
      c.id === customerId
        ? {
            ...c,
            last_visit: now,
            last_spend: amount ?? c.last_spend,
            status: 'active' as const,
            nudged_at: null,
            visits: [{ id: uuid(), date: now, amount: amount ?? null }, ...c.visits]
          }
        : c
    )
    saveCustomers(next)
    setCustomers(next)
  }

  function markNudged(customerId: string) {
    const next = customers.map((c) =>
      c.id === customerId
        ? {
            ...c,
            status: 'nudged' as const,
            nudged_at: new Date().toISOString(),
            nudges_tapped: c.nudges_tapped + 1
          }
        : c
    )
    saveCustomers(next)
    setCustomers(next)
  }

  function markCameBack(customerId: string) {
    const now = new Date().toISOString()
    const next = customers.map((c) =>
      c.id === customerId
        ? {
            ...c,
            status: 'active' as const,
            last_visit: now,
            nudged_at: null,
            times_came_back: c.times_came_back + 1,
            visits: [{ id: uuid(), date: now, amount: null }, ...c.visits]
          }
        : c
    )
    saveCustomers(next)
    setCustomers(next)
  }

  function exportMyList() {
    if (!shop) return
    exportBackup(shop, customers)
  }

  async function importMyList(file: File) {
    try {
      const { shop: importedShop, customers: importedCustomers } = await importBackup(file)
      saveShop(importedShop)
      saveCustomers(importedCustomers)
      setShop(importedShop)
      setCustomers(importedCustomers)
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Import failed.' }
    }
  }

  return (
    <ShopContext.Provider
      value={{
        shop,
        customers,
        loading,
        createShop,
        updateShop,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addVisit,
        markNudged,
        markCameBack,
        exportMyList,
        importMyList
      }}
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
