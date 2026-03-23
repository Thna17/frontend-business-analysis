# Smart Business Analytics SaaS - Frontend

SRS-aligned frontend foundation for a training project at KIT.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui components

## Implemented Frontend Foundation
- Authentication page (`/auth/login`) with role selection
- Business Owner dashboard (`/owner`)
- Administrator dashboard (`/admin`)
- Sales table with search and category filtering UI
- Revenue analytics section with visual comparison bars
- Subscription management cards for Free/Pro/Business
- Typed frontend domain models and feature services

## Current Frontend Structure

```txt
src/
├── app/
│   ├── page.tsx                       # Landing page
│   ├── layout.tsx                     # Global app shell
│   ├── auth/login/page.tsx            # Login page
│   └── (dashboard)/
│       ├── layout.tsx                 # Shared dashboard layout
│       ├── owner/page.tsx             # Business Owner dashboard
│       └── admin/page.tsx             # Admin dashboard
├── components/
│   ├── ui/                            # shadcn/ui primitives
│   └── sba/                           # Smart Business Analytics components
├── features/
│   ├── auth/
│   ├── business/
│   ├── sales/
│   ├── analytics/
│   ├── subscriptions/
│   └── admin/
├── lib/mock-data.ts                   # Mock data for frontend development
└── types/domain.ts                    # Domain types aligned with SRS
```

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes
- This is a frontend-first scaffold and currently uses mock services.
- Legacy files from the previous template still exist in the repo; new SRS work is under the structure above.
- Once backend APIs are ready, replace feature service mock functions with real API calls.
