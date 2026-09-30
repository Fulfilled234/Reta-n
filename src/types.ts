export type ShopType = 'salon' | 'pharmacy' | 'food' | 'retail' | 'other'

export interface Shop {
  id: string
  name: string
  type: ShopType
  area: string | null
  plan: 'free' | 'pro'
  quiet_after_days: number
  created_at: string
}

export interface Visit {
  id: string
  date: string
  amount: number | null
}

export interface Customer {
  id: string
  shop_id: string
  name: string
  phone: string
  last_visit: string
  last_spend: number | null
  status: 'active' | 'nudged' | 'lost'
  nudged_at: string | null
  created_at: string
  visits: Visit[]
  nudges_tapped: number
  times_came_back: number
}

export const SHOP_TYPE_LABEL: Record<ShopType, string> = {
  salon: 'Salon / beauty',
  pharmacy: 'Pharmacy / clinic',
  food: 'Restaurant / food',
  retail: 'Shop / retail',
  other: 'Other'
}
