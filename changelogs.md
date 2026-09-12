# changelogs.md

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
- Implemented smooth slug scrolling via ScrollSmoother/scrollTo instead of harsh jumps, preserving uninterrupted hero animation video loading.
- Configured dynamic DB registration link forwarding (`event.link`), `isClosed` status handling ('Registration Closed'), and `isCompleted` status handling ('Completed').
- Restored smooth hover poster overlay transition: completed poster (`completed_image`) smoothly fades in on card hover only when `isCompleted` is true.
- Preserved zero-comment production code standard across the codebase.
