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
}

export const SHOP_TYPE_LABEL: Record<ShopType, string> = {
  salon: 'Salon / beauty',
  pharmacy: 'Pharmacy / clinic',
  food: 'Restaurant / food',
  retail: 'Shop / retail',
  other: 'Other'
}
