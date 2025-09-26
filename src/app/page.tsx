"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Footer from '@/components/Footer';
import { preEvents } from '@/components/eventLists';
import FullScreenSection from '@/components/FullScreenSection';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  // Track real mouse and smooth cursor separately
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
    <main className="min-h-screen w-screen bg-black relative cursor-none">
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

      {/* IEDC Logo */}
      <div className={`fixed z-25 transition-all duration-1500 ease-in-out ${
        scrollY < 100 
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
        scrollY < 100 
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
      <div className="w-full"
      >
        {/* Section 0: Hero */}
        <section className="h-screen w-screen relative flex items-center justify-center" style={{ willChange: 'transform' }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
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