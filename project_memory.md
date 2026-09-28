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
- **Map System**: Full interactive venue directory and campus map available at `/map` with 3D background loop, floor filters, and Google Maps pin redirection. Top header includes a persistent glassmorphic "Map" button adjacent to the CEV emblem.
- **Main Events**: Support hash routing (`#visio`, `#bitburst-2-0`, `#iedc-alumni-interaction-meet`, `#e1`, `#1`). Main events array maintains a stable order directly from Supabase, eliminating slide array reshuffling bugs.
- **Direct Slide Targeting**: Hash link navigation for main events calculates the exact scroll offset (`eventsSectionTop + targetIndex * window.innerHeight`) to glide ScrollSmoother directly to that exact slide.
- **Pinned Scroll Deck**: Updates window hash dynamically as user scrolls (`#visio`, `#bitburst-2-0`, etc.). On card hover, `completed_image` smoothly overlays `image` only when `isCompleted` is true; otherwise standard `image` is shown with smooth scaling.
- **Mobile Responsive Layout**: Pinned events layout automatically adapts on mobile viewports (< 768px) with proportional numeral indicators (`w-1/4`), 3:4 portrait poster ratio (`aspect-[3/4]`), and scaled typography/paddings to guarantee that all card metadata and Register buttons fit inside mobile phone heights with 0 vertical cutoffs or scroll traps.
- **Pre-Events**: Feature dedicated Register Now CTA buttons linked to `event.link` from DB, with disabled badges for 'Registration Closed' (`isClosed: true`) and 'Completed' (`isCompleted: true`). Deep slug routing is enabled (`/#<slug>`): when a slug link is called, the web page initializes the hero and then automatically smooth-scrolls directly to the target card area through `ScrollSmoother`. On card hover, `completed_image` smoothly overlays `image` only when `isCompleted` is true.
- **Stalls Section**: Cards fade in via IntersectionObserver stagger (no GSAP pin/scrub) to eliminate scroll lag. No `willChange` or `backdrop-blur` on cards. First 3 images are eager-loaded; rest are lazy-loaded.
