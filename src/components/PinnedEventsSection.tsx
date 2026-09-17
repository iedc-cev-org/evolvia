"use client";

import { useRef, useEffect, useLayoutEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Event } from "@/components/eventLists";

gsap.registerPlugin(ScrollTrigger);

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

    const image = el.querySelector(".ev-image") as HTMLElement | null;
    const title = el.querySelector(".ev-title") as HTMLElement | null;
    const spec = el.querySelector(".ev-spec") as HTMLElement | null;
    const cta = el.querySelector(".ev-cta") as HTMLElement | null;
    const meta = el.querySelector(".ev-meta") as HTMLElement | null;
    const shimmer = el.querySelector(".ev-shimmer") as HTMLElement | null;

    const removeInitialHideClasses = () => {
      el.classList.remove("opacity-0", "translate-y-10", "scale-95");
      if (image) image.classList.remove("opacity-0", "translate-y-6");
      if (title) title.classList.remove("opacity-0", "translate-y-6");
      if (spec) spec.classList.remove("opacity-0", "translate-y-6");
      if (meta) meta.classList.remove("opacity-0", "translate-y-6");
      if (cta) cta.classList.remove("opacity-0", "translate-y-6");
    };

    if (title && !(title as HTMLElement).dataset.split) {
      const text = title.textContent || "";
      title.textContent = "";
      const frag = document.createDocumentFragment();

      const words = text.split(" ");
      words.forEach((word, wi) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "ev-word inline-block";
        for (const ch of word) {
          const span = document.createElement("span");
          span.className = "ev-char inline-block";
          span.textContent = ch;
          wordSpan.appendChild(span);
        }
        frag.appendChild(wordSpan);
        if (wi < words.length - 1) {
          frag.appendChild(document.createTextNode(" "));
        }
      });
      title.appendChild(frag);
      (title as HTMLElement).dataset.split = "1";
    }

    const chars = title ? (title.querySelectorAll(".ev-char") as NodeListOf<HTMLElement>) : ([] as unknown as NodeListOf<HTMLElement>);

    if (image || title || spec || cta) {
      if (revealedSetRef.current.has(idx)) {
        gsap.set(el, { clearProps: "opacity,transform" });
        el.classList.remove("opacity-0", "translate-y-10", "scale-95");
        gsap.set([image, spec, meta, cta].filter(Boolean) as HTMLElement[], { opacity: 1, clearProps: "y,scale" });
        if (title) gsap.set(title, { opacity: 1, clearProps: "y" });
        if (chars && chars.length) gsap.set(chars, { opacity: 1, clearProps: "y" });
        const shimmerEl = el.querySelector(".ev-shimmer") as HTMLElement | null;
        if (shimmerEl) gsap.set(shimmerEl, { opacity: 0, clearProps: "xPercent" });
        removeInitialHideClasses();
        return;
      }

      gsap.set(el, { autoAlpha: 0, y: 20, scale: 0.95 });
      gsap.set([image, spec, meta, cta].filter(Boolean) as HTMLElement[], { opacity: 0, y: 20 });
      if (chars && chars.length) gsap.set(chars, { opacity: 0, y: 16 });
      if (image) gsap.set(image, { y: 16, scale: 0.98 });
      if (title) gsap.set(title, { opacity: 1, y: 0 });
      if (shimmer) gsap.set(shimmer, { xPercent: -120, opacity: 0 });

      const tl = gsap.timeline();

      tl.to(
        el,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
        },
        0
      )
        .to(
          image,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power3.out",
          },
          0.15
        )
        .to(
          chars,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power3.out",
            stagger: 0.025,
          },
          0.2
        )
        .to(
          [spec, meta, cta].filter(Boolean) as HTMLElement[],
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.1,
          },
          0.5
        )
        .to(
          shimmer,
          {
            xPercent: 240,
            opacity: 0.4,
            duration: 0.8,
            ease: "power2.out",
          },
          0.3
        )
        .to(
          shimmer,
          {
            opacity: 0,
            duration: 0.25,
            ease: "power2.out",
          },
          ">-0.1"
        );

      tl.eventCallback("onStart", () => {
        revealedSetRef.current.add(idx);
      });
      tl.eventCallback("onComplete", () => {
        revealedSetRef.current.add(idx);
        removeInitialHideClasses();
      });

      revealTlRef.current = tl;
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace(/^#/, "");
      if (!rawHash) return;

      const numMatch = rawHash.match(/^e(\d+)$/);
      const targetIdx = events.findIndex(
        (ev) =>
          ev.slug === rawHash ||
          String(ev.id) === rawHash ||
          (numMatch && String(ev.id) === numMatch[1])
      );

      if (targetIdx >= 0 && containerRef.current) {
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const targetScrollTop = sectionTop + targetIdx * window.innerHeight;

        window.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [events]);

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
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !eventsContainerRef.current) return;

    const container = containerRef.current;
    const eventsContainer = eventsContainerRef.current;

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: () => `+=${Math.max(0, (events.length - 1) * window.innerHeight)}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const totalSlides = events.length;
        const progress = totalSlides > 1 ? self.progress : 0;

        const maxShiftPx = (totalSlides - 1) * window.innerHeight;
        const translatePx = Math.max(-maxShiftPx, Math.min(0, -progress * maxShiftPx));
        gsap.set(eventsContainer, { y: translatePx });

        const segment = progress * (totalSlides - 1);
        const base = Math.floor(segment);
        const frac = segment - base;
        const down = (self as unknown as ScrollTriggerType).direction >= 0;

        const isNearEnd = base >= totalSlides - 2;
        const threshold = isNearEnd ? (down ? 0.6 : 0.4) : down ? 0.75 : 0.25;

        let currentIndex = base + (frac >= threshold ? 1 : 0);
        currentIndex = Math.min(Math.max(currentIndex, 0), totalSlides - 1);

        if (progress >= 0.98 && totalSlides > 0) {
          currentIndex = totalSlides - 1;
        }

        if (currentIndex !== lastIndexRef.current) {
          setCurrentEventIndex(currentIndex);
          if (sectionEnteredRef.current && currentIndex >= 0 && currentIndex < events.length) {
            const currentEv = events[currentIndex];
            const targetHash = currentEv.slug ? `#${currentEv.slug}` : `#e${currentEv.id}`;
            if (window.location.hash !== targetHash) {
              history.replaceState(null, "", targetHash);
            }
          }
          const display = currentIndex + 1;

          const tens = Math.floor(display / 10);
          const ones = display % 10;
          if (digitHeight > 0) {
            if (onesColRef.current) {
              gsap.to(onesColRef.current, { y: -(digitHeight * ones), duration: 0.6, ease: "power3.inOut", overwrite: "auto" });
            }
            if (tensColRef.current) {
              gsap.to(tensColRef.current, { y: -(digitHeight * tens), duration: 0.6, ease: "power3.inOut", overwrite: "auto" });
            }
          }
          lastIndexRef.current = currentIndex;
        }
      },
      onEnter: () => {
        sectionEnteredRef.current = true;
        if (!revealedSetRef.current.has(0)) {
          playRevealForIndex(0);
        }
      },
      onLeave: () => {
        if (events.length > 0 && !revealedSetRef.current.has(events.length - 1)) {
          playRevealForIndex(events.length - 1);
        }
      },
      onLeaveBack: () => {
        sectionEnteredRef.current = false;
      },
    });

    return () => {
      st.kill();
    };
  }, [events, digitHeight, playRevealForIndex]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const stFirst = ScrollTrigger.create({
      trigger: container,
      start: "top 45%",
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
      <div
        className="absolute left-0 top-0 w-1/4 sm:w-1/3 md:w-2/5 lg:w-1/3 h-full flex flex-col justify-center items-center z-20 pointer-events-none"
      >
        <div className="text-center">
          <div className="relative text-[2.2rem] sm:text-[3.5rem] md:text-[8rem] lg:text-[10rem] xl:text-[12rem] font-mono font-bold text-white/90 leading-none select-none inline-flex items-stretch gap-1 md:gap-2">
            <span ref={digitMeasureRef} className="absolute opacity-0 pointer-events-none" aria-hidden>
              0
            </span>
            <div className="overflow-hidden" style={digitHeight ? { height: `${digitHeight}px` } : undefined}>
              <div ref={tensColRef}>
                {Array.from({ length: 10 }, (_, n) => (
                  <div key={`t-${n}`} className="leading-none">{n}</div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden" style={digitHeight ? { height: `${digitHeight}px` } : undefined}>
              <div ref={onesColRef}>
                {Array.from({ length: 10 }, (_, n) => (
                  <div key={`o-${n}`} className="leading-none">{n}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-10 sm:w-16 md:w-32 h-0.5 bg-white/30 mx-auto mt-2 sm:mt-4 md:mt-8"></div>

          <div className="text-white/60 text-[10px] sm:text-xs md:text-2xl lg:text-3xl font-light tracking-wider mt-2 sm:mt-4 md:mt-8 uppercase">
            Ongoing Events
          </div>

          <div className="mt-3 sm:mt-6 md:mt-12 flex flex-col items-center">
            <div className="text-white/40 text-[10px] sm:text-xs md:text-lg font-mono mb-1 sm:mb-2 md:mb-4">
              {String(currentEventIndex + 1).padStart(2, "0")} / {String(events.length).padStart(2, "0")}
            </div>
            <div className="w-0.5 sm:w-1 h-10 sm:h-16 md:h-32 bg-white/10 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full bg-white/60 transition-all duration-300 ease-out"
                style={{
                  height: `${((currentEventIndex + 1) / Math.max(1, events.length)) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute right-0 top-0 w-3/4 sm:w-2/3 md:w-3/5 lg:w-2/3 h-full overflow-hidden"
      >
        <div
          ref={eventsContainerRef}
          className="w-full"
          style={{ height: `${events.length * 100}vh` }}
        >
          {events.map((event, index) => (
            <div
              key={event.slug || event.id || index}
              className="h-screen w-full flex items-center justify-center px-2 sm:px-4 md:px-8 lg:px-10 xl:px-12 py-4 sm:py-6 md:py-12 lg:py-14 xl:py-16"
            >
              <motion.div
                ref={(el) => { cardRefs.current[index] = el; }}
                className="max-w-4xl w-full max-h-[86vh] md:max-h-none overflow-y-auto md:overflow-visible bg-white/10 backdrop-blur-md border border-white/20 rounded-md shadow-xl p-3 sm:p-5 md:p-6 lg:p-8 xl:p-10 opacity-0 translate-y-10 scale-95 will-change-transform"
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                onMouseMove={(e) => {
                  const el = cardRefs.current[index];
                  if (!el) return;
                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rx = ((y / rect.height) - 0.5) * -6;
                  const ry = ((x / rect.width) - 0.5) * 6;
                  const tiltOptions = { rotateX: rx, rotateY: ry, transformPerspective: 900, duration: 0.35, ease: "power3.out" };
                  gsap.to(el, tiltOptions);
                }}
                onMouseLeave={() => {
                  const el = cardRefs.current[index];
                  if (!el) return;
                  const resetOptions = { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power3.out" };
                  gsap.to(el, resetOptions);
                }}
              >
                <div className="ev-tilt flex flex-col md:flex-row gap-2.5 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 items-stretch will-change-transform">
                  <div className="ev-image relative w-full md:w-[44%] md:min-w-[44%] overflow-hidden rounded-sm opacity-0 translate-y-6 will-change-transform aspect-[3/4] group/pimg">
                    {event.isCompleted && (
                      <div className="absolute z-20 left-2 top-2 sm:left-3 sm:top-3 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-black/60 text-white text-[10px] sm:text-xs font-medium rounded-sm backdrop-blur-sm pointer-events-none">
                        Completed
                      </div>
                    )}
                    <Image
                      src={event.image}
                      alt={event.name}
                      fill
                      className={`object-cover transition-all duration-700 group-hover/pimg:scale-105 ${event.isCompleted && event.completed_image ? "group-hover/pimg:opacity-0" : ""
                        }`}
                    />
                    {event.isCompleted && event.completed_image && (
                      <Image
                        src={event.completed_image}
                        alt={`${event.name} (completed)`}
                        fill
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/pimg:opacity-100 transition-opacity duration-500 pointer-events-none z-10 group-hover/pimg:scale-105"
                      />
                    )}
                    <div className="ev-shimmer pointer-events-none absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-12" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0 overflow-hidden">
                    <div className="space-y-1.5 sm:space-y-2 md:space-y-3 lg:space-y-4">
                      <h3 className="ev-title whitespace-normal break-normal text-base sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight opacity-0 translate-y-6 will-change-transform line-clamp-2 md:line-clamp-none">
                        {event.name}
                      </h3>
                      {event.spec && (
                        <p className="ev-spec text-white/70 text-xs sm:text-sm md:text-lg lg:text-xl opacity-0 translate-y-6 will-change-transform line-clamp-2 md:line-clamp-none">
                          {event.spec}
                        </p>
                      )}
                      {(event.dateTime || event.venue) && (
                        <div className="ev-meta flex flex-col gap-1 sm:gap-2 text-white/60 text-[10px] sm:text-xs md:text-sm opacity-0 translate-y-6 will-change-transform">
                          {event.dateTime && (
                            <div className="inline-flex items-center gap-1.5 sm:gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" className="flex-shrink-0" aria-hidden>
                                <path d="M7 11h6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.25" />
                                <path d="M16 2v4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 2v4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span className="text-[10px] sm:text-xs md:text-sm text-white/60 font-regular">{event.dateTime}</span>
                            </div>
                          )}
                          {event.venue && (
                            <div className="inline-flex items-center gap-1.5 sm:gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" className="flex-shrink-0" aria-hidden>
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span className="text-[10px] sm:text-xs md:text-sm text-white/60 font-regular">{event.venue}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-2.5 sm:mt-4 md:mt-6 lg:mt-8 flex-shrink-0 w-full">
                      {event.isCompleted ? (
                        <div className="ev-cta w-full text-center text-xs sm:text-sm md:text-lg lg:text-xl px-2.5 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-4 bg-white/10 text-white/70 font-medium rounded-sm border border-white/20 opacity-0 translate-y-6 will-change-transform">
                          Completed
                        </div>
                      ) : event.isClosed ? (
                        <div className="ev-cta w-full text-center text-xs sm:text-sm md:text-lg lg:text-xl px-2.5 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-4 bg-white/10 text-white/70 font-medium rounded-sm border border-white/20 opacity-0 translate-y-6 will-change-transform">
                          Registration Closed
                        </div>
                      ) : event.link ? (
                        <Link
                          href={event.link}
                          target={event.link.startsWith("http") ? "_blank" : undefined}
                          rel={event.link.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="ev-cta inline-flex items-center justify-center w-full text-xs sm:text-sm md:text-lg lg:text-xl px-2.5 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-4 bg-white text-black font-medium rounded-sm hover:bg-white/90 transition-all duration-300 shadow-lg opacity-0 translate-y-6 will-change-transform"
                        >
                          Register Now
                        </Link>
                      ) : (
                        <div className="ev-cta w-full text-center text-xs sm:text-sm md:text-lg lg:text-xl px-2.5 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-4 bg-white/10 text-white/70 font-medium rounded-sm border border-white/20 opacity-0 translate-y-6 will-change-transform">
                          Coming Soon
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

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex flex-col items-center text-white/50">
          <div className="text-sm font-mono mb-2">SCROLL</div>
          <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
            <div className="w-0.5 h-3 bg-white/30 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}