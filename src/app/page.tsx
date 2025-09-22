"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Footer from '@/components/Footer'
import { preEvents } from '@/components/eventLists'

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight);
      
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
      {/* Custom Glassmorphism Scrollbar - Hidden on mobile */}
      <div className="fixed top-0 right-4 h-full w-4 z-30 items-center hidden md:flex">
        <div className="relative h-3/4 w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
          <div 
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-sm rounded-full transition-all duration-150 ease-out"
            style={{ height: `${Math.max(scrollProgress * 100, 5)}%` }}
          ></div>
        </div>
      </div>

      {/* IEDC Logo - Fixed position, transitions independently, hidden on mobile after scroll */}
      <div className={`fixed z-25 transition-all duration-1000 ease-in-out ${
        isScrolled 
          ? 'top-12 left-12 hidden md:block' 
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
          ? 'top-4 left-1/2 -translate-x-1/2 scale-40' 
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
      <section className={`h-screen w-screen relative transition-all duration-1000 ease-in-out  ${isScrolled ? '-translate-y-full' : ''}`}>
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover bg"
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
      <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        {/* Pre Events Section */}
        <section className="bg-black relative py-16">
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            {/* Section Title - Left Aligned */}
            <div className={`mb-16 transition-all duration-1000 delay-300 ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="text-6xl lg:text-8xl font-bold text-white tracking-tight ">
                Pre &nbsp;Events.
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-white to-transparent mt-4"></div>
            </div>

            {/* Events Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-16">
              {preEvents.map((event, index) => (
                <div
                  key={index}
                  className={`group cursor-pointer hover:scale-105 transition-all duration-300 ${
                    showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ 
                    transitionDelay: showContent ? `${600 + index * 150}ms` : '0ms' 
                  }}
                >
                  {/* Event Image */}
                  <div className="mb-4 overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.name}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Event Name */}
                  <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                    {event.name}
                  </h3>
                </div>
              ))}
            </div>
            </div>
        </section>
      </div>
      <Footer/>
    </main>
  );
}
