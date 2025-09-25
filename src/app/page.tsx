"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Footer from '@/components/Footer';
import { preEvents, Events } from '@/components/eventLists'; // Make sure to import 'Events' for the main events section
import FullScreenSection from '@/components/FullScreenSection';

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track real mouse and smooth cursor separately
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const totalSections = 4; // Hero, FullScreen, Pre, Main, Footer

  const handleScroll = useCallback((e: WheelEvent) => {
    if (isTransitioning) return;
    e.preventDefault();
    setIsTransitioning(true);
    const direction = e.deltaY > 0 ? 1 : -1;
    const newSection = Math.max(0, Math.min(totalSections - 1, currentSection + direction));
    if (newSection !== currentSection) {
      setCurrentSection(newSection);
    }
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  }, [currentSection, isTransitioning, totalSections]);

  useEffect(() => {
    let touchStartY = 0;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === 'ArrowDown' && currentSection < totalSections - 1) {
        setIsTransitioning(true);
        setCurrentSection(prev => prev + 1);
        setTimeout(() => setIsTransitioning(false), 1500);
      } else if (e.key === 'ArrowUp' && currentSection > 0) {
        setIsTransitioning(true);
        setCurrentSection(prev => prev - 1);
        setTimeout(() => setIsTransitioning(false), 1500);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const threshold = 50;
      if (Math.abs(deltaY) > threshold) {
        setIsTransitioning(true);
        if (deltaY > 0 && currentSection < totalSections - 1) {
          setCurrentSection(prev => prev + 1);
        } else if (deltaY < 0 && currentSection > 0) {
          setCurrentSection(prev => prev - 1);
        }
        setTimeout(() => setIsTransitioning(false), 1500);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleScroll, currentSection, isTransitioning, totalSections]);

  // Smooth cursor animation
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setCursorPosition(prev => {
        const dx = mousePosition.x - prev.x;
        const dy = mousePosition.y - prev.y;
        return {
          x: prev.x + dx * 0.1,
          y: prev.y + dy * 0.1,
        };
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [mousePosition]);

  return (
    <main className="h-screen w-screen bg-black relative overflow-hidden cursor-none">
      {/* Custom Smooth Cursor */}
      <div
        className="fixed pointer-events-none z-50 w-10 h-10 bg-white rounded-full"
        style={{
          left: cursorPosition.x - 16,
          top: cursorPosition.y - 16,
          mixBlendMode: 'exclusion',
          transition: "transform 0.05s linear",
        }}
      />

      {/* Custom Glassmorphism Scrollbar */}
      <div className="fixed top-0 right-4 h-full w-4 z-30 items-center hidden md:flex">
        <div className="relative h-3/4 w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
          <div 
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-sm rounded-full transition-all duration-1500 ease-out"
            style={{ height: `${Math.max(((currentSection + 1) / totalSections) * 100, 8)}%` }}
          ></div>
        </div>
      </div>

      {/* IEDC Logo */}
      <div className={`fixed z-25 transition-all duration-1500 ease-in-out ${
        currentSection === 0 
          ? 'top-6 left-6' 
          : 'top-12 left-12 hidden md:block'
      }`} style={{ willChange: 'transform, opacity' }}>
        <Image
          src="/iedclogo.webp"
          alt="IEDC Logo"
          width={80}
          height={80}
          className="opacity-90"
        />
      </div>

      {/* Evolvia Logo */}
      <div className={`fixed z-25 transition-all duration-1500 ease-in-out ${
        currentSection === 0 
          ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100' 
          : 'top-4 left-1/2 -translate-x-1/2 scale-40'
      }`} style={{ willChange: 'transform' }}>
        <Image
          src="/logo.webp"
          alt="Evolvia"
          width={400}
          height={400}
          className="opacity-95"
        />
      </div>

      {/* Sections Container */}
      <div 
        className="h-full transition-transform duration-1500 ease-in-out"
        style={{ 
          transform: `translateY(-${currentSection * 100}vh)`,
          willChange: 'transform'
        }}
      >
        {/* Section 0: Hero */}
        <section className="h-screen w-screen relative flex items-center justify-center" style={{ willChange: 'transform' }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover bg"
            style={{ willChange: 'auto' }}
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
            <div className="flex flex-col items-center text-white/70">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: FullScreenSection Component */}
        <section className="h-screen w-screen bg-black relative flex items-center" style={{ willChange: 'transform' }}>
          <div className="max-w-6xl mx-auto px-6 w-full">
            <FullScreenSection/>
          </div>
        </section>
        
        {/* Section 2: Pre Events */}
        <section className="h-screen w-screen bg-black relative flex items-center py-10" style={{ willChange: 'transform' }}>
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="mb-12">
              <h2 className="text-6xl lg:text-8xl font-bold text-white tracking-tight">
                Pre Events.
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-white to-transparent mt-4"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {preEvents.map((event, index) => (
                <div
                  key={index}
                  className="group cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={event.image}
                      alt={event.name}
                      width={400}
                      height={300}
                      className="w-full h-70 md:h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                    {event.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Section 4: Footer - THE FIX */}
        <section className="h-screen w-screen bg-black flex flex-col items-center justify-end">
          <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-tight mb-24">
                Coming Soon...
          </h2>
          <Footer />
        </section>
      </div>
    </main>
  );
}