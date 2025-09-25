"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Footer from '@/components/Footer'
import { preEvents, Events } from '@/components/eventLists'
import FullScreenSection from '@/components/FullScreenSection'

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const totalSections = 3;//4; // Hero, Pre-Events, Main Events, Footer

  const handleScroll = useCallback((e: WheelEvent) => {
    if (isTransitioning) return;
    
    e.preventDefault();
    setIsTransitioning(true);
    
    const direction = e.deltaY > 0 ? 1 : -1;
    const newSection = Math.max(0, Math.min(totalSections - 1, currentSection + direction));
    
    if (newSection !== currentSection) {
      setCurrentSection(newSection);
    }
    
    // Reset transition lock after animation completes (increased for smoother transitions)
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  }, [currentSection, isTransitioning, totalSections]);

  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;
    
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
      
      touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const threshold = 50; // Minimum swipe distance
      
      if (Math.abs(deltaY) > threshold) {
        setIsTransitioning(true);
        
        if (deltaY > 0 && currentSection < totalSections - 1) {
          // Swipe up - go to next section
          setCurrentSection(prev => prev + 1);
        } else if (deltaY < 0 && currentSection > 0) {
          // Swipe down - go to previous section
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

  return (
    <main className="h-screen w-screen bg-black relative overflow-hidden">
      {/* Simple Buttery Smooth Cursor */}
      <div
        className="fixed pointer-events-none z-50 w-10 h-10 bg-white rounded-full transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          mixBlendMode: 'exclusion',
          willChange: 'transform',
        }}
      />

      {/* Custom Glassmorphism Scrollbar - Shows progress through sections */}
      <div className="fixed top-0 right-4 h-full w-4 z-30 items-center hidden md:flex">
        <div className="relative h-3/4 w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
          <div 
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-sm rounded-full transition-all duration-1500 ease-out"
            style={{ height: `${Math.max(((currentSection + 1) / totalSections) * 100, 8)}%` }}
          ></div>
        </div>
      </div>

      {/* IEDC Logo - Fixed position, transitions based on current section */}
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

      {/* Evolvia Logo - Transitions from hero center to navbar */}
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
          {/* Background Video */}
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

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
            <div className="flex flex-col items-center text-white/70">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

         <section className="h-screen w-screen bg-black relative flex items-center" style={{ willChange: 'transform' }}>
          <div className="max-w-6xl mx-auto px-6 w-full">
            <FullScreenSection/>
          </div>
        </section>
        
        {/* Section 1: Pre Events */}
        <section className="h-screen w-screen bg-black relative flex items-center" style={{ willChange: 'transform' }}>
          <div className="max-w-6xl mx-auto px-6 w-full">
            {/* Section Title */}
            <div className="mb-12">
              <h2 className="text-6xl lg:text-8xl font-bold text-white tracking-tight">
                Pre Events.
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-white to-transparent mt-4"></div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
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
        
        {/* Section 2: Main Events 
        <section className="h-screen w-screen bg-black relative flex items-center" style={{ willChange: 'transform' }}>
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="mb-12">
              <h2 className="text-6xl lg:text-8xl font-bold text-white tracking-tight">
                Main Events.
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-white to-transparent mt-4"></div>
            </div>

            <div className="space-y-8">
              {Events.map((event, index) => (
                <div
                  key={index}
                  className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-white mb-2">
                        {event.name}
                      </h3>
                      <p className="text-white/70 mb-2">{event.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-white/60">
                        <span>⏰ {event.time}</span>
                        <span>📍 {event.venue}</span>
                        {event.payStatus !== undefined && (
                          <span className={`px-2 py-1 rounded ${
                            event.payStatus ? 'bg-red-600/20 text-red-400' : 'bg-green-600/20 text-green-400'
                          }`}>
                            {event.payStatus ? 'Paid' : 'Free'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <button className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        event.type === 'buzzerQuiz' ? 'bg-red-600 hover:bg-red-700' :
                        event.type === 'vibeCoding' ? 'bg-blue-600 hover:bg-blue-700' :
                        'bg-green-600 hover:bg-green-700'
                      } text-white`}>
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        */}
        {/* Section 3: Footer */}
        <section className="h-screen w-screen bg-black relative flex items-center justify-center" style={{ willChange: 'transform' }}>
          <Footer />
        </section>
      </div>
    </main>
  );
}
