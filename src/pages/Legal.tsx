import { useNavigate } from 'react-router-dom'

export function Privacy() {
  return (
    <LegalPage title="Privacy">
      <p>Retain stores your shop name, and each customer's name, phone number, and visit history, under your account only.</p>
      <p>Retain never sends messages to your customers. When you tap "Send on WhatsApp," your own WhatsApp opens with a message already typed in — you choose whether to send it.</p>
      <p>Your data isn't shared with, or visible to, other Retain shops.</p>
    </LegalPage>
  )
}

export function Terms() {
  return (
    <LegalPage title="Terms">
      <p>Retain is a tool for logging customer visits and drafting WhatsApp messages. You're responsible for the content you send and for having a legitimate reason to contact each customer.</p>
      <p>Free accounts are limited to 20 customers. Pro is billed monthly at ₦5,000 through Paystack and can be cancelled anytime.</p>
    </LegalPage>
  )
}

function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  const navigate = useNavigate()
  return (
    <div className="min-h-full bg-paper px-5 py-8 max-w-2xl mx-auto">
      <button onClick={() => navigate('/')} className="text-muted mb-6">← Back</button>
      <h1 className="font-display text-3xl text-ink mb-4">{title}</h1>
      <div className="space-y-3 text-ink">{children}</div>
    </div>
  )
}
