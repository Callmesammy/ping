# AI ARCHITECTURE: PING (SOCIAL PLANNING APP)

## 1. System Topology & Stack
- **Framework**: Next.js 14+ (App Router, Server Actions, Route Handlers)
- **Database & ORM**: Neon Serverless PostgreSQL with Drizzle ORM
- **Hosting & Edge**: Vercel (Edge Functions, Serverless API)
- **Mapping & Places**: Mapbox GL JS + Geocoding API
- **Notifications Engine**: Novu Cloud / Novu Node SDK (In-App feeds + Email/Push triggers)
- **Animation & Layout Pipeline**:
  - Global Smooth Scroll: `@studio-freight/lenis` (or `lenis/react`)
  - Page & Scroll Orchestration: `gsap` + `gsap/ScrollTrigger`
  - Component Springs & Gestures: `framer-motion`
- **Styling & Tokens**: Tailwind CSS + Custom Design System tokens

## 2. Core Modules
- **Auth & Session**: Tokenless/Magic link or guest session system via signed JWT cookies.
- **Ping Core Service**: State machine managing plan lifecycle (`DRAFT` -> `INVITED` -> `VOTING` -> `LOCKED` -> `ACTIVE` -> `COMPLETED`).
- **Poll & Voting Engine**: Optimistic UI updates with server-side reconciliation for place/time votes.
- **Location Dispatcher**: Mapbox SDK integration for venue suggestions, clustering, and route previews.
- **Notification Router**: Novu workflow trigger on new pings, vote updates, and final lock-in events.