# IMPLEMENTATION SPRINT ROADMAP

- [ ] **Phase 1: Foundations & Assets**
  - [ ] Initialize Next.js project with Tailwind CSS, configure custom fonts (Clash Display, Cabinet Grotesk, Satoshi).
  - [ ] Configure Neon Postgres connection string and run Drizzle migrations.
  - [ ] Download and organize designated Unsplash imagery into `/public/assets/images/`.

- [ ] **Phase 2: Global Motion Setup**
  - [ ] Install `@studio-freight/lenis`, `gsap`, `framer-motion`, `@mapbox/mapbox-gl-js`, `@novu/node`.
  - [ ] Create `SmoothScrollProvider` linking Lenis to GSAP `Ticker.add()`.

- [ ] **Phase 3: Hero & Landing Experience**
  - [ ] Build Hero with massive `PING` typographic background and staggered multi-card parallax stack using ScrollTrigger.
  - [ ] Implement interactive magnetic action button ("Start a Ping") with spring physics.
  - [ ] Build 5-step journey horizontal scroller (`Create` -> `Invite` -> `Suggest` -> `Vote` -> `Lock it in`).

- [ ] **Phase 4: Core Flow & Map Integration**
  - [ ] Build `/p/[id]` dynamic invite & voting room.
  - [ ] Embed Mapbox GL interactive venue selector and card markers.
  - [ ] Implement real-time optimistic voting with Framer Motion counter animations.

- [ ] **Phase 5: Notifications & Deployment**
  - [ ] Wire Novu workflow trigger for instant "Ping Lock-in" alerts.
  - [ ] Deploy frontend and edge API routes to Vercel.