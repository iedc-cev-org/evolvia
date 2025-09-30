"use client";

import { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

interface Event {
  id: number;
  name: string;
  image: string;
  spec?: string;
  dateTime?: string;
  venue?: string;
  link?: string;
}

interface PinnedEventsSectionProps {
  events: Event[];
}

export default function PinnedEventsSection({ events }: PinnedEventsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const tensColRef = useRef<HTMLDivElement>(null);
  const onesColRef = useRef<HTMLDivElement>(null);
  const digitMeasureRef = useRef<HTMLSpanElement>(null);
  const lastDigitHeightRef = useRef<number>(0);
  const lastIndexRef = useRef<number>(0);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const revealedSetRef = useRef<Set<number>>(new Set());
  const [digitHeight, setDigitHeight] = useState(0);
  const revealTlRef = useRef<gsap.core.Timeline | null>(null);
  const sectionEnteredRef = useRef<boolean>(false);
  
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const playRevealForIndex = useCallback((idx: number) => {
    const el = cardRefs.current[idx];
    if (!el) return;
    revealTlRef.current?.kill();

    const image = el.querySelector('.ev-image') as HTMLElement | null;
    const title = el.querySelector('.ev-title') as HTMLElement | null;
    const spec = el.querySelector('.ev-spec') as HTMLElement | null;
  const cta = el.querySelector('.ev-cta') as HTMLElement | null;
  const meta = el.querySelector('.ev-meta') as HTMLElement | null;
    const shimmer = el.querySelector('.ev-shimmer') as HTMLElement | null;

    const removeInitialHideClasses = () => {
      el.classList.remove('opacity-0', 'translate-y-10', 'scale-95');
  if (image) image.classList.remove('opacity-0', 'translate-y-6');
  if (title) title.classList.remove('opacity-0', 'translate-y-6');
  if (spec) spec.classList.remove('opacity-0', 'translate-y-6');
  if (meta) meta.classList.remove('opacity-0', 'translate-y-6');
  if (cta) cta.classList.remove('opacity-0', 'translate-y-6');
    };

    if (title && !(title as HTMLElement).dataset.split) {
      const text = title.textContent || '';
      title.textContent = '';
      const frag = document.createDocumentFragment();
      // Split into words to prevent mid-word line breaks
      const words = text.split(' ');
      words.forEach((word, wi) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'ev-word inline-block';
        for (const ch of word) {
          const span = document.createElement('span');
          span.className = 'ev-char inline-block';
          span.textContent = ch;
          wordSpan.appendChild(span);
        }
        frag.appendChild(wordSpan);
        if (wi < words.length - 1) {
          frag.appendChild(document.createTextNode(' '));
        }
      });
      title.appendChild(frag);
      (title as HTMLElement).dataset.split = '1';
    }

    const chars = title ? (title.querySelectorAll('.ev-char') as NodeListOf<HTMLElement>) : ([] as unknown as NodeListOf<HTMLElement>);

    if (image || title || spec || cta) {
      if (revealedSetRef.current.has(idx)) {
        // Ensure fully visible and remove initial hide classes
        gsap.set(el, { clearProps: 'opacity,transform' });
        el.classList.remove('opacity-0', 'translate-y-10', 'scale-95');
  gsap.set([image, spec, meta, cta].filter(Boolean) as HTMLElement[], { opacity: 1, clearProps: 'y,scale' });
        if (title) gsap.set(title, { opacity: 1, clearProps: 'y' });
        if (chars && chars.length) gsap.set(chars, { opacity: 1, clearProps: 'y' });
        const shimmerEl = el.querySelector('.ev-shimmer') as HTMLElement | null;
        if (shimmerEl) gsap.set(shimmerEl, { opacity: 0, clearProps: 'xPercent' });
        removeInitialHideClasses();
        return;
      }

  // Initial setup - everything (including card wrapper) hidden and positioned
  gsap.set(el, { autoAlpha: 0, y: 20, scale: 0.95 });
  gsap.set([image, spec, meta, cta].filter(Boolean) as HTMLElement[], { opacity: 0, y: 20 });
  if (chars && chars.length) gsap.set(chars, { opacity: 0, y: 16 });
  if (image) gsap.set(image, { y: 16, scale: 0.98 });
      if (title) gsap.set(title, { opacity: 1, y: 0 });
      if (shimmer) gsap.set(shimmer, { xPercent: -120, opacity: 0 });

      const tl = gsap.timeline();
      
      // Step 1: Reveal card background (0.0s - 0.35s)
      tl.to(el, { 
        autoAlpha: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.35, 
        ease: 'power2.out' 
      }, 0)
      
      // Step 2: Reveal image and title text (0.1s - 0.6s)
      .to(image, { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.5, 
        ease: 'power3.out' 
      }, 0.15)
      .to(chars, { 
        opacity: 1, 
        y: 0, 
        duration: 0.45, 
        ease: 'power3.out', 
        stagger: 0.025 
      }, 0.2)
      
  // Step 3: Reveal subtitle and button (0.4s - 0.85s)
  .to([spec, meta, cta].filter(Boolean) as HTMLElement[], { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        ease: 'power3.out', 
        stagger: 0.1 
      }, 0.5)
      
  // Step 4: Shimmer effect overlaying everything (0.2s - 0.9s)
  .to(shimmer, { 
        xPercent: 240, 
        opacity: 0.4, 
        duration: 0.8, 
        ease: 'power2.out' 
      }, 0.3)
      .to(shimmer, { 
        opacity: 0, 
        duration: 0.25, 
        ease: 'power2.out' 
      }, '>-0.1');

      tl.eventCallback('onStart', () => {
        revealedSetRef.current.add(idx);
      });
      tl.eventCallback('onComplete', () => {
        revealedSetRef.current.add(idx);
        // Remove initial hide classes so it stays visible
        removeInitialHideClasses();
      });

      revealTlRef.current = tl;
    }
  }, []);

  // Function to scroll to a specific event index
  const scrollToEvent = useCallback((eventIndex: number) => {
    if (!containerRef.current) return;
    const targetIndex = Math.max(0, Math.min(eventIndex, events.length - 1));
    
    // Calculate the scroll position needed to show the target event
    const scrollProgress = events.length > 1 ? targetIndex / (events.length - 1) : 0;
    const totalScrollDistance = Math.max(0, (events.length - 1) * window.innerHeight);
    
    // Get the container's position and add the target scroll offset
    const containerTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    const targetScrollTop = containerTop + (scrollProgress * totalScrollDistance);
    
    // Update current event index immediately
    setCurrentEventIndex(targetIndex);
    lastIndexRef.current = targetIndex;
    
    // Trigger reveal animation for the target event
    setTimeout(() => playRevealForIndex(targetIndex), 100);
    
    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
  }, [events.length, playRevealForIndex]);

  // Handle URL hash changes for direct event access
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#e(\d+)$/);
      if (match) {
        const eventIndex = parseInt(match[1]) - 1; // Convert to 0-based index
        if (eventIndex >= 0 && eventIndex < events.length) {
          // Longer delay for initial page load, shorter for hash changes
          const delay = sectionEnteredRef.current ? 100 : 500;
          setTimeout(() => scrollToEvent(eventIndex), delay);
        }
      }
    };

    // Check initial hash on mount with longer delay for page load
    if (window.location.hash) {
      setTimeout(handleHashChange, 200);
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [events.length, scrollToEvent]);

  useEffect(() => {
    if (!digitMeasureRef.current) return;
    const updateHeight = () => {
      const h = digitMeasureRef.current?.offsetHeight || 0;
      if (h && h !== lastDigitHeightRef.current) {
        lastDigitHeightRef.current = h;
        setDigitHeight(h);
      }
      const display = lastIndexRef.current + 1;
      const tens = Math.floor(display / 10);
      const ones = display % 10;
      if (onesColRef.current) gsap.set(onesColRef.current, { y: -(h * ones) });
      if (tensColRef.current) gsap.set(tensColRef.current, { y: -(h * tens) });
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !eventsContainerRef.current) return;

    const container = containerRef.current;
    const eventsContainer = eventsContainerRef.current;

    // Main ScrollTrigger for the entire section
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: () => `+=${Math.max(0, (events.length - 1) * window.innerHeight)}`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const totalSlides = events.length;
        const progress = totalSlides > 1 ? self.progress : 0;

        // Continuous vertical movement based on scroll progress (in pixels)
  const maxShiftPx = (totalSlides - 1) * window.innerHeight;
  const translatePx = Math.max(-maxShiftPx, Math.min(0, -progress * maxShiftPx));
  gsap.set(eventsContainer, { y: translatePx });

        // Determine active index when the next panel is visibly entering (10% more below)
  const segment = progress * (totalSlides - 1);
  const base = Math.floor(segment);
  const frac = segment - base;
  const down = (self as unknown as ScrollTriggerType).direction >= 0;
  const threshold = down ? 0.75 : 0.25;
        let currentIndex = base + (frac >= threshold ? 1 : 0);
        currentIndex = Math.min(Math.max(currentIndex, 0), totalSlides - 1);

        if (currentIndex !== lastIndexRef.current) {
          setCurrentEventIndex(currentIndex);
          // Only update URL hash when we're actively in the pinned section
          if (sectionEnteredRef.current) {
            const newHash = `#e${currentIndex + 1}`;
            if (window.location.hash !== newHash) {
              history.replaceState(null, '', newHash);
            }
          }
          const display = currentIndex + 1; // 1-based display number
          const tens = Math.floor(display / 10);
          const ones = display % 10;
          if (digitHeight > 0) {
            if (onesColRef.current) {
              gsap.to(onesColRef.current, { y: -(digitHeight * ones), duration: 0.6, ease: 'power3.inOut', overwrite: 'auto' });
            }
            if (tensColRef.current) {
              gsap.to(tensColRef.current, { y: -(digitHeight * tens), duration: 0.6, ease: 'power3.inOut', overwrite: 'auto' });
            }
          }
          lastIndexRef.current = currentIndex;
        }
      },
      onEnter: () => {
        sectionEnteredRef.current = true;
        if (!revealedSetRef.current.has(0)) {
          // Kick off reveal for the first card when the section pins
          playRevealForIndex(0);
        }
      },
      onLeave: () => {
        // Add any leave animations here
      },
    });

    return () => {
      st.kill();
    };
  }, [events.length, digitHeight, playRevealForIndex]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const stFirst = ScrollTrigger.create({
      trigger: container,
      start: 'top 45%',
      onEnter: () => {
        if (!revealedSetRef.current.has(0)) {
          playRevealForIndex(0);
        }
        stFirst.kill();
      },
    });
    return () => {
      stFirst.kill();
    };
  }, [playRevealForIndex]);

  useLayoutEffect(() => {
    if (currentEventIndex === 0 && !sectionEnteredRef.current) return;
    playRevealForIndex(currentEventIndex);
  }, [currentEventIndex, playRevealForIndex]);

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen bg-black relative overflow-hidden"
    >
      {/* Left Panel - Fixed Counter */}
      <div 
        className="absolute left-0 top-0 w-1/5 md:w-2/5 lg:w-1/3 h-full flex flex-col justify-center items-center z-20"
      >
        <div className="text-center">
          {/* Large Counter with digit rollers */}
          <div className="relative text-[3rem] md:text-[8rem] lg:text-[10rem] xl:text-[12rem] font-mono font-bold text-white/90 leading-none select-none inline-flex items-stretch gap-1 md:gap-2">
            {/* Hidden measurer */}
            <span ref={digitMeasureRef} className="absolute opacity-0 pointer-events-none" aria-hidden>
              0
            </span>
            {/* Tens digit */}
            <div className="overflow-hidden" style={digitHeight ? { height: `${digitHeight}px` } : undefined}>
              <div ref={tensColRef}>
                {Array.from({ length: 10 }, (_, n) => (
                  <div key={`t-${n}`} className="leading-none">{n}</div>
                ))}
              </div>
            </div>
            {/* Ones digit */}
            <div className="overflow-hidden" style={digitHeight ? { height: `${digitHeight}px` } : undefined}>
              <div ref={onesColRef}>
                {Array.from({ length: 10 }, (_, n) => (
                  <div key={`o-${n}`} className="leading-none">{n}</div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Decorative Line */}
          <div className="w-16 md:w-32 h-0.5 bg-white/30 mx-auto mt-4 md:mt-8"></div>
          
          {/* Section Label */}
          <div className="text-white/60 text-sm md:text-2xl lg:text-3xl font-light tracking-wider mt-4 md:mt-8 uppercase">
            Ongoing Events
          </div>
          
          {/* Progress Indicator */}
          <div className="mt-6 md:mt-12 flex flex-col items-center">
            <div className="text-white/40 text-xs md:text-lg font-mono mb-2 md:mb-4">
              {String(currentEventIndex + 1).padStart(2, '0')} / {String(events.length).padStart(2, '0')}
            </div>
            <div className="w-1 h-16 md:h-32 bg-white/10 relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 w-full bg-white/60 transition-all duration-300 ease-out"
                style={{
                  height: `${((currentEventIndex + 1) / events.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Scrolling Events */}
      <div 
        className="absolute right-0 top-0 w-4/5 md:w-3/5 lg:w-2/3 h-full overflow-hidden"
      >
        <div 
          ref={eventsContainerRef}
          className="w-full"
          style={{ height: `${events.length * 100}vh` }}
        >
          {events.map((event, index) => (
            <div
              key={index}
              className="h-screen w-full flex items-center justify-center px-4 md:px-8 lg:px-10 xl:px-12 py-8 md:py-12 lg:py-14 xl:py-16 gap-4"
            >
              <motion.div
                ref={(el) => { cardRefs.current[index] = el; }}
                className="max-w-4xl w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-md shadow-xl p-4 md:p-6 lg:p-8 xl:p-10 opacity-0 translate-y-10 scale-95 will-change-transform"
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                onMouseMove={(e) => {
                  const el = cardRefs.current[index];
                  if (!el) return;
                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rx = ((y / rect.height) - 0.5) * -6;
                  const ry = ((x / rect.width) - 0.5) * 6;
                  const tiltOptions = { rotateX: rx, rotateY: ry, transformPerspective: 900, duration: 0.35, ease: 'power3.out' };
                  gsap.to(el, tiltOptions);
                }}
                onMouseLeave={() => {
                  const el = cardRefs.current[index];
                  if (!el) return;
                  const resetOptions = { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' };
                  gsap.to(el, resetOptions);
                }}
              >
                <div className="ev-tilt flex flex-col md:flex-row gap-4 md:gap-5 lg:gap-6 xl:gap-8 items-stretch will-change-transform">
                  <div className="ev-image relative w-full md:w-[44%] md:min-w-[44%] overflow-hidden rounded-sm opacity-0 translate-y-6 will-change-transform aspect-[3/4]">
                    <Image
                      src={event.image}
                      alt={event.name}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="ev-shimmer pointer-events-none absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-12" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0 overflow-hidden">
                    <div className="space-y-2 md:space-y-3 lg:space-y-4">
                      <h3 className="ev-title whitespace-normal break-normal text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight opacity-0 translate-y-6 will-change-transform">
                        {event.name}
                      </h3>
                      {event.spec && (
                        <p className="ev-spec text-white/70 text-base md:text-lg lg:text-xl italic opacity-0 translate-y-6 will-change-transform">
                          ({event.spec})
                        </p>
                      )}
                      {(event.dateTime || event.venue) && event.link && (
                        <div className="ev-meta flex flex-col gap-2 text-white/60 text-xs md:text-sm opacity-0 translate-y-6 will-change-transform">
                          {event.dateTime && (
                            <div className="inline-flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0" aria-hidden>
                                <path d="M7 11h6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.25" />
                                <path d="M16 2v4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 2v4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span className="text-xs md:text-sm text-white/60 font-regular">{event.dateTime}</span>
                            </div>
                          )}
                          {event.venue && event.link && (
                            <div className="inline-flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0" aria-hidden>
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span className="text-xs md:text-sm text-white/60 font-regular">{event.venue}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 md:mt-6 lg:mt-8 flex-shrink-0 w-full">
                      {event.link ? (
                        <Link
                          href={event.link}
                          className="ev-cta inline-flex items-center justify-center w-full text-base md:text-lg lg:text-xl px-3 md:px-4 lg:px-6 py-2.5 md:py-3 lg:py-4 bg-white text-black font-medium rounded-sm hover:bg-white/90 transition-all duration-300 shadow-lg opacity-0 translate-y-6 will-change-transform"
                        >
                          Register Now
                        </Link>
                      ) : (
                        <div className="ev-cta w-full text-center text-base md:text-lg lg:text-xl px-3 md:px-4 lg:px-6 py-2.5 md:py-3 lg:py-4 bg-white/10 text-white/70 font-medium rounded-sm border border-white/20 opacity-0 translate-y-6 will-change-transform">
                          Registration Not Open
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex flex-col items-center text-white/50">
          <div className="text-sm font-mono mb-2">SCROLL</div>
          <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
            <div className="w-0.5 h-3 bg-white/30 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div> */}
    </div>
  );
}