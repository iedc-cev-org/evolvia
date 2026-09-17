"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import AnimatedReveal from "@/components/AnimatedReveal";
import Footer from "@/components/Footer";
import {
  Events,
  preEvents,
  StallsAndExpos,
  Speakers,
  Sponsors,
  fetchAllEvolviaData,
  PreEvent,
  Event as EventType,
  StallAndExpo,
  Speaker,
  Sponsor,
} from "@/components/eventLists";
import FullScreenSection from "@/components/ScrollVideo";
import PinnedEventsSection from "@/components/PinnedEventsSection";
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
  const [showJumpButton, setShowJumpButton] = useState(false);

  const [eventsData, setEventsData] = useState<EventType[]>(Events);
  const [preEventsData, setPreEventsData] = useState<PreEvent[]>(preEvents);
  const [stallsData, setStallsData] = useState<StallAndExpo[]>(StallsAndExpos);
  const [speakersData, setSpeakersData] = useState<Speaker[]>(Speakers);
  const [sponsorsData, setSponsorsData] = useState<Sponsor[]>(Sponsors);

  useEffect(() => {
    let isMounted = true;
    fetchAllEvolviaData()
      .then((data) => {
        if (!isMounted || !data) return;
        if (Array.isArray(data.events)) setEventsData(data.events);
        if (Array.isArray(data.preEvents)) setPreEventsData(data.preEvents);
        const stallsList = data.stallsAndExpos || data.stalls;
        if (Array.isArray(stallsList)) setStallsData(stallsList);
        if (Array.isArray(data.speakers)) setSpeakersData(data.speakers);
        if (Array.isArray(data.sponsors)) setSponsorsData(data.sponsors);
        ScrollTrigger.refresh();
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToTargetSlug = useCallback((rawHash?: string) => {
    const hash = (rawHash ?? window.location.hash).replace(/^#/, "");
    if (!hash) return false;

    const targetPre = preEventsData.find((pe) => {
      if (pe.slug && pe.slug.toLowerCase() === hash.toLowerCase()) return true;
      if (String(pe.id).toLowerCase() === hash.toLowerCase()) return true;
      const normalizedName = pe.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (normalizedName === hash.toLowerCase()) return true;
      return false;
    });

    if (targetPre) {
      const preEl = document.getElementById(targetPre.slug || `preevent-${targetPre.id}`);
      if (preEl) {
        const smoother = ScrollSmoother.get();
        if (smoother) {
          smoother.scrollTo(preEl, true, "center center");
        } else {
          preEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return true;
      }
    }

    const numMatch = hash.match(/^e(\d+)$/);
    const targetIndex = eventsData.findIndex((ev) => {
      if (ev.slug && ev.slug.toLowerCase() === hash.toLowerCase()) return true;
      if (String(ev.id).toLowerCase() === hash.toLowerCase()) return true;
      if (`e${ev.id}`.toLowerCase() === hash.toLowerCase()) return true;
      if (numMatch && String(ev.id) === numMatch[1]) return true;
      const normalizedName = ev.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (normalizedName === hash.toLowerCase()) return true;
      return false;
    });

    if (targetIndex >= 0) {
      const eventsSection = document.querySelector("#events-section") as HTMLElement | null;
      if (eventsSection) {
        const rect = eventsSection.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const targetScrollTop = sectionTop + targetIndex * window.innerHeight;
        const smoother = ScrollSmoother.get();
        if (smoother) {
          smoother.scrollTo(targetScrollTop, true);
        } else {
          window.scrollTo({
            top: targetScrollTop,
            behavior: "smooth",
          });
        }
      }
      return true;
    }

    const directEl = document.getElementById(hash);
    if (directEl) {
      const smoother = ScrollSmoother.get();
      if (smoother) {
        smoother.scrollTo(directEl, true);
      } else {
        directEl.scrollIntoView({ behavior: "smooth" });
      }
      return true;
    }

    return false;
  }, [eventsData, preEventsData]);

  useEffect(() => {
    const rawHash = window.location.hash.replace(/^#/, "");
    if (!rawHash) return;

    if (videoReady && (preEventsData.length > 0 || eventsData.length > 0)) {
      const timer = setTimeout(() => {
        scrollToTargetSlug();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [videoReady, preEventsData, eventsData, scrollToTargetSlug]);

  useEffect(() => {
    const onHashChange = () => {
      scrollToTargetSlug();
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [scrollToTargetSlug]);

  useEffect(() => {
    if (showJumpButton && scrollY > windowHeight * 2) {
      setShowJumpButton(false);
    }
  }, [scrollY, windowHeight, showJumpButton]);

  const handleJumpToEvent = () => {
    scrollToTargetSlug();
    setTimeout(() => setShowJumpButton(false), 1000);
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
      ScrollTrigger.refresh();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setCursorPosition((prev) => {
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
    const onReady = () => setVideoReady(true);
    if (v && v.readyState >= 3) {
      setVideoReady(true);
    }
    const timer = setTimeout(() => {
      setVideoReady(true);
    }, 1500);

    if (v) {
      v.addEventListener("canplaythrough", onReady, { once: true });
      v.addEventListener("loadeddata", onReady, { once: true });
    }

    return () => {
      clearTimeout(timer);
      if (v) {
        v.removeEventListener("canplaythrough", onReady);
        v.removeEventListener("loadeddata", onReady);
      }
    };
  }, []);

  useEffect(() => {
    if (!isClient || !stallsSectionRef.current) return;

    const section = stallsSectionRef.current;
    const cards = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".stall-card"));
    if (!cards.length) return;

    gsap.set(cards, { y: window.innerHeight * 0.7, opacity: 0 });

    const isMobile = window.innerWidth < 768;
    const endDistance = isMobile ? cards.length * 120 + 200 : cards.length * 220 + 400;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${endDistance}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
      },
    });

    tl.to(cards, {
      y: () => 0,
      opacity: 1,
      ease: "power2.out",
      stagger: { each: 0.18 },
    });

    ScrollTrigger.refresh();

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [isClient, videoReady, stallsData]);

  const handlePreEventAction = (link?: string, slug?: string) => {
    if (link && (link.startsWith("http://") || link.startsWith("https://"))) {
      window.open(link, "_blank");
      return;
    }
    if (slug) {
      window.location.hash = `#${slug}`;
      scrollToTargetSlug(slug);
      return;
    }
    if (link) {
      if (link.startsWith("#")) {
        const cleanSlug = link.replace(/^#/, "");
        window.location.hash = link;
        scrollToTargetSlug(cleanSlug);
        return;
      }
      const targetEv = eventsData.find(
        (e) =>
          e.slug === link ||
          String(e.id) === link ||
          (e.name && e.name.toLowerCase().includes(link.toLowerCase()))
      );
      if (targetEv) {
        window.location.hash = `#${targetEv.slug || `e${targetEv.id}`}`;
        scrollToTargetSlug(targetEv.slug || `e${targetEv.id}`);
      }
    }
  };

  return (
    <div
      id="smooth-wrapper"
      className={`fixed top-0 left-0 w-full h-full overflow-hidden ${!videoReady ? "pointer-events-none select-none" : ""}`}
    >
      <div
        className="fixed pointer-events-none z-50 w-10 h-10 bg-white rounded-full hidden md:block"
        style={{
          left: cursorPosition.x - 16,
          top: cursorPosition.y - 16,
          mixBlendMode: "exclusion",
          transition: "transform 0.05s linear",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`fixed z-25 transition-all duration-1500 ease-in-out ${
          scrollY < 100 ? "top-6 left-6" : "top-12 left-12 hidden md:block"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        <Image
          src="/page-assets/iedclogo.webp"
          alt="IEDC Logo"
          width={80}
          height={80}
          className="opacity-90"
        />
      </motion.div>

      <div
        className={`fixed z-25 transition-all duration-1500 ease-in-out ${
          scrollY < 100
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100"
            : "top-2 left-1/2 -translate-x-1/2 -translate-y-1/3 scale-40"
        }`}
        style={{
          willChange: "transform",
          mixBlendMode: scrollY >= 100 ? "exclusion" : "normal",
        }}
      >
        <div className="relative w-[200px] h-[200px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px]">
          <Image
            src="/page-assets/logo.png"
            alt="Evolvia"
            fill
            sizes="(max-width: 768px) 260px, (max-width: 1024px) 360px, 400px"
            className={`object-contain opacity-95 select-none z-0 ${!videoReady ? "loader-logo" : ""}`}
            priority
          />
          {!videoReady && <div className="absolute inset-0 shimmer shimmer-mask-logo z-10" />}
        </div>

        {showJumpButton && scrollY < 100 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={handleJumpToEvent}
            className="absolute -bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white text-sm md:text-base font-medium hover:bg-white/20 transition-all duration-300 shadow-lg inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            Jump to Event
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed top-6 right-6 z-50 transition-all duration-1500 ease-in-out"
      >
        <Link href="/map" aria-label="Go to Map Page">
          <button className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm md:text-base font-medium hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
            Map
          </button>
        </Link>
      </motion.div>

      {!videoReady && <div className="fixed inset-0 z-[30]" />}

      <div id="smooth-content">
        <main className="min-h-screen w-screen bg-black relative cursor-none">
          <div className="w-full">
            <section
              className="h-screen w-screen relative flex items-center justify-center"
              style={{ willChange: "transform" }}
            >
              <video
                ref={heroVideoRef}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover bg transition-opacity duration-700"
                style={{ willChange: "auto", opacity: videoReady ? 1 : 0 }}
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

            <section
              className="h-screen w-screen bg-black relative flex items-center"
              style={{ willChange: "transform" }}
            >
              <FullScreenSection>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-start z-20">
                  <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 w-full">
                    <div
                      className="text-left"
                      style={{
                        transform: isClient
                          ? `translateY(${Math.max(0, (scrollY - windowHeight) * 0.3)}px)`
                          : "none",
                        opacity: isClient
                          ? Math.max(0, Math.min(1, (scrollY - windowHeight * 0.5) * 0.002))
                          : 1,
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

            <section id="events-section" className="w-full max-w-full overflow-x-hidden">
              <PinnedEventsSection events={eventsData} />
            </section>

            <section
              ref={stallsSectionRef}
              className="w-full max-w-full overflow-x-hidden bg-black relative flex flex-col items-center py-16 md:py-20"
              style={{ willChange: "transform" }}
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 md:gap-10 mb-8 md:mb-12">
                  <div className="space-y-4 md:space-y-6 max-w-3xl">
                    <AnimatedReveal
                      text="Stalls & Expos."
                      as="h2"
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight"
                      split="chars"
                    />
                    <AnimatedReveal
                      text="Experience the innovators shaping the future of automation, robotics, and tech culture."
                      as="p"
                      className="text-base sm:text-lg lg:text-xl text-white/70"
                      split="words"
                      stagger={0.04}
                      duration={0.6}
                      initialYOffset={16}
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
                    className="self-start lg:self-auto flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-full text-white/80 backdrop-blur-md"
                  >
                    <span className="inline-flex h-2.5 sm:h-3 w-2.5 sm:w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                    <span className="text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em]">On Floor Showcase</span>
                  </motion.div>
                </div>

                {stallsData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {stallsData.map((stall, index) => (
                      <article
                        key={stall.name + index}
                        className="stall-card relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg group"
                        style={{ willChange: "transform" }}
                      >
                        <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
                          <Image
                            src={stall.image}
                            alt={stall.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 420px"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            priority={index === 0}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                          <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-6 space-y-2 sm:space-y-3">
                            <h3 className="text-xl sm:text-2xl font-semibold text-white">{stall.name}</h3>
                            {stall.description && (
                              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">{stall.description}</p>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60">Coming Soon....</p>
                )}
              </div>
            </section>

            <section
              id="preevents-section"
              className="w-full max-w-full overflow-x-hidden bg-black relative flex flex-col items-center py-12 md:py-14 mb-10"
              style={{ willChange: "transform" }}
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full pt-6 md:pt-10">
                <div className="mb-8 md:mb-12">
                  <AnimatedReveal
                    text="Pre Events."
                    as="h2"
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight"
                    split="chars"
                  />
                  <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-white to-transparent mt-3 md:mt-4"></div>
                </div>

                {preEventsData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {preEventsData.map((event, index) => (
                      <motion.div
                        id={event.slug || `preevent-${event.id || index}`}
                        key={event.name + index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.1,
                          ease: [0.25, 0.25, 0, 1],
                        }}
                        className="group flex flex-col justify-between p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-white/20 scroll-mt-28"
                      >
                        <div>
                          <div className="mb-4 overflow-hidden rounded-lg relative">
                            {event.isCompleted && (
                              <div className="absolute z-20 left-3 top-3 px-2.5 py-1 bg-black/60 text-white text-xs font-medium rounded-sm backdrop-blur-sm pointer-events-none">
                                Completed
                              </div>
                            )}
                            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-white/5">
                              <Image
                                src={event.image}
                                alt={event.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
                                  event.isCompleted && event.completed_image ? "group-hover:opacity-0" : ""
                                }`}
                              />
                              {event.isCompleted && event.completed_image && (
                                <Image
                                  src={event.completed_image}
                                  alt={`${event.name} (completed)`}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none z-10 group-hover:scale-105"
                                />
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-white/90 transition-colors duration-300">
                              {event.name}
                            </h3>
                            {event.spec && (
                              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">{event.spec}</p>
                            )}
                            {(event.dateTime || event.venue) && (
                              <div className="flex flex-col gap-1.5 text-xs text-white/60 pt-1">
                                {event.dateTime && (
                                  <div className="inline-flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" className="flex-shrink-0" aria-hidden>
                                      <path d="M7 11h6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.25" />
                                      <path d="M16 2v4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M8 2v4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>{event.dateTime}</span>
                                  </div>
                                )}
                                {event.venue && (
                                  <div className="inline-flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" className="flex-shrink-0" aria-hidden>
                                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                      <circle cx="12" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>{event.venue}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-5 pt-3 border-t border-white/10">
                          {event.isCompleted ? (
                            <div className="w-full text-center py-2 sm:py-2.5 px-3 sm:px-4 rounded-md bg-white/10 text-white/70 font-medium border border-white/10 text-xs sm:text-sm">
                              Completed
                            </div>
                          ) : event.isClosed ? (
                            <div className="w-full text-center py-2 sm:py-2.5 px-3 sm:px-4 rounded-md bg-white/10 text-white/70 font-medium border border-white/10 text-xs sm:text-sm">
                              Registration Closed
                            </div>
                          ) : event.link ? (
                            <button
                              onClick={() => handlePreEventAction(event.link, event.slug)}
                              className="w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-md bg-white text-black hover:bg-white/90 text-xs md:text-sm font-semibold transition-all duration-200 shadow-md cursor-pointer text-center inline-flex items-center justify-center gap-2"
                            >
                              Register Now
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                              </svg>
                            </button>
                          ) : (
                            <div className="w-full text-center py-2 sm:py-2.5 px-3 sm:px-4 rounded-md bg-white/10 text-white/70 font-medium border border-white/10 text-xs sm:text-sm">
                              Coming Soon
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60">Coming Soon....</p>
                )}
              </div>
            </section>

            <section
              className="w-full max-w-full overflow-x-hidden bg-black relative flex flex-col items-center py-12 md:py-14 mb-10"
              style={{ willChange: "transform" }}
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full pt-6 md:pt-10">
                <div className="mb-8 md:mb-12">
                  <AnimatedReveal
                    text="Our Speakers."
                    as="h2"
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight"
                    split="chars"
                  />
                  <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-white to-transparent mt-3 md:mt-4"></div>
                </div>

                {speakersData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {speakersData.map((speaker, index) => (
                      <motion.div
                        key={speaker.name + index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.1,
                          ease: [0.25, 0.25, 0, 1],
                        }}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg"
                      >
                        <div className="relative h-72 sm:h-80 md:h-96 overflow-hidden">
                          <Image
                            src={speaker.image}
                            alt={speaker.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            priority={index === 0}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                          <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-6 space-y-1.5 sm:space-y-2">
                            <h3 className="text-2xl sm:text-3xl font-semibold text-white">{speaker.name}</h3>
                            <p className="text-sm sm:text-base text-white/80">{speaker.designation}</p>
                            <p className="text-xs sm:text-sm text-white/60">{speaker.expertise}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60">Coming Soon....</p>
                )}
              </div>
            </section>

            <section
              className="w-full max-w-full overflow-x-hidden bg-black relative flex flex-col items-center py-12 md:py-14 mb-10"
              style={{ willChange: "transform" }}
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full pt-6 md:pt-10">
                <div className="mb-8 md:mb-12 text-center">
                  <AnimatedReveal
                    text="Our Sponsors."
                    as="h2"
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight"
                    split="chars"
                  />
                  <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-white to-transparent mt-3 md:mt-4 mx-auto"></div>
                </div>

                {sponsorsData.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8 bg-amber-50/5 p-3 sm:p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-md">
                    {sponsorsData.map((sponsor, index) => (
                      <motion.div
                        key={sponsor.name + index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.1,
                          ease: [0.25, 0.25, 0, 1],
                        }}
                        className="flex items-center justify-center bg-white/5 rounded-xl p-2 sm:p-4 md:p-6 h-24 sm:h-32 md:h-40 lg:h-44"
                      >
                        <Image
                          src={sponsor.image}
                          alt={sponsor.name}
                          width={200}
                          height={80}
                          className="object-contain w-full h-full max-h-16 sm:max-h-24 md:max-h-32 lg:max-h-36 transition-opacity duration-500 ease-out"
                          style={{ background: "transparent" }}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60 text-center">Coming Soon....</p>
                )}
              </div>
            </section>

            <section className="w-full max-w-full overflow-x-hidden bg-black my-16">
              <Footer />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
