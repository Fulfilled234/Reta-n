import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Logo, Wordmark } from '../components/Logo'
import { useShop } from '../context/ShopContext'

const DEMO_CUSTOMERS = [
  { name: 'Sarah Adeyemi', days: 12, status: 'nudge' as const },
  { name: 'Chinedu Okafor', days: 9, status: 'nudge' as const },
  { name: 'Blessing Nnamdi', days: 5, status: 'sent' as const }
]

export default function Landing() {
  const { shop } = useShop()
  const navigate = useNavigate()
  const [openCustomer, setOpenCustomer] = useState<string | null>(null)

  return (
    <div className="min-h-full bg-paper">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Logo />
          <Wordmark />
        </div>
        <div className="flex items-center gap-5">
          <a href="#pricing" className="text-ink hidden sm:inline">Pricing</a>
          <button
            onClick={() => navigate(shop ? '/today' : '/shop-setup')}
            className="rounded-pill bg-forest text-white px-5 py-2.5 font-medium"
          >
            {shop ? 'Open my shop' : 'Get started'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 pt-10 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sm text-muted uppercase tracking-wide">For shops that live on WhatsApp</p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink mt-2 leading-[1.1]">
            Sarah visited. Then she didn't. You never noticed.
          </h1>
          <p className="text-lg text-muted mt-4 max-w-md">
            Retain keeps your customer list, watches who's gone quiet, and hands you a
            ready message. Your WhatsApp sends it — nothing routes through Retain.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <button
              onClick={() => navigate(shop ? '/today' : '/shop-setup')}
              className="rounded-pill bg-brand text-white font-medium px-6 py-3.5"
            >
              {shop ? 'Open my shop' : 'Set up my shop — it\u2019s free'}
            </button>
            <a
              href="#preview"
              className="rounded-pill border border-line text-ink font-medium px-6 py-3.5 text-center"
            >
              See it first
            </a>
          </div>
          <p className="text-sm text-muted mt-4">No card needed. Pro is ₦5,000/mo, only once you outgrow free.</p>
        </div>

        <PhonePreview
          openCustomer={openCustomer}
          setOpenCustomer={setOpenCustomer}
        />
      </section>

      {/* How it works */}
      <section id="how" className="bg-forest text-white py-16">
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="font-display text-3xl">How a nudge happens</h2>
          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            {[
              {
                step: '1',
                title: 'Log the visit',
                body: 'Add the customer once — name and WhatsApp number. Takes ten seconds at the till.'
              },
              {
                step: '2',
                title: 'See who went quiet',
                body: 'After a few days with no repeat visit, they land on your Today list automatically.'
              },
              {
                step: '3',
                title: 'Tap to send',
                body: 'Retain writes the message. You tap it, your own WhatsApp opens, you hit send.'
              }
            ].map((s) => (
              <div key={s.step} className="rounded-card bg-white/5 border border-white/10 p-5">
                <span className="font-display text-2xl text-brand">{s.step}</span>
                <h3 className="font-medium text-lg mt-2">{s.title}</h3>
                <p className="text-white/70 mt-1.5">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview / demo */}
      <section id="preview" className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="font-display text-3xl text-ink">Try it with real numbers</h2>
        <p className="text-muted mt-2 max-w-lg">
          This is a demo salon in Ikeja — tap a name to see the exact message Retain
          would hand the owner.
        </p>
        <div className="mt-8 max-w-sm">
          <PhonePreview openCustomer={openCustomer} setOpenCustomer={setOpenCustomer} />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="font-display text-3xl text-ink">Pricing</h2>
        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          <div className="rounded-card border border-line bg-card p-6">
            <p className="font-display text-2xl text-ink">Free</p>
            <p className="text-muted mt-1">Everything you need to try Retain for real.</p>
            <ul className="mt-4 space-y-2 text-ink">
              <li>• Up to 20 customers</li>
              <li>• Unlimited nudges</li>
              <li>• One shop</li>
            </ul>
          </div>
          <div className="rounded-card border-2 border-brand bg-card p-6 relative">
            <span className="absolute -top-3 right-6 bg-brand text-white text-sm px-3 py-1 rounded-pill">
              Once you outgrow free
            </span>
            <p className="font-display text-2xl text-ink">Pro — ₦5,000/mo</p>
            <p className="text-muted mt-1">For shops with a real customer list.</p>
            <ul className="mt-4 space-y-2 text-ink">
              <li>• Unlimited customers</li>
              <li>• AI message rewrite</li>
              <li>• Multiple shops</li>
              <li>• Weekly "who to nudge" reminder</li>
              <li>• Backup &amp; export</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="font-display text-3xl text-ink">Questions</h2>
        <div className="mt-6 divide-y divide-line border-t border-b border-line">
          {[
            {
              q: 'Does Retain message my customers?',
              a: 'No. Retain writes the message and opens WhatsApp with it ready. You send it from your own number, with one tap.'
            },
            {
              q: 'Is my customer list safe?',
              a: 'It\u2019s stored under your account only — nobody else can see or export it.'
            },
            {
              q: 'What happens if I stop paying for Pro?',
              a: 'You drop back to Free. Nothing is deleted; you just go back to the 20-customer limit.'
            }
          ].map((f) => (
            <details key={f.q} className="py-4 group">
              <summary className="flex items-center justify-between cursor-pointer text-ink font-medium">
                {f.q}
                <span className="text-muted group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-muted mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="max-w-5xl mx-auto px-5 py-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size={24} />
            <span className="text-sm text-muted">© {new Date().getFullYear()} Retain</span>
          </div>
          <div className="flex gap-5 text-sm text-muted">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <a href="mailto:hello@retain.ng">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function PhonePreview({
  openCustomer,
  setOpenCustomer
}: {
  openCustomer: string | null
  setOpenCustomer: (name: string | null) => void
}) {
  const active = DEMO_CUSTOMERS.find((c) => c.name === openCustomer)
  return (
    <div className="relative rounded-[32px] border-8 border-forest bg-paper shadow-xl overflow-hidden max-w-sm mx-auto">
      <div className="px-5 pt-6 pb-5">
        <p className="text-xs text-muted uppercase tracking-wide">Demo salon · Ikeja</p>
        <h3 className="font-display text-xl text-ink">Glow by Teni</h3>
        <div className="rounded-card bg-quiet text-white p-4 mt-4">
          <p className="text-xs uppercase tracking-wide opacity-80">Quiet for 7 days</p>
          <p className="font-display text-3xl mt-0.5">2</p>
          <p className="text-sm opacity-90 mt-1">2 customers went quiet. Tap one to see the message.</p>
        </div>
        <p className="text-sm text-muted mt-5 mb-2">Needs a nudge</p>
        <div className="space-y-2">
          {DEMO_CUSTOMERS.map((c) => (
            <button
              key={c.name}
              onClick={() => setOpenCustomer(c.name)}
              className="w-full flex items-center gap-3 rounded-card bg-card border border-line px-3.5 py-2.5 text-left"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-display ${
                  c.status === 'sent' ? 'bg-brand-light text-brand-dark' : 'bg-quiet-light text-quiet'
                }`}
              >
                {c.name.split(' ').map((p) => p[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-ink text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted">
                  {c.status === 'sent' ? 'Nudge sent' : `${c.days} days quiet`}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="absolute inset-0 bg-ink/40 flex items-end"
          onClick={() => setOpenCustomer(null)}
        >
          <div
            className="w-full bg-paper rounded-t-[24px] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-8 h-1.5 bg-line rounded-pill mx-auto mb-3" />
            <p className="font-display text-lg text-ink">{active.name}</p>
            <p className="text-sm text-muted mt-2">Message you'd send</p>
            <div className="rounded-card bg-card border border-line px-3.5 py-3 text-sm text-ink mt-1.5">
              Hi {active.name.split(' ')[0]}, it's Glow by Teni. It's been a while since your
              last visit — we have a slot this week if you'd like to come in.
            </div>
            <div className="rounded-pill bg-wa text-white text-center font-medium py-3 mt-3">
              Send on WhatsApp
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
