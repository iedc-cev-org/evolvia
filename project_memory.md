# project_memory.md

## Project Context
Evolvia is the official web portal for the IEDC flagship techno-entrepreneurship fest. The frontend is engineered with cinematic visual polish including scroll-based video sequences, GSAP pinned slide decks with digit counters, interactive cursor tracking, and campus 3D navigation.

## Supabase Schema & Field Mappings
## Release 2026-09-28: Stall Section Performance Fixes

### Fixed
- **Stalls Scroll Lag**: Replaced GSAP `scrub: true` pinned timeline on stalls section with a lightweight `IntersectionObserver` stagger fade-in. Eliminated scroll jank caused by pinning + per-frame GSAP scrub repaints.
- **Removed `willChange: transform`**: Dropped from stall section wrapper and every stall card to reduce excessive GPU composite layer creation.
- **Removed `backdrop-blur-lg`**: Removed from all stall cards (8 concurrent blur composites were the primary GPU bottleneck).
- **Image lazy loading**: First 3 stall images are `priority`/eager; remaining 5 use `loading="lazy"` to avoid blocking the main thread.
- **Removed `motion.div` whileInView**: Replaced framer-motion observer div in the stalls header with a plain `div` to eliminate competing IntersectionObserver.


### 1. Events Table (`events`)
- **Query Filter**: `type = 'main_event'` for core competitions and keynote sessions; `type = 'pre_event'` for workshops and pre-launch meets.
- **Field Mappings**:
  - `id` -> `id` (numeric or string)
  - `name` / `title` -> `name`
  - `slug` -> `slug` (auto-generated fallback from name if null)
  - `poster_url` / `image_url` / `image` -> `image`
  - `completed_poster_url` / `completed_image_url` -> `completed_image`
  - `spec` / `specification` / `tagline` -> `spec`
  - `date_time` / `dateTime` -> `dateTime`
  - `venue` / `location` -> `venue`
  - `link` / `registration_link` / `url` -> `link`
  - `description` -> `description`
  - `is_closed` / `isClosed` -> `isClosed`
  - `is_completed` / `isCompleted` -> `isCompleted`
  - `order_index` -> `order_index` (used for ascending sort)

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

## Navigation & URL Routing Memory
- **Map System**: Full interactive venue directory and campus map available at `/map` with 3D background loop, floor filters, and Google Maps pin redirection. Top header includes a persistent glassmorphic "Map" button adjacent to the CEV emblem. Fixed top-left stretched IEDC logo removed from map view for a clean, cinematic header.
- **Main Events**: Support universal hash routing (`#sellyouridea`, `#sell-your-idea`, `#ctf`, `#capture-the-flag`, `#pitchbox`, `#pitch-box`, `#deal-or-no-deal`, `#dealornodeal`, `#e1`, `#1`). Normalized alphanumeric matching (`isEventMatch`) ensures links match regardless of hyphens, casing, spaces, acronyms, or IDs.
- **Direct Slide Targeting**: Hash link navigation for main events calculates the exact absolute scroll position (`st.start + targetIndex * window.innerHeight`) via `ScrollTrigger.getById("pinned-events-trigger")`, completely decoupled from dynamic viewport client rects or current scroll offsets. Conflict between duplicate hash listeners eliminated by unifying navigation under `scrollToTargetSlug` with an automated retry loop for asynchronous Supabase event hydration.
- **Pinned Scroll Deck**: Updates window hash dynamically as user scrolls (`#visio`, `#bitburst-2-0`, etc.). On card hover, `completed_image` smoothly overlays `image` only when `isCompleted` is true; otherwise standard `image` is shown with smooth scaling. Slide elements feature explicit `id` and `data-slug` attributes for DOM anchor resolution.
- **Mobile Responsive Layout**: Pinned events layout automatically adapts on mobile viewports (< 768px) with proportional numeral indicators (`w-1/4`), 3:4 portrait poster ratio (`aspect-[3/4]`), and scaled typography/paddings to guarantee that all card metadata and Register buttons fit inside mobile phone heights with 0 vertical cutoffs or scroll traps.
- **Pre-Events**: Feature dedicated Register Now CTA buttons linked to `event.link` from DB, with disabled badges for 'Registration Closed' (`isClosed: true`) and 'Completed' (`isCompleted: true`). Deep slug routing is enabled (`/#<slug>`): when a slug link is called, the web page initializes the hero and then automatically smooth-scrolls directly to the target card area through `ScrollSmoother`. On card hover, `completed_image` smoothly overlays `image` only when `isCompleted` is true.
- **Stalls Section**: Cards fade in via IntersectionObserver stagger (no GSAP pin/scrub) to eliminate scroll lag. No `willChange` or `backdrop-blur` on cards. First 3 images are eager-loaded; rest are lazy-loaded.
- **Cosmic Venues & Schedule System (`/map`)**: Updated map directory structured around 9 cosmic venues:
  - `Zenith` (Mini Auditorium): Inauguration, SELL YOUR IDEA, Mind2Make, Startup Stories, Closing Ceremony.
  - `Eclipse` (CCF Lab): MUE-CTF.
  - `Astra` (ASAP Room): Cyberpulse (FOSS Workshop), Pitchbox.
  - `Cosma` (CS B101): Quizzard College, Quizzard School.
  - `Orion` (MCA Block): GAMES, STARSHIP STATION, Dark Room, INNOVERSE, MAKERSTATION, ROBO SOCCER, ROBO TENNIS, PAPER FORGE.
  - `Pegasus` (EC Block): GAMES, LINE FOLLOWER FINITE, INFINITE, PAPER FORGE.
  - `Starlight Trail` (Library Front & MCA Front Pathway): GAMES, STARTUP STREET, WEvolve.
  - `Celesta` (Open Arena / EC Front, MCA Back & Junction): GAMES, EUPHONIA, BETHLEHEM, ROBO RACE, Cafee.
  - `Lyra` (Chemistry Lab): Deal or No Deal, COSMIC QUEST.
  - Includes real-time event & venue search, dynamic block filter tabs, event count badges, featured event pills, and detailed schedule timeline in the venue modal.

