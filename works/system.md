# SYSTEM & DESIGN SYSTEM SPECIFICATION

## 1. Visual Identity & Neo-Brutalist Aesthetic
- **Visual Language**: High contrast, bold rounded cards (24px-32px `rounded-3xl`), thick border strokes, sticker pills, tactile spring feedback.
- **Design Tokens (Tailwind Palette)**:
  - `bg-cream`: `#F4F1EA` (Primary background)
  - `brand-green-deep`: `#0F3822` (Hero headers, dark accents)
  - `brand-green-pulse`: `#00E676` (Primary CTA, active radar dots)
  - `brand-pink-radar`: `#FF4D8D` (Tags, notification badges, accent strokes)
  - `brand-coral`: `#FF6B4A` (Stickers, warning/lock-in alerts)
  - `card-dark`: `#181E1B` (Dark modal/drawer containers)

## 2. Typography Rules
- **Display Headlines**: `Clash Display` or `Druk Wide` (fallback: `Impact`, `Arial Black`)
  - Class: `font-display font-black tracking-tighter uppercase`
- **Subheadings & Accents**: `Cabinet Grotesk` or `Syne` (Bold 800)
  - Class: `font-heading font-extrabold tracking-tight`
- **Body & Controls**: `Satoshi` or `General Sans` (Medium 500 / SemiBold 600)
  - Class: `font-sans font-medium text-neutral-800`

## 3. Motion & Physics Engine Rules
- **Lenis Setup**: Synchronize Lenis instance with GSAP `ticker` to prevent scroll-jacking jitter.
- **GSAP ScrollTrigger**: Apply `pin`, `scrub: 1`, and custom `expo.out` easing to section entrances.
- **Framer Motion**:
  - Buttons/Pills: `whileHover={{ scale: 1.05 }}` `whileTap={{ scale: 0.94 }}` with `type: "spring", stiffness: 400, damping: 17`.
  - Floating stickers: Infinite idle float via `animate={{ y: [0, -8, 0] }}` with staggered durations.