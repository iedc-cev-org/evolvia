# changelogs.md

## Release 2026-09-30: Cosmic Venues & Complete Event Schedules Integration

### Added
- **Cosmic Venues Data Model (`src/data/venues.json`)**: Configured the 9 festival venues matching festival programs:
  - `Zenith` (Mini Auditorium): Inauguration, SELL YOUR IDEA, Mind2Make, Startup Stories, Closing Ceremony.
  - `Eclipse` (CCF Lab): MUE-CTF.
  - `Astra` (ASAP Room): Cyberpulse (FOSS Workshop), Pitchbox.
  - `Cosma` (CS B101): Quizzard College, Quizzard School.
  - `Orion` (MCA Block): GAMES, STARSHIP STATION, Dark Room, INNOVERSE, MAKERSTATION, ROBO SOCCER, ROBO TENNIS, PAPER FORGE.
  - `Pegasus` (EC Block): GAMES, LINE FOLLOWER FINITE, INFINITE, PAPER FORGE.
  - `Starlight Trail` (Library Front & MCA Front Pathway): GAMES, STARTUP STREET, WEvolve.
  - `Celesta` (Open Arena / EC Front, MCA Back & Junction): GAMES, EUPHONIA, BETHLEHEM, ROBO RACE, Cafee.
  - `Lyra` (Chemistry Lab): Deal or No Deal, COSMIC QUEST.
- **Interactive Venue Map Enhancements (`src/app/map/page.tsx`)**:
  - Added real-time search input for filtering venues by activity, event title, category, or hall name.
  - Added live pulsing emerald event counters and featured activity tag pills to venue cards.
  - Fixed card banner to dynamically load venue images rather than placeholder fallbacks.
  - Enhanced venue details modal with a full "Events & Timeline" schedule breakdown displaying event timings, sub-locations, and category badges.
- **Supabase Events Venue Sync**: Synchronized main event records in Supabase to reference their exact cosmic venue names.


### Fixed
- **Removed Stretched IEDC Logo**: Removed fixed top-left IEDC emblem from the venue map header (`/map`) to eliminate distorted image rendering and provide an uncluttered viewport.
- Added `unoptimized` prop to both `<Image>` components in `PinnedEventsSection.tsx` that render Supabase-hosted `.webp` posters. Next.js was proxy-downloading and re-encoding them server-side, causing repeated `TimeoutError` (code 23, ~10-12s). With `unoptimized`, the browser fetches the already-compressed files directly from Supabase CDN.
- Added `minimumCacheTTL: 3600` to `next.config.ts` to cache any remaining optimized remote images for 1 hour and prevent repeated fetches.


### Fixed
- Replaced GSAP scrub-pinned timeline on stalls section with IntersectionObserver stagger fade-in to eliminate scroll jank.
- Removed `willChange: transform` from stall section and all stall cards.
- Removed `backdrop-blur-lg` from stall cards (8 concurrent blur composites were major GPU bottleneck).
- Added `loading="lazy"` to stall images 4–8; images 1–3 remain `priority`/eager.
- Replaced framer-motion `whileInView` div in stalls header with a plain `div`.

## Release 2026-09-12: Dynamic Supabase Integration, Pre-Events Registration & Dependencies Update

### Added
- **Supabase Integration**: Initialized public Supabase client in `src/lib/supabase.ts` reading `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Dynamic Data Layer**: Added asynchronous fetchers in `src/components/eventLists.tsx` for `events` (`type = 'pre_event'` and `type = 'main_event'`), `stalls_and_expos`, `speakers`, and `sponsors`.
- **Defensive Data Handling**: Wrapped dynamic state population in `src/app/page.tsx` with `Array.isArray()` and dual alias properties (`stallsAndExpos` / `stalls`) to prevent runtime `undefined.length` TypeErrors.
- **Pre-Event Register Buttons**: Added interactive registration buttons to Pre-Event cards supporting external registration links, slug redirects, and completion statuses.
- **Slug & ID Hash Navigation**: Enhanced URL hash detection across `src/app/page.tsx` and `src/components/PinnedEventsSection.tsx` to handle slugs (`#visio`, `#bitburst-2-0`) and numeric IDs (`#e1`, `#1`).
- **Dependencies Upgrade**: Updated dependencies including `gsap@^3.15.0`, `tailwindcss@^4.3.3`, `@tailwindcss/postcss@^4.3.3`, `@supabase/supabase-js@^2.116.0`, `@react-three/drei@^10.7.8`, `mongodb@^6.21.0`.

### Maintained & Verified
- Updated logo asset references from `logo.webp` to `logo.png` across CSS mask filters, Hero loader shimmer masks, and Footer branding.
- Fixed CSS syntax error in `src/app/globals.css` that was preventing stylesheet compilation.
- Fixed JSX Image component syntax in `src/app/map/page.tsx`.
- Added resilient 1.5s fallback timeout to video ready effect in `src/app/page.tsx` to prevent blank screen freezes.
- Fixed Pre-Events poster container to exact 3:4 portrait aspect ratio (`aspect-[3/4]`).
- Placed persistent top-right glassmorphic `Map` button pill (`z-50`) in the navigation bar with active redirect to `/map`.
- Preserved all GSAP animations: ScrollSmoother, ScrollTrigger pinning, 3D card tilt, shimmer wipes, and character split reveals.
- Verified in live browser testing: Homepage rendering, smooth scroll, Map page navigation, zone filter tabs, and return flow.
- Removed all hardcoded raw dummy data arrays (`preEvents`, `Events`, `StallsAndExpos`, `Speakers`, `Sponsors`) in `src/components/eventLists.tsx` to ensure 100% dynamic data sourcing from Supabase.
- Added interactive Register buttons to Pre-Event cards with status awareness (`Register Now`, `Event Completed`, `Registration Closed`).
- Implemented automatic smooth scrolling to target event/pre-event slug cards (`/#<slug>`) once the web page and ScrollSmoother finish loading, eliminating skipped scrolls.
- Configured dynamic DB registration link forwarding (`event.link`), `isClosed` status handling ('Registration Closed'), and `isCompleted` status handling ('Completed').
- Restored smooth hover poster overlay transition: completed poster (`completed_image`) smoothly fades in on card hover only when `isCompleted` is true.
- Preserved zero-comment production code standard across the codebase.

## Release 2026-09-18: Stable Main Event Redirection & Mobile Scrolling Enhancements

### Fixed
- **Main Event Disappearance on Redirection**: Eliminated dynamic array reordering in `src/app/page.tsx` that was causing `ScrollTrigger` instances in `src/components/PinnedEventsSection.tsx` to be killed and re-initialized mid-scroll.
- **Direct Slide Targeting**: Main event slug URLs (`/#visio`, `/#bitburst-2-0`, `/#iedc-alumni-interaction-meet`) now calculate exact vertical slide offsets (`eventsSectionTop + targetIndex * window.innerHeight`) and glide ScrollSmoother directly to the targeted slide.
- **Main Events 3:4 Poster Ratio**: Restored the 3:4 portrait poster ratio (`aspect-[3/4]`) across all screen sizes in `src/components/PinnedEventsSection.tsx`.
- **Mobile Viewport Optimization in Pinned Events**: Adjusted left indicator column (`w-1/4`), scaled typography, and paddings so that all card details and buttons render cleanly on mobile viewports.
- **Mobile Touch Inertia on Stalls Timeline**: Adjusted scrub timeline end distance on mobile screens to prevent scroll resistance on touch devices.
- **Speakers & Sponsors Layout**: Refined card heights and multi-column grid gaps across mobile viewports, applying `overflow-x-hidden` across section wrappers to eliminate horizontal micro-shifts.
