# design.md

## Aesthetic & Design Philosophy
Evolvia features a dark, cinematic, cyberpunk-futuristic aesthetic centered on high-contrast monochrome tones, subtle translucent glassmorphism (`backdrop-blur-md`), smooth typography, and fluid kinetic typography.

## Design Tokens & Standards
- **Background**: Deep Pitch Black (`#000000`, `bg-black`)
- **Glassmorphism Panels**: `bg-white/5` to `bg-white/10` with `border-white/10` to `border-white/20` and `backdrop-blur-md` / `backdrop-blur-lg`
- **Typography**: Inter Tight with varying weights (Light 300 to Black 900)
- **Accents**:
  - Emerald highlight for active showcases: `bg-emerald-400`, `shadow-[0_0_10px_rgba(52,211,153,0.6)]`
  - Subtle gold tint for sponsor backing: `bg-amber-50/5`
  - Clean high-contrast CTA: Pure white (`#ffffff`) background with pure black (`#000000`) text

## Motion & Interaction Patterns
- **Hero Video Gate**: Interaction is locked until hero video `canplaythrough` / `loadeddata` signals readiness.
- **ScrollSmoother Integration**: Smooth scrolling on desktop and mobile viewports with normalized touch inertia.
- **Pinned Events Roller**: Fixed left-hand numeral roller column utilizing GSAP translateY calculations synced to scroll progress.
- **Mobile Responsive Layout**: Adaptive split (`w-1/4` left, `w-3/4` right) on mobile devices with consistent 3:4 portrait poster ratio (`aspect-[3/4]`) ensuring all cards, metadata, and CTA buttons fit with fluid aesthetics.
- **Stalls Scrub Timeline**: Responsive scroll distance (`cards.length * 120 + 200` on mobile, `cards.length * 220 + 400` on desktop) preventing sticky scroll locks on mobile screens.
- **3D Interactive Card Tilt**: Dynamic perspective rotate (`rotateX`, `rotateY`) reacting to local mouse coordinates on event cards.
- **Character Split Scrub Reveal**: GSAP character/word splitting on typography heading sequences.
- **Pre-Events Micro-Interactions**: Hover zoom on image wrappers, interactive state badges, and dynamic CTA buttons.
