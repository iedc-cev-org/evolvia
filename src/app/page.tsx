"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import AnimatedReveal from '@/components/AnimatedReveal';
import Footer from '@/components/Footer';
import { preEvents,Events } from '@/components/eventLists';
import FullScreenSection from '@/components/FullScreenSection';
import PinnedEventsSection from '@/components/PinnedEventsSection';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function Home() {

  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  // Track real mouse and smooth cursor separately
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  // Ref removed: using AnimatedTitle component instead

  useEffect(() => {
    setIsClient(true);
    setWindowHeight(window.innerHeight);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
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

  // ScrollSmoother initialization after video ready
  useEffect(() => {
    if (!videoReady) return;
    const scrollSmoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: true,
      smoothTouch: 0.1,
    });
    return () => {
      scrollSmoother?.kill();
      ScrollTrigger.killAll();
    };
  }, [videoReady]);

  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v) return;
    const onReady = () => setVideoReady(true);
    if (v.readyState >= 3) setVideoReady(true);
    v.addEventListener('canplaythrough', onReady, { once: true });
    v.addEventListener('loadeddata', onReady, { once: true });
    return () => {
      v.removeEventListener('canplaythrough', onReady);
      v.removeEventListener('loadeddata', onReady);
    };
  }, []);

  
  
  return (
  <div id="smooth-wrapper" className={`fixed top-0 left-0 w-full h-full overflow-hidden ${!videoReady ? 'pointer-events-none select-none' : ''}`}>
      
      {/* Custom Smooth Cursor */}
      <div
        className="fixed pointer-events-none z-50 w-10 h-10 bg-white rounded-full hidden md:block"
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
          : 'top-2 left-1/2 -translate-x-1/2 -translate-y-1/3 scale-40'
      }`} style={{ 
        willChange: 'transform',
        mixBlendMode: scrollY >= 100 ? 'exclusion' : 'normal'
      }}>
        <div className="relative w-[200px] h-[200px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px]">
          <Image
            src="/logo.webp"
            alt="Evolvia"
            fill
            sizes="(max-width: 768px) 260px, (max-width: 1024px) 360px, 400px"
            className={`object-contain opacity-95 select-none z-0 ${!videoReady ? 'loader-logo' : ''}`}
            priority
          />
          {!videoReady && (
            <div className="absolute inset-0 shimmer shimmer-mask-logo z-10" />
          )}
        </div>
      </div>

      {/* Block interactions until video is ready */}
      {!videoReady && (
        <div className="fixed inset-0 z-[30]" />
      )}
      <div id="smooth-content">
        <main className="min-h-screen w-screen bg-black relative cursor-none">

      {/* Sections Container */}
      <div className="w-full"
      >
        {/* Section 0: Hero */}
        <section className="h-screen w-screen relative flex items-center justify-center" style={{ willChange: 'transform' }}>
          <video
            ref={heroVideoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover bg transition-opacity duration-700"
            style={{ willChange: 'auto', opacity: videoReady ? 1 : 0 }}
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
          <FullScreenSection>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-start z-20">
              <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 w-full">
                <div 
                  className="text-left"
                  style={{
                    transform: isClient ? `translateY(${Math.max(0, (scrollY - windowHeight) * 0.3)}px)` : 'none',
                    opacity: isClient ? Math.max(0, Math.min(1, (scrollY - windowHeight * 0.5) * 0.002)) : 1,
                  }}
                >
                  <div className="leading-none">
                    <AnimatedReveal
                      text="TECHNO"
                      as="h1"
                      className="text-[2.2em] md:text-8xl lg:text-9xl font-bold text-white tracking-tighter"
                      mode="scrub"
                      start="top 85%"
                      end="+=300"
                      split="chars"
                    />
                    <AnimatedReveal
                      text="ENTREPRENEURSHIP"
                      as="h2"
                      className="text-[2.2em] md:text-8xl lg:text-9xl font-bold text-white tracking-tighter"
                      mode="scrub"
                      start="top 85%"
                      end="+=300"
                      split="chars"
                    />
                    <AnimatedReveal
                      text="FEST/"
                      as="h2"
                      className="text-[2.8em] md:text-7xl lg:text-8xl font-bold text-white tracking-tighter"
                      mode="scrub"
                      start="top 85%"
                      end="+=300"
                      split="chars"
                    />
                  </div>
                  <div className="mt-8 max-w-2xl">
                    <AnimatedReveal
                      text="Join the ultimate celebration of entrepreneurship and technology at IEDC's flagship event"
                      as="p"
                      className="text-xl md:text-2xl lg:text-3xl text-white/90"
                      mode="scrub"
                      start="top 90%"
                      end="+=250"
                      stagger={0.035}
                      duration={0.5}
                      initialYOffset={14}
                      split="words"
                    />
                  </div>
                </div>
              </div>
            </div>
          </FullScreenSection>
        </section>
        
        {/* Section 2: Pinned Events Section */}
        <PinnedEventsSection events={Events} />
        
        {/* Section 3: Pre Events */}
        <section className="w-screen bg-black relative flex flex-col items-center py-14 mb-10" style={{ willChange: 'transform' }}>

          {/*Pre Events only*/}
          <div className="max-w-6xl mx-auto px-6 w-full pt-10">
            <div className="mb-12">
              <AnimatedReveal
                text="Pre Events."
                as="h2"
                className="text-6xl lg:text-7xl font-semibold text-white tracking-tight"
                split="chars"
              />
              <div className="w-32 h-1 bg-gradient-to-r from-white to-transparent mt-4"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {preEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: [0.25, 0.25, 0, 1]
                  }}
                  className="group cursor-pointer"
                >
                  <motion.div 
                    className="mb-4 overflow-hidden rounded-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 1.02 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={event.image}
                        alt={event.name}
                        width={400}
                        height={300}
                        className="w-full h-full md:h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
                        style={{
                          filter: 'grayscale(100%)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.filter = 'grayscale(0%)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.filter = 'grayscale(100%)';
                        }}
                        onTouchStart={(e) => {
                          if (e.currentTarget) {
                            e.currentTarget.style.filter = 'grayscale(0%)';
                          }
                        }}
                        onTouchEnd={(e) => {
                          const target = e.currentTarget;
                          if (target) {
                            setTimeout(() => {
                              if (target && target.style) {
                                target.style.filter = 'grayscale(100%)';
                              }
                            }, 1500);
                          }
                        }}
                      />
                    </motion.div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors duration-300">
                    {event.name}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Section 4: Footer */}
        <section className="w-screen bg-black my-16">
          <Footer />
        </section>
      </div>
        </main>
      </div>
    </div>
  );
}