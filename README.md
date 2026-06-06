# ✦ WriteAI — AI Writing Assistant

A production-ready AI writing assistant built with Next.js + Claude API.
**$1/month subscription model** — designed to scale globally.

---

## 🚀 Quick Start (Local)

npm install

Get your Anthropic API key: https://console.anthropic.com

---

## ☁️ Deploy to Vercel (Recommended — FREE)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-writer.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com → Sign up (free)
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` → your key from console.anthropic.com
5. Click **Deploy** → Done! 🎉

Your app is live at: `https://your-app.vercel.app`

### Step 3: Add Custom Domain (optional, ~$10/year)
- Buy domain on Namecheap / GoDaddy (e.g., writeai.app)
- In Vercel: Settings → Domains → Add your domain
- Point DNS to Vercel nameservers

---

## 🌐 Deploy to Netlify (Alternative)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the app
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

Or drag-and-drop the `.next` folder at https://app.netlify.com/drop

Add environment variables in: Netlify Dashboard → Site Settings → Environment Variables

---

## 💰 Monetization: The $1/Month Path to $1M+

### Phase 1 — Launch (Month 1-3)
**Goal: 100 paying users = $100/month**

1. **Set up Stripe** (payments)
   - Sign up at https://stripe.com
   - Create a $1/month subscription product
   - Get your API keys
   - Install: `npm install stripe @stripe/stripe-js`

2. **Add payment API** (pages/api/create-checkout.js):
```js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price: 'price_YOUR_PRICE_ID', // from Stripe dashboard
      quantity: 1,
    }],
    success_url: `${req.headers.origin}/?success=true`,
    cancel_url: `${req.headers.origin}/?canceled=true`,
  });
  res.json({ url: session.url });
}
```

3. **Marketing on Day 1:**
   - Post on Product Hunt
   - Post on Reddit: r/SideProject, r/entrepreneur, r/ChatGPT
   - Share on LinkedIn, Twitter/X
   - List on: Indie Hackers, BetaList, HackerNews (Show HN)

### Phase 2 — Growth (Month 3-12)
**Goal: 1,000 users = $1,000/month**

- **SEO**: Target keywords like "AI writing assistant free", "rewrite text AI"
- **YouTube**: 1 demo video → drives organic traffic forever
- **Affiliate program**: Give users 30% commission for referrals
- **Integrations**: Chrome extension, Notion plugin, Google Docs add-on
- **Multiple tiers**:
  - Free: 5 uses/month
  - Basic: $1/month → 100 uses
  - Pro: $9/month → unlimited + API access
  - Team: $29/month → 5 seats

### Phase 3 — Scale (Year 2+)
**Goal: 100,000 users = $100,000/month**

- **API access** for developers ($0.01 per call)
- **White-label** the product for other businesses ($99/month)
- **Enterprise** contracts ($500-5000/month)
- **Language localization** → Tamil, Hindi, Spanish, Arabic markets
- **Vertical niches**: WriteAI for Lawyers, WriteAI for Doctors, WriteAI for Teachers

---

## 📊 Revenue Math

| Users | MRR | ARR |
|-------|-----|-----|
| 100 | $100 | $1,200 |
| 1,000 | $1,000 | $12,000 |
| 10,000 | $10,000 | $120,000 |
| 100,000 | $100,000 | $1,200,000 |
| 1,000,000 | $1,000,000 | $12,000,000 |

**The billion-dollar path**: At scale, expand to B2B (SaaS for teams), acquire competitors,
raise funding, or sell the business (typically 5-10x ARR in acquisitions).

---

## 🔑 Key Files

```
ai-writer/
├── pages/
│   ├── index.js          ← Main UI
│   └── api/
│       └── write.js      ← AI API route
├── styles/
│   └── globals.css       ← Design tokens
├── .env.example          ← Environment variables template
├── package.json
└── README.md             ← You are here
```

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18
- **AI**: Anthropic Claude API (claude-opus-4-5)
- **Payments**: Stripe (add yourself)
- **Hosting**: Vercel (free tier works!)
- **Domain**: Namecheap / Cloudflare (~$10/year)

---

## 📬 Support

Built with ❤️ using Claude AI by Anthropic.
Questions? Open an issue on GitHub.
cd ~/Downloads/ai-writer
npm install
npm run dev
