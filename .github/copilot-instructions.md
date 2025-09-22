# Copilot Instructions for Evolvia

## Project Overview
Evolvia is the flagship event management platform for IEDC (Innovation and Entrepreneurship Development Cell), featuring a **space/astro theme**. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4, it showcases modern web technologies with Three.js integration capabilities to create an immersive cosmic experience.

## Architecture & Key Patterns

### Next.js App Router Structure
- Uses Next.js 15 App Router with TypeScript
- Route structure: `src/app/[events]/page.tsx` for dynamic event routing
- Dynamic routes accept event type parameters (`buzzerQuiz`, `vibeCoding`, `workShop`)
- Path alias: `@/*` maps to `./src/*` for clean imports

### Component Organization
- **Components**: Place reusable components in `src/components/`
- **Data Layer**: Event data and filtering logic in `src/components/eventLists.tsx`
- **Type Safety**: All components use TypeScript with strict mode enabled

### Styling Conventions
- **Tailwind CSS v4** with inline theme configuration in `globals.css`
- **Space/Astro Theme**: Dark cosmic backgrounds with stellar visual elements
- **Design System**: Glassmorphism effects using `bg-white/10 backdrop-blur-md border border-white/20` for futuristic UI
- **Typography**: Geist font family (sans and mono variants) for clean, modern space-age aesthetics
- **Color Scheme**: Dark theme (`bg-black`) with automatic light/dark mode switching
- **Layout**: Full-screen layouts (`h-screen w-screen`) creating immersive space environments

### Event System Pattern
```tsx
// Event data structure in src/components/eventLists.tsx
interface Event {
  name: string;
  time: string;
  venue: string;
  type: string; // Used for routing
  description: string;
  payStatus?: boolean;
}

// Filtering pattern
export function getEventsByType(type: string) {
  return Events.filter(event => event.type === type);
}
```

### Responsive Design Pattern
- Mobile-first approach with responsive classes (`lg:py-6`, `lg:py-4`)
- Container pattern: `max-w-6xl mx-auto` for content centering
- Image handling: Use Next.js `Image` component with proper sizing

## Development Workflow

### Build & Development
- **Development**: `npm run dev --turbopack` (Turbopack enabled for faster builds)
- **Build**: `npm run build --turbopack`
- **Linting**: `eslint` with Next.js TypeScript config

### Key Dependencies
- **3D Graphics**: `@react-three/fiber` and `@react-three/drei` for Three.js integration (space/cosmic visuals)
- **Styling**: Tailwind CSS v4 with PostCSS integration
- **Framework**: Next.js 15 with React 19

## Coding Standards

### TypeScript Usage
- Strict TypeScript configuration with ES2017 target
- Proper typing for props: `{ params }: { params: { events: string } }`
- Use type imports: `import type { Metadata } from "next"`

### Component Patterns
1. **Page Components**: Export default function with PascalCase naming
2. **Server Components**: Default for pages, use client components only when needed
3. **Image Optimization**: Always use `next/image` with proper alt attributes
4. **Layout Structure**: Consistent header with dual logos (main logo + IEDC logo)

### Styling Guidelines
- Use semantic color classes: `bg-red-600`, `bg-blue-600`, `bg-green-600` for event type buttons
- Consistent spacing: `p-4`, `py-6`, `space-y-2` patterns
- Glass morphism cards for content display
- White text on dark backgrounds with opacity modifiers for secondary text

## Project-Specific Conventions

### Event Type Routing
- Event types map directly to route parameters and filter logic
- Supported types: `buzzerQuiz`, `vibeCoding`, `workShop`
- Add new event types by extending the Events array and creating corresponding routes

### Asset Management
- Logos stored in `/public/`: `logo.webp` (main), `iedclogo.webp` (IEDC)
- Use WebP format for optimized images
- SVG icons for UI elements (`/public/*.svg`)

### UI Components
- Consistent button styling: `bg-white text-black px-6 py-4 rounded-sm`
- Card layouts use glassmorphism with consistent padding and border radius
- Responsive image containers with proper aspect ratios

When working on this project, prioritize maintaining the established design system, ensure TypeScript type safety, and follow the Next.js App Router patterns for any new features or routes.