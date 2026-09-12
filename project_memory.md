# project_memory.md

## Project Context
Evolvia is the official web portal for the IEDC flagship techno-entrepreneurship fest. The frontend is engineered with cinematic visual polish including scroll-based video sequences, GSAP pinned slide decks with digit counters, interactive cursor tracking, and campus 3D navigation.

## Supabase Schema & Field Mappings

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
- **Main Events**: Support hash routing (`#visio`, `#bitburst-2-0`, `#e1`, `#1`).
- **Pinned Scroll Deck**: Updates window hash dynamically as user scrolls (`#visio`, `#bitburst-2-0`, etc.). On card hover, `completed_image` smoothly overlays `image` only when `isCompleted` is true; otherwise standard `image` is shown with smooth scaling.
- **Pre-Events**: Feature dedicated Register Now CTA buttons linked to `event.link` from DB, with disabled badges for 'Registration Closed' (`isClosed: true`) and 'Completed' (`isCompleted: true`). Deep slug routing is enabled (`/#<slug>`), displaying a 'Jump to Event' button on load and smooth-scrolling through `ScrollSmoother` to preserve uninterrupted hero video loading. On card hover, `completed_image` smoothly overlays `image` only when `isCompleted` is true.
