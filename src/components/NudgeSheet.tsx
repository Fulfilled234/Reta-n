import { useState } from 'react'
import { buildWaLink, defaultNudgeMessage, formatNgPhoneDisplay } from '../lib/whatsapp'
import type { Customer, Shop } from '../types'

export function NudgeSheet({
  customer,
  shop,
  onClose,
  onNudged,
  onCameBack
}: {
  customer: Customer
  shop: Shop
  onClose: () => void
  onNudged: () => void
  onCameBack: () => void
}) {
  const [message, setMessage] = useState(defaultNudgeMessage(shop.name, customer.name))
  const [copied, setCopied] = useState(false)
  const waLink = buildWaLink(customer.phone, message)

  function handleSend() {
    if (!waLink) return
    window.open(waLink, '_blank', 'noopener,noreferrer')
    onNudged()
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40" onClick={onClose}>
      <div
        className="w-full max-w-md bg-paper rounded-t-[28px] px-5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-line rounded-pill mx-auto mb-4" />
        <p className="text-sm text-muted uppercase tracking-wide">Send a nudge</p>
        <h2 className="font-display text-2xl text-ink mt-1">{customer.name}</h2>
        <p className="text-muted mt-0.5">{formatNgPhoneDisplay(customer.phone)}</p>

        <p className="text-sm text-muted mt-5 mb-1.5">Message you'll send</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full rounded-card border border-line bg-card px-4 py-3 text-ink resize-none focus:border-brand"
        />

        {waLink ? (
          <button
            onClick={handleSend}
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-pill bg-wa text-white font-medium py-3.5"
          >
            Send on WhatsApp
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H8M17 7v9" />
            </svg>
          </button>
        ) : (
          <p className="mt-4 text-sm text-lost bg-lost-light rounded-card px-4 py-3">
            That number doesn't look like a valid Nigerian mobile number — check it in the customer's details.
          </p>
        )}

        <div className="flex gap-3 mt-3">
          <button
            onClick={() => setMessage(defaultNudgeMessage(shop.name, customer.name))}
            className="flex-1 rounded-pill border border-line py-3 text-ink font-medium"
          >
            Reset text
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 rounded-pill border border-line py-3 text-ink font-medium"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <p className="text-xs text-muted mt-3 text-center">
          Opens your WhatsApp with the text ready. Retain never sends anything for you.
        </p>

        <div className="flex gap-3 mt-5 pt-4 border-t border-line">
          <button onClick={onCameBack} className="flex-1 text-brand-dark font-medium py-2">
            ✓ They came back
          </button>
          <button onClick={onClose} className="flex-1 text-muted font-medium py-2">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
