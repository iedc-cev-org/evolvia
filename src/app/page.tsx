"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import AnimatedReveal from '@/components/AnimatedReveal';
import Footer from '@/components/Footer';
import { preEvents, Events, StallsAndExpos, Speakers, Sponsors } from '@/components/eventLists';
import FullScreenSection from '@/components/ScrollVideo';
import PinnedEventsSection from '@/components/PinnedEventsSection';
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function Home() {

  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const stallsSectionRef = useRef<HTMLDivElement | null>(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hashEventIndex, setHashEventIndex] = useState<number | null>(null);
  const [showJumpButton, setShowJumpButton] = useState(false);
  
  const reorderedEvents = useMemo(() => {
    if (hashEventIndex === null || hashEventIndex < 0 || hashEventIndex >= Events.length) {
      return Events;
    }
    const targetEvent = Events[hashEventIndex];
    const otherEvents = Events.filter((_, idx) => idx !== hashEventIndex);
    return [targetEvent, ...otherEvents];
  }, [hashEventIndex]);

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#e(\d+)$/);
      if (match) {
        const eventIndex = parseInt(match[1]) - 1;
        if (eventIndex >= 0 && eventIndex < Events.length) {
          setHashEventIndex(eventIndex);
          setShowJumpButton(true);
        }
      }
    };

    checkHash();
    
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  useEffect(() => {
    if (showJumpButton && scrollY > windowHeight * 2) {
      setShowJumpButton(false);
    }
  }, [scrollY, windowHeight, showJumpButton]);

  const handleJumpToEvent = () => {
    const eventsSection = document.querySelector('#events-section');
    if (eventsSection) {
      const rect = eventsSection.getBoundingClientRect();
      const targetScrollTop = window.scrollY + rect.top;
      
      window.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
      
      setTimeout(() => setShowJumpButton(false), 1000);
    }
  };
  
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

  useEffect(() => {
    if (!isClient || !stallsSectionRef.current) return;

    const section = stallsSectionRef.current;
    const cards = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('.stall-card'));
    if (!cards.length) return;


    // Start cards off-screen at bottom
    gsap.set(cards, { y: window.innerHeight * 0.7, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + (cards.length * 220 + 400),
        pin: true,
        pinSpacing: true,
        scrub: true,
      },
    });

    tl.to(cards, {
      y: (i) => 0,
      opacity: 1,
      ease: 'power2.out',
      stagger: { each: 0.18 },
    });

    ScrollTrigger.refresh();

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [isClient, videoReady]);

  
  
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`fixed z-25 transition-all duration-1500 ease-in-out ${
        scrollY < 100 
          ? 'top-6 left-6' 
          : 'top-12 left-12 hidden md:block'
      }`} style={{ willChange: 'transform, opacity' }}>
        <Image
          src="/page-assets/iedclogo.webp"
          alt="IEDC Logo"
          width={80}
          height={80}
          className="opacity-90"
        />
    </motion.div>

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
            src="/page-assets/logo.webp"
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
        
        {showJumpButton && scrollY < 100 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={handleJumpToEvent}
            className="absolute -bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white text-sm md:text-base font-medium hover:bg-white/20 transition-all duration-300 shadow-lg inline-flex items-center gap-2 whitespace-nowrap"
          >
            Jump to Event
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </motion.button>
        )}
      </div>
      <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed top-4 right-4 md:top-6 md:right-6 z-30 transition-all duration-1500 ease-in-out">
        <Link href="/map" aria-label="Go to Map Page">
            <button
            className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2 1,6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
            Map
            </button>
        </Link>
      </motion.div>
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
            <source src="/page-assets/hero.mp4" type="video/mp4" />
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

        <section id="events-section">
        <PinnedEventsSection events={reorderedEvents} />
        </section>
        {/* Section 3: Stalls and Expos */}
        <section ref={stallsSectionRef} className="w-screen bg-black relative flex flex-col items-center py-20" style={{ willChange: 'transform' }}>
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-12">
              <div className="space-y-6 max-w-3xl">
                <AnimatedReveal
                  text="Stalls & Expos."
                  as="h2"
                  className="text-6xl lg:text-7xl font-semibold text-white tracking-tight"
                  split="chars"
                />
                <AnimatedReveal
                  text="Experience the innovators shaping the future of automation, robotics, and tech culture."
                  as="p"
                  className="text-lg lg:text-xl text-white/70"
                  split="words"
                  stagger={0.04}
                  duration={0.6}
                  initialYOffset={16}
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
                className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white/80 backdrop-blur-md"
              >
                <span className="inline-flex h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                <span className="text-sm uppercase tracking-[0.3em]">On Floor Showcase</span>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {StallsAndExpos.map((stall, index) => (
                <article
                  key={stall.name}
                  className="stall-card relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg group"
                  style={{ willChange: 'transform' }}
                >
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={stall.image}
                      alt={stall.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 420px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-6 space-y-3">
                      <h3 className="text-2xl font-semibold text-white">{stall.name}</h3>
                      <p className="text-sm text-white/70 leading-relaxed">{stall.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        {/* Section 4: Pre Events */}
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
                    className="mb-4 overflow-hidden rounded-sm relative"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 1.02 }}
                      transition={{ duration: 0.5 }}
                    >
                        {event.isCompleted && (
                          <div className="absolute z-20 left-3 top-3 px-2 py-1 bg-white/10 text-white text-xs rounded-sm backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                            Completed
                          </div>
                        )}
                      <div className="relative w-full h-full">
                        <Image
                          src={event.image}
                          alt={event.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover transition-opacity duration-500 ease-out group-hover:opacity-0 grayscale"
                        />
                        {event.completed_image && (
                          <Image
                            src={event.completed_image}
                            alt={`${event.name} (completed)`}
                            width={400}
                            height={300}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none z-10"
                            style={{ top: 0, left: 0 }}
                          />
                        )}
                      </div>
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
        {/* Section 5: Speakers */}
        <section className="w-screen bg-black relative flex flex-col items-center py-14 mb-10" style={{ willChange: 'transform' }}>
          <div className="max-w-6xl mx-auto px-6 w-full pt-10">
            <div className="mb-12">
              <AnimatedReveal
                text="Our Speakers."
                as="h2"
                className="text-6xl lg:text-7xl font-semibold text-white tracking-tight"
                split="chars"
              />
              <div className="w-32 h-1 bg-gradient-to-r from-white to-transparent mt-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Speakers.map((speaker, index) => (
                <motion.div
                  key={speaker.name}
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
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg"
                >
                  <div className="relative h-96 overflow-hidden">
                    <Image
                      src={speaker.image}
                      alt={speaker.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-6 space-y-2">
                      <h3 className="text-3xl font-semibold text-white">{speaker.name}</h3>
                      <p className="text-base text-white/80">{speaker.designation}</p>
                      <p className="text-sm text-white/60">{speaker.expertise}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Sponsors */}
        <section className="w-screen bg-black relative flex flex-col items-center py-14 mb-10" style={{ willChange: 'transform' }}>
          <div className="max-w-6xl mx-auto px-6 w-full pt-10">
            <div className="mb-12 text-center">
              <AnimatedReveal
                text="Our Sponsors."
                as="h2"
                className="text-6xl lg:text-7xl font-semibold text-white tracking-tight"
                split="chars"
              />
              <div className="w-32 h-1 bg-gradient-to-r from-white to-transparent mt-4 mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 bg-amber-50/5 p-4 sm:p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-md">
              {Sponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.name}
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
                  className="flex items-center justify-center bg-white/5 rounded-xl p-2 sm:p-4 md:p-6 h-28 sm:h-32 md:h-40 lg:h-44"
                >
                  <Image
                    src={sponsor.image}
                    alt={sponsor.name}
                    width={200}
                    height={80}
                    className="object-contain w-full h-full max-h-20 sm:max-h-24 md:max-h-32 lg:max-h-36 transition-opacity duration-500 ease-out"
                    style={{ background: 'transparent' }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Section 7: Footer */}
        <section className="w-screen bg-black my-16">
          <Footer />
        </section>
      </div>
        </main>
      </div>
    </div>
  );
}