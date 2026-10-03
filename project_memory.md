# project_memory.md

## Project Context
Evolvia is the official web portal for the IEDC flagship techno-entrepreneurship fest. The frontend is engineered with cinematic visual polish including scroll-based video sequences, GSAP pinned slide decks with digit counters, interactive cursor tracking, campus 3D navigation, and cosmic venue directories.

## Pages Architecture & Route Breakdown

### 1. Home Page (`/` — `src/app/page.tsx`)
- **Hero Video Gate**: High-definition video canvas (`/page-assets/hero.mp4`) with readiness listeners (`canplaythrough`, `loadeddata`) and a 1.5s fallback failsafe to prevent viewport locking.
- **Kinetic Scrub Reveal**: Cinematic typographic headlines ("TECHNO ENTREPRENEURSHIP FEST/") driven by character and word split animations synced to user scroll progress.
- **Scroll Video Sequence (`ScrollVideo.tsx`)**: High-performance canvas-based scroll sequence rendering 238 preloaded high-fidelity video frames (`/frames/frame_XXXX.jpg`) driven by viewport scroll offset.
- **Pinned Events Roller (`PinnedEventsSection.tsx`)**:
  - Horizontal/vertical slide deck pinned via GSAP ScrollTrigger (`pinned-events-trigger`).
  - Animated rolling numeral digits (tens and ones columns) reflecting the active slide.
  - Interactive 3D mouse perspective tilt effect.
  - Dual poster rendering: active poster with smooth cross-fade to `completed_image` on hover when `isCompleted: true`.
  - Universal alphanumeric deep hash navigation (`#pitchbox`, `#deal-or-no-deal`, `#ctf`, `#e1`).
- **Stalls & Expos Showcase**: Lightweight `IntersectionObserver` stagger fade-in cards highlighting tech innovation stalls. Optimized without GPU-heavy backdrop blur layers, eager loading first 3 posters and lazy-loading remaining items.
- **Pre-Events Section**: Grid showcase of pre-fest workshops, coding contests, and talks. Cards display event schedule, venue, status badges (`Completed`, `Registration Closed`, or active `Register Now` CTAs), with smooth poster swap on card hover for completed events.
- **Keynote Speakers**: Multi-column responsive cards with gradient overlays displaying speaker portraits, names, designations, and domains of expertise.
- **Sponsors Showcase**: Clean high-contrast grid container (`bg-amber-50/5`) displaying official partner and sponsor emblems.
- **Interactive Cursor**: Custom floating cursor pill utilizing `mix-blend-mode: exclusion` following pointer movement with lerped spring physics.
- **Persistent Header & Quick Navigation**: Floating brand logo, animated 'Jump to Event' button, and fixed glassmorphic redirect pill to `/map`.

### 2. Cosmic Venues & Campus Map (`/map` — `src/app/map/page.tsx`)
- **Atmospheric Background**: Looping ambient video backdrop (`/page-assets/loop.mp4`) with blur and brightness adjustments for depth.
- **Cosmic Venue Data Directory (`src/data/venues.json`)**: Configured around 9 designated festival zones:
  - `Zenith` (Mini Auditorium): Keynotes, SELL YOUR IDEA, Mind2Make, Startup Stories, Inauguration & Closing ceremonies.
  - `Eclipse` (CCF Lab): MUE-CTF (Capture The Flag).
  - `Astra` (ASAP Room): Cyberpulse (FOSS Workshop), Pitchbox.
  - `Cosma` (CS B101): Quizzard College, Quizzard School.
  - `Orion` (MCA Block): Gaming arena, Starship Station, Dark Room, Innoverse, Maker Station, Robo Soccer, Robo Tennis, Paper Forge.
  - `Pegasus` (EC Block): Line Follower (Finite & Infinite), Paper Forge, Games.
  - `Starlight Trail` (Library Front & MCA Front Pathway): Outdoor games, Startup Street, WEvolve showcase.
  - `Celesta` (Open Arena / EC Front, MCA Back & Junction): Bethlehem, Euphonia, Robo Race, Open Cafeteria.
  - `Lyra` (Chemistry Lab): Deal or No Deal, Cosmic Quest.
- **Interactive Search & Block Filters**: Real-time filtering by event keyword, speaker, activity, or room name, plus block-level tab categorization.
- **Venue Details Modal**: Comprehensive popup displaying venue hero photography, full chronological event schedules, timing slots, sub-locations, and category badges.
- **Direct Navigation Integration**: One-click Google Maps GPS pin redirection utilizing exact coordinates (`coordinates.lat`, `coordinates.lng`).

## Resilient Data Layer & Zero-Failure Architecture
The application is architected with a decoupled dual-layer data pipeline:

1. **Independent Static Fallback Layer (`src/components/eventLists.tsx`)**:
   - Complete hardcoded datasets for `preEvents`, `Events`, `StallsAndExpos`, `Speakers`, and `Sponsors`.
   - Every local poster asset is bundled inside `/public/events`, `/public/pre-events`, `/public/stalls`, `/public/speakers`, and `/public/sponsors`.
2. **Optional Database Enhancement Layer (`src/lib/supabase.ts`)**:
   - Supabase connection is treated strictly as an optional data source.
   - If database environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are missing, invalid, or empty, the application immediately uses the local static dataset without making any network calls.
   - If database credentials are provided but the database is unreachable, paused, slow, or returns errors, all fetch handlers (`fetchPreEvents`, `fetchMainEvents`, `fetchStallsAndExpos`, `fetchSpeakers`, `fetchSponsors`) safely catch exceptions and fall back to the static datasets.
   - Data is unified via `mergeAndSort()`, ensuring that dynamic database records seamlessly blend with or override static defaults based on `order_index`.
   - Result: 100% web app availability and zero rendering blockers even during complete database downtime.

## Supabase Schema & Field Mappings

### 1. Events Table (`events`)
- **Query Filter**: `type = 'main_event'` for flagship events; `type = 'pre_event'` for workshops and pre-fests.
- **Field Mappings**:
  - `id` -> `id` (numeric or string)
  - `name` / `title` -> `name`
  - `slug` -> `slug` (fallback generated from name)
  - `poster_url` / `image_url` / `image` -> `image`
  - `completed_poster_url` / `completed_image_url` -> `completed_image`
  - `spec` / `specification` / `tagline` -> `spec`
  - `date_time` / `dateTime` -> `dateTime`
  - `venue` / `location` -> `venue`
  - `link` / `registration_link` / `url` -> `link`
  - `description` -> `description`
  - `is_closed` / `isClosed` -> `isClosed`
  - `is_completed` / `isCompleted` -> `isCompleted`
  - `order_index` -> `order_index` (ascending sort)

### 2. Stalls and Expos Table (`stalls_and_expos`)
- `id` -> `id`
- `name` -> `name`
- `poster_url` / `image` -> `image`
- `description` -> `description`
- `order_index` -> `order_index`

### 3. Speakers Table (`speakers`)
- `id` -> `id`
- `name` -> `name`
- `designation` -> `designation`
- `expertise` -> `expertise`
- `poster_url` / `image` -> `image`
- `order_index` -> `order_index`

### 4. Sponsors Table (`sponsors`)
- `id` -> `id`
- `name` -> `name`
- `poster_url` / `image` -> `image`
- `order_index` -> `order_index`

## Navigation & Deep-Linking System
- **Hash Target Calculation**: Slide target offsets are derived directly from `ScrollTrigger.getById("pinned-events-trigger")` start coordinate (`st.start + targetIndex * window.innerHeight`), preventing scroll drift caused by viewport resize or dynamic bounding rects.
- **Fuzzy Alphanumeric Matching (`isEventMatch`)**: Normalizes event IDs, slugs, and names so links like `#pitchbox`, `#pitch-box`, `#deal-or-no-deal`, `#ctf`, or `#e1` accurately resolve.
- **ScrollSmoother Integration**: Direct smooth scrolling executes upon initial load with an automatic retry polling cycle to handle asynchronous media and layout stabilization.
