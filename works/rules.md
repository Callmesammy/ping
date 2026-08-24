# AI DEVELOPMENT RULES & CONSTRAINTS

1. **Strict Zero-Productivity Tone**: UI copy, design elements, and notifications must feel social and spontaneous. Never use enterprise/productivity terminology like "schedule meeting", "slot", "agenda", or "organizer".
2. **Animation Cleanliness**: All GSAP instances must be wrapped in `gsap.context()` inside `useEffect` or `useGSAP()` hooks to ensure proper cleanup on component unmount and prevent memory leaks.
3. **No Layout Shift on Smooth Scroll**: Ensure Lenis handles smooth scrolling without hijacking anchor tags or breaking native mobile touch behavior.
4. **Optimistic UI Updates**: All user votes on places and times must reflect immediately via Framer Motion spring states before waiting for server response.
5. **Responsive Typography**: Display headers (`Clash Display`) must use viewport clamp scaling (e.g., `text-[clamp(3.5rem,12vw,14rem)]`) to prevent horizontal layout breaks on small screens.