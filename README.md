# Evolvia

The flagship event management platform for IEDC (Innovation and Entrepreneurship Development Cell) featuring a space/astro theme.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## Features

- Built with Next.js 15, React 19, and TypeScript
- Space-themed design with glassmorphism effects
- Responsive design for all devices
- Event management with dynamic routing
- Three.js integration for 3D graphics
- Optimized with Turbopack for fast builds

## Tech Stack

### Core Framework
- Next.js 15 - React framework with App Router
- React 19 - Latest React with concurrent features
- TypeScript - Type-safe development

### Styling & UI
- Tailwind CSS v4 - Utility-first CSS framework
- Framer Motion - Production-ready motion library
- GSAP - Professional-grade animation library
- Inter Tight - Modern typography

### 3D Graphics
- Three.js - 3D graphics library
- @react-three/fiber - React renderer for Three.js
- @react-three/drei - Useful helpers for react-three-fiber

## Project Structure

```
evolvia/
├── public/                    # Static assets
│   ├── frames/               # Animation frames
│   ├── *.webp               # Optimized images
│   └── *.svg                # Vector graphics
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   └── components/          # Reusable components
│       ├── eventLists.tsx   # Event data and filtering
│       ├── EventsPage.tsx   # Event display component
│       ├── Footer.tsx       # Footer component
│       ├── FullScreenSection.tsx  # Layout component
│       └── preEventpage.tsx # Pre-event page component
```

## Getting Started

### Live Demo
Visit the live application at: https://evolvia.iedccev.org/

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/iedc-cev-org/evolvia.git
   cd evolvia
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start development server
   ```bash
   npm run dev
   ```

4. Open your browser
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Event Management

Evolvia supports various event types through dynamic routing:

- Buzzer Quiz - Interactive quiz competitions
- Vibe Coding - Programming challenges
- Workshops - Educational sessions

Events are managed through the centralized `eventLists.tsx` with type-safe filtering and routing.

## Design System

### Theme
- Color Scheme: Dark cosmic theme with automatic light/dark mode
- Typography: Inter Tight font family for modern aesthetics
- Layout: Full-screen immersive experiences
- Effects: Glassmorphism with `bg-white/10 backdrop-blur-md`

### Responsive Breakpoints
- Mobile-first approach
- Consistent spacing patterns (`p-4`, `py-6`, `space-y-2`)
- Container centering with `max-w-6xl mx-auto`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

## About IEDC

The Innovation and Entrepreneurship Development Cell (IEDC) fosters innovation and entrepreneurship among students, providing a platform for creative minds to transform ideas into reality.

---

<p align="center">
  <strong>Built with ❤️ by the IEDC team</strong>
</p>