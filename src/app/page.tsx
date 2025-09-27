"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import Footer from '@/components/Footer';
import { preEvents,Events } from '@/components/eventLists';
import FullScreenSection from '@/components/FullScreenSection';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrambleTextPlugin);

export default function Home() {

  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Track real mouse and smooth cursor separately
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  // Ref for the pre events title
  const preEventsTitleRef = useRef<HTMLHeadingElement>(null);
  const EventsTitleRef = useRef<HTMLHeadingElement>(null);

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

  // ScrollSmoother initialization
  useEffect(() => {
    const scrollSmoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: true,
      smoothTouch: 0.1,
    });

    // Text scramble effect for Pre Events title
    if (preEventsTitleRef.current) {
      ScrollTrigger.create({
        trigger: preEventsTitleRef.current,
        start: "top 80%",
        onEnter: () => {
          // First make the element visible and set initial scrambled text
          gsap.set(preEventsTitleRef.current, { opacity: 1 });
          gsap.to(preEventsTitleRef.current, {
            duration: 2,
            scrambleText: {
              text: "Pre Events.",
              chars: "upperAndLowerCase",
              revealDelay: 0.5,
              speed: 0.3
            }
          });
        },
        once: true
      });
    }

    return () => {
      scrollSmoother?.kill();
      ScrollTrigger.killAll();
    };
  }, []);

  useEffect(() => {
    const scrollSmoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: true,
      smoothTouch: 0.1,
    });

    // Text scramble effect for Pre Events title
    if (EventsTitleRef.current) {
      ScrollTrigger.create({
        trigger: EventsTitleRef.current,
        start: "top 80%",
        onEnter: () => {
          // First make the element visible and set initial scrambled text
          gsap.set(EventsTitleRef.current, { opacity: 1 });
          gsap.to(EventsTitleRef.current, {
            duration: 2,
            scrambleText: {
              text: "Ongoing Events.",
              chars: "upperAndLowerCase",
              revealDelay: 0.5,
              speed: 0.3
            }
          });
        },
        once: true
      });
    }

    return () => {
      scrollSmoother?.kill();
      ScrollTrigger.killAll();
    };
  }, []);
  return (
    <div id="smooth-wrapper" className="fixed top-0 left-0 w-full h-full overflow-hidden">
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
          : 'top-4 left-1/2 -translate-x-1/2 scale-40'
      }`} style={{ 
        willChange: 'transform',
        mixBlendMode: scrollY >= 100 ? 'exclusion' : 'normal'
      }}>
        <Image
          src="/logo.webp"
          alt="Evolvia"
          width={400}
          height={400}
          className="opacity-95"
        />
      </div>

      <div id="smooth-content">
        <main className="min-h-screen w-screen bg-black relative cursor-none">

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
                  <h1 className="text-[2.2em] md:text-8xl lg:text-9xl font-bold text-white leading-none tracking-tighter">
                    TECHNO<br />
                    ENTREPRENEURSHIP<br />
                    <span className="text-[2.8em] md:text-7xl lg:text-8xl">FEST/</span>
                  </h1>
                  <div 
                    className="mt-8 text-xl md:text-2xl lg:text-3xl text-white/90 max-w-2xl"
                    // style={{
                    //   transform: isClient ? `translateY(${Math.max(0, (scrollY - windowHeight) * 0.2)}px)` : 'none',
                    //   opacity: isClient ? Math.max(0, Math.min(1, (scrollY - windowHeight * 0.6) * 0.003)) : 1
                    // }}
                  >
                    Join the ultimate celebration of entrepreneurship and technology at IEDC&apos;s flagship event
                  </div>
                </div>
              </div>
            </div>
          </FullScreenSection>
        </section>
        
        {/* Section 2: Pre Events */}
        <section className="w-screen bg-black relative flex flex-col items-center py-14 mb-10" style={{ willChange: 'transform' }}>

          {/*Events only*/}

          <div className="max-w-6xl mx-auto px-6 w-full pb-10">
            <div className="mb-12">
              <h2 
              ref={EventsTitleRef}
                className="text-6xl lg:text-7xl font-semibold text-white tracking-tight opacity-0">
                Ongoing Events
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-white to-transparent mt-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Events.map((event, index) => (
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
                  className="group cursor-pointer flex justify-between items-center space-x-4"
                >
                  {/* <div className="text-[5em] md:hidden font-serif font-medium bg-gradient-to-b from-black via-white to-black bg-clip-text text-transparent">
                    {event.id}
                  </div> */}
                    
                  {/* <div className="w-1 h-[30%] md:hidden bg-gradient-to-b from-black via-white to-black"></div> */}

                  <motion.div 
                    className="mb-4 overflow-hidden rounded-sm flex-col w-[100%]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 1.02 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={event.image}
                        alt={event.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-all duration-500 ease-out mb-2"
                        // style={{
                        //   filter: 'grayscale(100%)',
                        // }}
                        // onMouseEnter={(e) => {
                        //   e.currentTarget.style.filter = 'grayscale(0%)';
                        // }}
                        // onMouseLeave={(e) => {
                        //   e.currentTarget.style.filter = 'grayscale(100%)';
                        // }}
                        // onTouchStart={(e) => {
                        //   if (e.currentTarget) {
                        //     e.currentTarget.style.filter = 'grayscale(0%)';
                        //   }
                        // }}
                        // onTouchEnd={(e) => {
                        //   const target = e.currentTarget;
                        //   if (target) {
                        //     setTimeout(() => {
                        //       if (target && target.style) {
                        //         target.style.filter = 'grayscale(100%)';
                        //       }
                        //     }, 1500);
                        //   }
                        // }}
                      />
                    </motion.div>
                    <div className="flex flex-col gap-2 mt-auto">
                      <h3 className="text-2xl font-semibold text-white group-hover:text-white/90 transition-colors duration-300">
                        {event.name}
                      </h3>
                      {
                        event.spec && <p className="text-gray-500">({event.spec})</p>
                      }
                      {event?.link?(
                        <Link 
                        href={event.link}
                        className="text-center max-w-3/4 text-xl px-6 py-3 bg-white font-light text-black rounded-xsm hover:bg-gray-200 hover:scale-103 transition-all duration-300"
                        >
                        Register
                      </Link>
                      ):<p className="text-center max-w-3/4 text-xl px-6 py-3 bg-white font-light text-black rounded-xsm hover:bg-gray-200 hover:scale-103 transition-all duration-300">
                        Registration not Opened
                        </p>}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/*Pre Events only*/}
          <div className="max-w-6xl mx-auto px-6 w-full pt-10">
            <div className="mb-12">
              <h2 
                ref={preEventsTitleRef} 
              className="text-6xl lg:text-7xl font-semibold text-white tracking-tight opacity-0">
                Pre Events.
              </h2>
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