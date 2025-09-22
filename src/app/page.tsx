"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      
      setScrollProgress(scrollPercent);
      
      if (scrollTop > 50) {
        setIsScrolled(true);
        setTimeout(() => {
          setShowContent(true);
        }, 500); // Small delay for smooth transition
      } else {
        setIsScrolled(false);
        setShowContent(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen w-screen bg-black relative overflow-x-hidden">
      {/* Custom Glassmorphism Scrollbar */}
      <div className="fixed top-0 right-4 h-full w-4 z-30 flex items-center">
        <div className="relative h-3/4 w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
          <div 
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-sm rounded-full transition-all duration-150 ease-out"
            style={{ height: `${Math.max(scrollProgress * 100, 5)}%` }}
          ></div>
        </div>
      </div>

      {/* IEDC Logo - Fixed position, transitions independently */}
      <div className={`fixed z-25 transition-all duration-1000 ease-in-out ${
        isScrolled 
          ? 'top-6 left-6' 
          : 'top-6 left-6'
      }`}>
        <Image
          src="/iedclogo.webp"
          alt="IEDC Logo"
          width={80}
          height={80}
          className="opacity-90"
        />
      </div>

      {/* Evolvia Logo - Fixed position, transitions independently */}
      <div className={`fixed z-25 transition-all duration-1000 ease-in-out ${
        isScrolled 
          ? 'top-6 left-1/2 -translate-x-1/2 scale-40' 
          : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100'
      }`}>
        <Image
          src="/logo.webp"
          alt="Evolvia"
          width={300}
          height={300}
          className="opacity-95"
        />
      </div>

      {/* Hero Section with Video Background */}
      <section className={`h-screen w-screen relative transition-all duration-1000 ease-in-out ${isScrolled ? '-translate-y-full' : ''}`}>
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for better visibility */}
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

      {/* Transparent Navigation Bar - Just provides spacing */}
      <nav className={`fixed top-0 left-0 right-0 z-15 transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Spacer for IEDC logo (logo transitions here from hero) */}
          <div className="w-[40px] h-[40px]"></div>
          
          {/* Spacer for Evolvia logo (logo transitions here from hero) */}
          <div className="w-[120px] h-[120px]"></div>
          
          <div className="w-10"></div> {/* Right spacer for balance */}
        </div>
      </nav>

      {/* Main Content - Appears after video */}
      <div className={`transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {/* Content sections can be added here later */}
        <section className="min-h-screen pt-20 bg-black">
          {/* Placeholder for future content */}
        </section>
      </div>
    </main>
  );
}
