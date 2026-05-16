# Retain — AI Customer Win-Back System

> **Retain automatically detects when a customer goes silent and sends them a personalized WhatsApp message to bring them back.**

Built for Nigerian SMEs. No app to download. No complicated setup. Just WhatsApp.

---

## 🚀 Live Demo

🌐 Landing Page: [reta-n.vercel.app](https://reta-n.vercel.app)  
📊 Dashboard: [reta-n.vercel.app/dashboard](https://reta-n.vercel.app/dashboard)

---

## 💡 The Problem

Nigerian small businesses — salons, pharmacies, restaurants, shops — lose customers silently. A customer visits once, twice, then disappears. The business owner has no system to notice, no way to follow up, and no time to chase everyone manually.

**Retain solves this with zero friction.**

---

## ✅ How It Works

1. **Log visits via WhatsApp** — Business owner sends `"Sarah visited"` to Retain on WhatsApp. That's it.
2. **AI monitors silence** — Retain tracks every customer's last visit date automatically.
3. **Win-back fires automatically** — When a customer goes silent beyond the threshold, Retain generates a personalized WhatsApp message using Gemini AI and sends it.

No app. No dashboard required. Just WhatsApp.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Hosting | Vercel (Serverless) |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini 1.5 Flash |
| Messaging | Meta WhatsApp Cloud API |
| Payments | Paystack |
| Frontend | Vanilla HTML/CSS/JS |

---

## 📁 Project Structure

```
├── index.js          # WhatsApp webhook + bot logic
├── winback.js        # Daily win-back cron job
├── index.html        # Landing page
├── dashboard.html    # CRM dashboard
├── vercel.json       # Vercel config + cron schedule
└── .env              # Environment variables (not committed)
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
META_PHONE_NUMBER_ID=your_meta_phone_number_id
META_ACCESS_TOKEN=your_meta_access_token
WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
```

---

## 🗄️ Database Schema (Supabase)

```sql
-- Businesses registered via WhatsApp
businesses (id, name, whatsapp_number, category, inactivity_threshold_days, is_active)

-- Customers tracked per business
customers (id, name, phone_number, business_id, last_purchase_at, status)

-- Win-back messages sent
messages (id, business_id, customer_id, content, sent_at, customer_returned)

-- Onboarding session state
sessions (id, phone_number, step, data)
```

---

## 🔄 Cron Job

The win-back job runs daily at **9:00 AM** via Vercel Cron:

```json
{
  "crons": [{ "path": "/winback", "schedule": "0 9 * * *" }]
}
```

It scans all customers whose `last_purchase_at` exceeds their business's `inactivity_threshold_days`, generates a personalized message with Gemini AI, and sends it via WhatsApp.

---

## 💳 Pricing

| Plan | Price | Features |
|---|---|---|
| Free | ₦0 | 1 business, up to 20 customers |
| Pro | ₦5,000/mo | Unlimited businesses & customers, priority support |

Payments processed via **Paystack** (test mode).

---

## 🚀 Deploy Your Own

1. Clone the repo
   ```bash
   git clone https://github.com/Fulfilled234/Reta-n.git
   cd Reta-n
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables on Vercel

4. Connect your Meta WhatsApp Cloud API webhook to:
   ```
   https://your-vercel-url.vercel.app/webhook
   ```

5. Push to GitHub — Vercel auto-deploys

---

## 📱 WhatsApp Commands

| Command | Action |
|---|---|
| `[Name] visited` | Log a customer visit |
| `Summary` | See today's visit count |
| `Help` | Show all commands |

---

## 🏆 Built For

**Startup Abuja Innovation Challenge '26** — May 2026  
Category: AI / SME Tools / Africa-first Products

---

## 👨‍💻 Author

**Olajide Michael Ayomide**  
Full-Stack Developer · Nigeria  
[GitHub](https://github.com/Fulfilled234)

---

## 📄 License

MIT License — free to use, modify, and distribute.
