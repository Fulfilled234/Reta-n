/**
 * Normalises a Nigerian phone number typed in local format (e.g. "0803 123 4567")
 * into the international digits-only format wa.me needs ("2348031234567").
 * Returns null if the number doesn't look like a valid Nigerian mobile number.
 */
export function normalizeNgPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('234') && digits.length === 13) return digits
  if (digits.startsWith('0') && digits.length === 11) return '234' + digits.slice(1)
  if (digits.length === 10) return '234' + digits
  return null
}

export function formatNgPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  const local = digits.startsWith('234') ? '0' + digits.slice(3) : digits
  if (local.length !== 11) return raw
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`
}

export function buildWaLink(phone: string, message: string): string | null {
  const normalized = normalizeNgPhone(phone)
  if (!normalized) return null
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}

export function daysSince(dateIso: string): number {
  const then = new Date(dateIso).getTime()
  const now = Date.now()
  return Math.floor((now - then) / (1000 * 60 * 60 * 24))
}

export function defaultNudgeMessage(shopName: string, customerName: string): string {
  const firstName = customerName.trim().split(' ')[0]
  return `Hi ${firstName}, it's ${shopName}. It's been a while since your last visit — we have a slot this week if you'd like to come in. Just reply here.`
}
