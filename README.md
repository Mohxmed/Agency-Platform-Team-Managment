# No2ta — نقطة

A modern, Arabic-first digital marketing platform that helps brands, educators, and content creators build a stronger online presence. No2ta combines a high-performance public website with a full internal CMS dashboard in a single Next.js application.

> نقطة ومن أول السطر — شغلك محتاج إبداع.

---

## 📌 Overview

No2ta is a single Next.js codebase containing two connected parts:

| Part | Description |
| --- | --- |
| **Public Website** (`/`) | Arabic-first, RTL landing site for the agency: hero, clients, works/portfolio, services, pricing, contact and social sections. |
| **CMS Dashboard** (`/dashboard`) | Internal tool to manage projects, services, pricing, categories, clients/teachers, team tasks and site-wide settings — all editable live from Firestore. |

All public content (works, clients, services, pricing, settings, SEO) is stored in Firebase and rendered from it, so the admin can update the live website without redeploying.

---

## ✨ Features

### Public Website

- Arabic-first RTL design with a full dark-mode theme
- Landing page with hero, clients marquee, works showcase, services, pricing, contact & social sections
- Dynamic `/portfolio/[projectId]` project pages with gallery, stats and case-study detail
- Dynamic `/clients/[link]` profile pages for teachers and creators
- Contact form wired to email (Nodemailer + SMTP) via `/api/contact`
- WhatsApp / social / map integration driven by dashboard settings
- Maintenance-mode page (`/preview`)

### CMS Dashboard

- **Projects** — create and manage works (cover, gallery, stats, category)
- **Services** — manage service cards and their request links
- **Pricing** — build pricing plans with feature lists and a "popular" flag
- **Categories** — organize portfolio works
- **Teachers / Clients** — public creator profiles with social links
- **Team** — projects, tasks, members, progress tracking and per-member task views
- **Settings** — general, contact, social, stats, sections visibility, content, SEO, notifications, auth and system (maintenance mode) panels
- **Users** — admin user management with role-based access

### Platform-wide

- **SEO-first**: dynamic `sitemap.xml`, `robots.txt`, per-project/per-client `generateMetadata`, canonical URLs, Open Graph & Twitter cards
- **Performance**: compositor-only CSS animations (`transform`/`opacity` keyframes) instead of JS-driven infinite loops, plus lazy-loaded landing sections
- **Accessibility**: `prefers-reduced-motion` disables all decorative loops automatically
- **PWA-ready**: manifest + app icons

---

## 🛠 Tech Stack

### Frontend

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS 4**
- **Framer Motion 12** (entrance & hover animations)
- **Swiper** (carousels), **Recharts** (dashboard analytics), **Lucide + react-icons**

### Backend & Services

- **Firebase**
  - Authentication (email/password, role-based)
  - Firestore (database)
  - Storage (media)
  - `firebase-admin` (server-side: sessions, admin APIs, sitemap & metadata)
- **Cloudinary** (`next-cloudinary`) — image uploads & optimization
- **Nodemailer** — contact form email delivery

---

## 📁 Project Structure

```
src
├── app                      # Next.js App Router (routes, layouts, API)
│   ├── (landing)/           # Public pages: services, pricing, portfolio,
│   │   │                    #   portfolio/[projectId], clients, clients/[link],
│   │   │                    #   contact, reports, terms-of-use, privacy-policy, copyrights
│   ├── (dashboard)/dashboard# CMS: portfolio, services, pricing, categories,
│   │   │                    #   teachers, team/*, settings/*, user
│   ├── auth/                # login, signup, forgot-password
│   ├── api/                 # /api/contact, /api/auth/session, /api/admin/users...
│   ├── preview/             # maintenance-mode page
│   ├── layout.js            # root layout + central metadata
│   ├── page.js              # home (/) metadata
│   ├── sitemap.js           # dynamic sitemap.xml
│   ├── robots.js            # robots.txt
│   ├── manifest.js          # PWA manifest
│   └── not-found.js         # 404 page
│
├── features                 # Feature modules
│   ├── landing/             # sections, hooks, pages (hero, works, services...)
│   ├── dashboard/           # dashboard components (tables, uploads, charts)
│   ├── auth/                # auth layout, user menu, ProtectedRoute
│   ├── team/                # team workflows
│   └── seo/                 # SeoInjector (client-side admin SEO overrides)
│
├── shared/                  # Reusable UI: cards, buttons, badges, skeletons,
│   │                        #   motions, icons, forms
├── contexts/                # SettingsContext (live site settings)
├── providers/               # App providers
├── lib/                     # firebase, firebaseAdmin, firestoreService,
│   │                        #   settingsCache, serverContent, cloudinary...
├── config/                  # site.js (siteConfig + buildMetadata)
├── hooks/ · utils/ · constants/
├── assets/                  # identity, icons
├── styles/                  # globals + animations.css (pf-* keyframes)
└── scripts/                 # seedFirestore.js
```

---

## 🧭 Routing Map

| Route | Type | Description |
| --- | --- | --- |
| `/` | Static | Home / landing |
| `/services` · `/pricing` | Static | Services & pricing pages |
| `/portfolio` · `/portfolio/[projectId]` | Static + Dynamic | Works grid & detail (title/SEO from Firestore) |
| `/clients` · `/clients/[link]` | Static + Dynamic | Client profiles (title/SEO from Firestore) |
| `/contact` · `/reports` · `/terms-of-use` · `/privacy-policy` · `/copyrights` | Static | Legal & contact pages |
| `/auth/*` | Static | `noindex` login/signup/password-reset |
| `/dashboard/**` | Static | `noindex` CMS (behind `ProtectedRoute`) |
| `/api/*` | Dynamic | Contact, auth session, admin user APIs |
| `/sitemap.xml` · `/robots.txt` | Dynamic | SEO files |

---

## 🔥 Firestore Data Model

```
settings/site         → site-wide settings, content sections & SEO overrides
works                 → portfolio projects (link, cover, gallery, stats, categoryId)
categories            → portfolio categories
clients               → teacher/creator profiles (link, name, bio, socials)
services              → service cards (icon, description, request link)
pricing               → pricing plans (features, popular, sortOrder)
users                 → platform users & roles
projects / tasks      → team workflows
notifications         → dashboard notifications
```

A seed script (`src/scripts/seedFirestore.js`) creates 20 categories, 20 clients and 20 projects with proper `categoryId` relations.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 24.x** (see `engines` in `package.json`)
- A **Firebase** project (Auth, Firestore, Storage)
- (Optional) Cloudinary & SMTP credentials

### 1. Clone & install

```bash
git clone https://github.com/Mohxmed/Agency-Platform-Team-Managment.git
cd Agency-Platform-Team-Managment
npm install
```

### 2. Environment variables

Create a `.env.local` file at the project root (see the table below).

### 3. Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## ⚙️ Environment Variables

### Firebase (client)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### Firebase Admin (server-side — optional locally, required for sitemap/admin APIs)

Provide a service-account JSON — either base64-encoded:

```env
FIREBASE_SERVICE_ACCOUNT=<base64 of serviceAccount.json>
```

or as raw fields:

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### Cloudinary (image uploads)

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

### SMTP (contact form → email)

```env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
CONTACT_EMAIL=
```

### Site URL (canonical URLs & sitemap)

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

> If unset, the app auto-detects the production URL from Vercel (`VERCEL_PROJECT_PRODUCTION_URL`) and falls back to `http://localhost:3000` locally. Set it to your real domain before launch so Google indexes the correct canonical URLs.

---

## 🧪 Scripts

```bash
npm run dev       # start dev server
npm run build     # production build
npm run start     # start production server
npm run lint      # ESLint
node src/scripts/seedFirestore.js   # seed Firestore with demo data
```

---

## 📦 Deployment

The project deploys out-of-the-box on **Vercel** (or any Next.js-compatible host):

1. Import the GitHub repository into Vercel.
2. Add all environment variables from the table above (production values).
3. Deploy — `main` is the production branch.
4. In **Google Search Console**, add your domain and submit `/sitemap.xml`.

Make sure `NEXT_PUBLIC_SITE_URL` and `FIREBASE_SERVICE_ACCOUNT` are set in production so the dynamic sitemap and per-page metadata work.

---

## 🎨 Design System

- **Primary**: `#D90429` (red)
- **Secondary**: `#0A0A0A` (black)
- **Background**: `#FFFFFF` (light) / dark mode included
- **Arabic font**: Bukra
- **English font**: Google Sans Flex

---

## 📌 Development Guidelines

- Use Tailwind CSS and follow the existing design tokens — avoid arbitrary random values.
- Keep components focused, reusable and placed under `src/shared` or their feature module.
- Add infinite decorative animations as CSS keyframes in `src/styles/animations.css` (`pf-*`), **not** framer-motion `repeat: Infinity`, to keep animations on the compositor.
- Run `npm run lint` before committing.

---

## 👨‍💻 Author

**Mohamed Amr** — Full Stack Developer
