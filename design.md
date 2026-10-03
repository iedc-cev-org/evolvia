# design.md

## Aesthetic & Design Philosophy
Evolvia embodies a dark, cinematic, cyberpunk-futuristic aesthetic centered on deep pitch black surfaces (`#000000`), subtle translucent glassmorphic layering (`backdrop-blur-md` / `backdrop-blur-xl`), fluid kinetic typography, and rich interactive feedback.

## Design Tokens & Standards

### Palette & Tones
- **Canvas / Background**: Deep Pitch Black (`#000000`, `bg-black`)
- **Glassmorphic Panels**:
  - Light Elevation: `bg-white/5` with `border-white/10`
  - High Elevation: `bg-white/10` with `border-white/20` and `backdrop-blur-md`
  - Modal Elevation: `bg-gradient-to-br from-zinc-900/90 to-zinc-950/95` with `backdrop-blur-xl` and `border-white/20`
- **Typography & Weights**: Inter Tight (`font-sans`, weights 100 through 900)
- **Accents & States**:
  - Pulse / Live Indicator: Emerald (`bg-emerald-400`, `border-emerald-500/30`, `text-emerald-400`, `shadow-[0_0_10px_rgba(52,211,153,0.6)]`)
  - Cosmic Glow: Indigo/Purple ambient radiance (`bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl`)
  - Sponsor Container Tint: Subtle warm amber (`bg-amber-50/5`)
  - Primary CTA Buttons: High-contrast pure white (`bg-white`) with pure black typography (`text-black`) and rounded radii (`rounded-md`, `rounded-full`)

## Pages Layout Architecture

### 1. Home Page (`/`)
- **Hero Video Gate**: Full viewport (`h-screen w-screen`) canvas with background video overlay (`/page-assets/hero.mp4`) and pulsing scroll pill indicator.
- **Scroll Video Sequence**: 238-frame scroll-driven canvas sequence (`ScrollVideo.tsx`) paired with synchronized scrub-reveal typography.
- **Pinned Slide Deck (`PinnedEventsSection.tsx`)**:
  - Dual-column viewport partition: left-hand numeral roller (`w-1/4` on mobile, fixed left column on desktop) paired with right-hand event card showcase.
  - Event Card: Strict 3:4 portrait poster ratio (`aspect-[3/4]`), interactive 3D perspective mouse tilt (`rotateX`, `rotateY`), and smooth cross-fade to completed poster overlay on hover.
- **On Floor Showcase (Stalls & Expos)**:
  - 3-column responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
  - Staggered entry animation driven by `IntersectionObserver`.
  - Elimination of heavy backdrop blur on cards to maximize GPU compositing performance.
- **Pre-Events Section**:
  - 3-column card matrix with portrait poster frames (`aspect-[3/4]`), status pill overlays (`Completed`, `Registration Closed`), and dynamic `Register Now` CTAs.
- **Speakers Section**:
  - 2-column portrait cards (`h-72 sm:h-80 md:h-96`) with bottom gradient fade and typography hierarchy.
- **Sponsors Showcase**:
  - Multi-column grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`) inside an amber-tinted glassmorphic container.
- **Global Custom Cursor**:
  - 40px circular pointer tracker with `mixBlendMode: exclusion` and smooth lerped spring following.

### 2. Cosmic Venues & Campus Map (`/map`)
- **Atmospheric Background**: Blurred looping campus video (`/page-assets/loop.mp4` with `blur(8px) brightness(0.4)`) overlayed with `bg-black/40`.
- **Top Navigation Pill**: Fixed glassmorphic redirect pill returning to `/`.
- **Search & Filter Bar**:
  - Full-width pill search input with magnifying icon and instant query clear button.
  - Horizontally wrapped block tabs (`All Venues`, `EC Block`, `MCA Block`, `CS Block`, etc.) with active pill state switching.
- **Venue Matrix**:
  - 3-column card grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) with smooth hover elevation (`scale: 1.02`, `y: -5`).
  - Hero banner preview for each venue, pulsing emerald active event counters, and featured activity tags.
  - Integrated Google Maps redirection button.
- **Venue Schedule & Details Modal**:
  - Centered backdrop-blurred modal dialog (`bg-black/85 backdrop-blur-md`) with dismiss on click-outside or close button.
  - Chronological schedule timeline, category pills, event timing badges, and sub-location tags.

## Interaction & Motion Patterns
- **ScrollSmoother Velocity**: Smooth scroll damping normalized across desktop and mobile viewports (`smooth: 1`, `smoothTouch: 0.1`).
- **Deep Linking Motion**: Direct programmatic glide to event slides or pre-event cards with automatic retry loops ensuring accurate scroll targets.
- **Micro-Interactions**: Hover scale transformations (`hover:scale-105`), subtle border luminescence, and gradient shine wipes across cards and buttons.
