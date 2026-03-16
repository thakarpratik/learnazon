# 🌟 KidLearn — AI-Powered Learning for Kids Ages 5–10

> Built with Next.js 14, Claude AI, Prisma/Supabase, and NextAuth. 100% AI-generated per the build plan.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <your-repo>
cd kidlearn
npm install          # also runs `prisma generate` via postinstall
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
# Fill in all values — see .env.example for instructions
```

### 3. Set Up Database (Supabase)
1. Create a project at [supabase.com](https://supabase.com)
2. Copy the connection strings into `.env.local`
3. Push the schema:
```bash
npm run db:push
```

### 4. Run Locally
```bash
npm run dev
# → http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── signup/               # Parent signup
│   ├── login/                # Parent + child login
│   ├── dashboard/            # Child dashboard (Phase 2)
│   ├── parent/               # Parent dashboard (Phase 3)
│   ├── learn/[module]/       # Learning hubs (Phase 2)
│   ├── game/[id]/            # Live game (Phase 2)
│   └── api/
│       ├── ai/               # Claude AI endpoint
│       ├── auth/             # NextAuth + signup
│       └── progress/         # Save activity results
├── components/
│   ├── landing/              # All landing page sections
│   ├── layout/               # Header, footer
│   └── auth/                 # Login, signup forms
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── prisma.ts             # Prisma singleton
│   └── bcrypt.ts             # Password helpers
prisma/
└── schema.prisma             # Full DB schema
```

---

## 🛣️ Build Phases

| Phase | Weeks | Status |
|-------|-------|--------|
| **Phase 1** — Foundation (landing, auth, DB, APIs) | 1–2 | ✅ Complete |
| **Phase 2** — Learning modules (math, time, speaking) | 3–5 | 🔜 Next |
| **Phase 3** — Gamification + AI layer | 6–7 | 🔜 Upcoming |
| **Phase 4** — More modules + Stripe monetization | 8–10 | 🔜 Upcoming |

---

## 🚢 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard or via CLI:
vercel env add NEXTAUTH_SECRET
vercel env add DATABASE_URL
# ... (see vercel.json for full list)
```

The `vercel.json` build command runs `prisma generate` automatically before `next build`.

---

## 🔒 Security Features
- ✅ Security headers (X-Frame-Options, CSP, HSTS, etc.)
- ✅ COPPA compliant — no data collection from children
- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ Child PINs hashed with bcrypt
- ✅ Input validation with Zod on all API routes
- ✅ Session-based auth with NextAuth JWT
- ✅ API routes verify ownership before data access
- ✅ `robots.txt` blocks all auth/dashboard routes from indexing

## ⚡ Performance Features
- ✅ Next.js 14 App Router with React Server Components
- ✅ Static generation for all public pages
- ✅ Dynamic API routes (server-rendered on demand)
- ✅ Image optimization (AVIF/WebP via next/image)
- ✅ Font preconnect hints
- ✅ Console.log removed in production builds
- ✅ Package import optimization for framer-motion

## 🔍 SEO Features
- ✅ Full Open Graph + Twitter card metadata
- ✅ Sitemap.xml (auto-generated)
- ✅ Robots.txt
- ✅ Canonical URLs
- ✅ Structured heading hierarchy (h1 → h2 → h3)
- ✅ Semantic HTML (article, section, nav, main, header, footer)
- ✅ ARIA labels throughout
- ✅ PWA manifest

---

## 🤖 AI Tutor API

```
POST /api/ai
Content-Type: application/json
Authorization: (session cookie)

{
  "childAge": 7,
  "module": "MATH",
  "context": "Child is working on addition within 20",
  "question": "I don't understand why 8 + 7 = 15"
}
```

Returns age-appropriate encouragement and hints — never the answer directly.

---

*Built with ❤️ and Claude AI · KidLearn Build Plan v1*
