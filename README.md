# Evolvia

The official event web portal for the IEDC flagship techno-entrepreneurship fest, engineered with cinematic visuals, scroll-driven frame sequences, interactive campus map directories, and responsive GSAP slide decks.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.25-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15.0-88CE02?style=for-the-badge&logo=greensock)](https://greensock.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Optional_Sync-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## Key Features

- **Cinematic Hero Gate**: Video canvas with readiness detection and smooth reveal animations.
- **Scroll Video Sequences**: 238-frame scroll-driven canvas sequence (`ScrollVideo.tsx`) with kinetic typography reveal.
- **GSAP Pinned Events Deck**: Pinned event carousel with rolling digit counters, 3D card tilt, completed-poster hover transitions, and deep hash navigation (`#pitchbox`, `#deal-or-no-deal`, `#ctf`).
- **Cosmic Venues & Campus Map (`/map`)**: Full campus interactive map structured around 9 cosmic zones with real-time keyword search, block filter tabs, detailed event timeline modals, and Google Maps GPS redirection.
- **On Floor Showcase (Stalls & Expos)**: Optimized card grid with lightweight `IntersectionObserver` stagger animations.
- **Pre-Events with Registration Status**: Dynamic event status badges (`Completed`, `Registration Closed`, `Register Now`) with external registration routing.
- **Keynote Speakers & Festival Sponsors**: High-contrast, responsive showcase sections with gradient overlays.
- **Zero-Failure Resilient Architecture**: Database connectivity is strictly an enhancement layer. If database details are missing, invalid, or offline, the site functions 100% autonomously using comprehensive built-in local static datasets.

---

## Tech Stack

### Core Framework
- **Next.js 15 (App Router)**: Fast server and client-side rendering with Turbopack.
- **React 19**: Modern concurrent React architecture.
- **TypeScript**: Strict type definitions for event schemas and UI props.

### Styling & Motion
- **Tailwind CSS v4**: Utility-first styling with custom glassmorphism tokens.
- **GSAP 3**: ScrollSmoother and ScrollTrigger powering scroll-pinned layouts and scrub reveals.
- **Framer Motion**: Gesture handling, presence transitions, and modal animations.
- **Three.js & React Three Fiber**: 3D rendering pipeline for campus visualization.

### Data Layer
- **Supabase JS**: Real-time remote data synchronization for events, stalls, speakers, and sponsors.
- **Local Static Datasets**: Zero-dependency offline fallback ensuring full web availability without active database connectivity.

---

## Project Structure

```
evolvia/
├── public/
│   ├── events/               # Main event posters (.webp)
│   ├── frames/               # 238 animation sequence frames (frame_XXXX.jpg)
│   ├── map-assets/           # Campus map and venue media
│   ├── page-assets/          # Logos, hero video, and looping background
│   ├── pre-events/           # Pre-event posters (.webp)
│   ├── speakers/             # Speaker portraits (.webp)
│   ├── sponsors/             # Partner & sponsor emblems (.webp)
│   └── stalls/               # Tech expo and stall posters (.webp)
├── src/
│   ├── app/
│   │   ├── globals.css       # Tailwind 4 styles and custom utility classes
│   │   ├── layout.tsx        # Root layout with font and interaction setup
│   │   ├── page.tsx          # Main festival home page
│   │   └── map/
│   │       └── page.tsx      # Interactive cosmic venues & campus map page
│   ├── components/
│   │   ├── AnimatedReveal.tsx            # GSAP character & word scrub reveal
│   │   ├── DisableImageInteractions.tsx  # Protection against unauthorized dragging
│   │   ├── Footer.tsx                    # Festival footer and social links
│   │   ├── PinnedEventsSection.tsx       # GSAP pinned event carousel with digit roller
│   │   ├── Providers.tsx                 # Client context wrappers
│   │   ├── ScrollVideo.tsx               # 238-frame canvas scroll player
│   │   └── eventLists.tsx                # Data definitions, fallbacks & fetchers
│   ├── data/
│   │   └── venues.json       # Venue metadata, coordinates, and timelines
│   └── lib/
│       └── supabase.ts       # Resilient Supabase client configuration
├── project_memory.md         # Architecture, schemas & deep technical documentation
├── design.md                 # Design tokens, layout standards & aesthetic rules
├── changelogs.md             # Chronological development logs
└── AGENTS.md                 # Strict development and clean-code standards
```

---

## Pages Overview

### 1. Home Page (`/`)
The primary festival landing page featuring:
- **Hero Video Gate**: Cinematic video background with smooth entrance transitions.
- **Scroll Video Sequence**: Interactive scroll-controlled frame playback synced to kinetic typography.
- **Flagship Pinned Events**: Sticky vertical deck with live digit counters, 3D tilt, and deep-link routing.
- **Stalls & Expos**: Floor showcase with staggered fade-in animations.
- **Pre-Events**: Workshop and competition cards with live status badges.
- **Speakers & Sponsors**: Highlight sections honoring keynote speakers and corporate partners.

### 2. Venue Map & Schedule Page (`/map`)
The interactive campus navigation portal featuring:
- **Atmospheric Video Loop**: Ambient campus background with dark glassmorphic UI.
- **9 Cosmic Zones**: Zenith, Eclipse, Astra, Cosma, Orion, Pegasus, Starlight Trail, Celesta, and Lyra.
- **Real-Time Live Search**: Instant filtering by event title, hall name, category, or activity.
- **Block Tabs**: Quick filter pills across academic blocks and arenas.
- **Schedule Timeline Modal**: Modal popup with detailed event hours, sub-locations, and descriptions.
- **Google Maps Integration**: Direct one-click GPS navigation to campus landmarks.

---

## Resilient Data Handling

The platform uses a **resilient dual-layer data architecture**:

| State | Behavior |
| --- | --- |
| **No DB Configured** | Application runs 100% autonomously using comprehensive local datasets in `src/components/eventLists.tsx`. |
| **DB Offline / Paused** | Fetch requests safely fail over without blocking page load or throwing unhandled errors. |
| **DB Active** | Live Supabase records are queried and merged with local data sorted by `order_index`. |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/iedc-cev-org/evolvia.git
   cd evolvia
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables (Optional):
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   > **Note:** If database credentials are not provided, the web application runs completely normally using built-in local static datasets.

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open your browser:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint verification

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

<p align="center">
  <strong>Built with ❤️ by the IEDC CEV Team</strong>
</p>
