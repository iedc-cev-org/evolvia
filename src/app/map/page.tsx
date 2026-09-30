"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useMemo, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from '@/components/Footer';
import venuesData from '@/data/venues.json';

interface VenueEvent {
  name: string;
  time: string;
  location?: string;
  category?: string;
}

interface Venue {
  floor: string;
  id: string;
  name: string;
  location: string;
  block: string;
  description?: string;
  images?: string[];
  coordinates?: { lat: number; lng: number };
  events?: VenueEvent[];
}

const venues: Venue[] = venuesData;

export default function MapPage() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [activeBlock, setActiveBlock] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const openInMaps = (e: MouseEvent, coords?: { lat: number; lng: number }) => {
    e.stopPropagation();
    if (!coords) return;
    const { lat, lng } = coords;
    const googleUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    try {
      setTimeout(() => (window.location.href = googleUrl), 100);
    } catch {
      window.location.href = googleUrl;
    }
  };

  const blocks = useMemo(() => {
    const uniqueBlocks = Array.from(new Set(venues.map((v) => v.block)));
    return ["all", ...uniqueBlocks];
  }, []);

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const matchesBlock = activeBlock === "all" || venue.block === activeBlock;
      if (!matchesBlock) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchesName = venue.name.toLowerCase().includes(q);
      const matchesLocation = venue.location.toLowerCase().includes(q);
      const matchesBlockName = venue.block.toLowerCase().includes(q);
      const matchesEvents = venue.events?.some(
        (ev) =>
          ev.name.toLowerCase().includes(q) ||
          ev.time.toLowerCase().includes(q) ||
          (ev.location && ev.location.toLowerCase().includes(q)) ||
          (ev.category && ev.category.toLowerCase().includes(q))
      );

      return matchesName || matchesLocation || matchesBlockName || Boolean(matchesEvents);
    });
  }, [activeBlock, searchQuery]);

  return (
    <div className="min-h-screen w-screen bg-black text-white overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(8px) brightness(0.4)' }}
        >
          <source src="/page-assets/loop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-30"
      >
        <Link href="/">
          <button className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm hover:bg-white/20 transition-all duration-300">
            Home
          </button>
        </Link>
      </motion.div>

      <div className="relative z-10 pt-20 md:pt-24 pb-12 px-4 md:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="offwhite-gradient text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 mix-blend-exclusion">
              Venue Map
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Navigate through our cosmic venues and event schedules across the campus
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="max-w-md mx-auto mb-6 px-2"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, venues, or activities..."
                className="w-full px-4 py-2.5 pl-10 pr-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors"
              />
              <svg
                className="w-4 h-4 text-white/50 absolute left-3.5 top-3.5 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-2.5 text-xs text-white/50 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 md:mb-12"
          >
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              {blocks.map((block) => (
                <button
                  key={block}
                  onClick={() => setActiveBlock(block)}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                    activeBlock === block
                      ? "bg-gradient-to-b from-white to-white/70 text-black"
                      : "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  {block === "all" ? "All Venues" : block}
                </button>
              ))}
            </div>
          </motion.div>

          {filteredVenues.length === 0 ? (
            <div className="text-center py-16 text-white/50">
              <p className="text-lg">No venues or events match your search criteria.</p>
              <button
                onClick={() => {
                  setActiveBlock("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredVenues.map((venue, index) => (
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedVenue(venue)}
                  className="group cursor-pointer"
                >
                  <div className="relative h-full rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:opacity-100 opacity-0 transition-opacity duration-500 pointer-events-none"></div>

                    <div className="p-4 md:p-6 flex-1 flex flex-col">
                      <div className="rounded-lg overflow-hidden h-24 relative bg-black/20">
                        {venue.images && venue.images.length > 0 && (
                          <Image
                            src={venue.images[0]}
                            alt={venue.name}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white text-center px-4 offwhite-gradient uppercase">
                            {venue.name}.
                          </h3>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
                        <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs md:text-sm text-white/70">
                          {venue.block}
                        </div>
                        {venue.events && venue.events.length > 0 && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>{venue.events.length} {venue.events.length === 1 ? "Event" : "Events"}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-white/70">
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-white/90 font-medium">{venue.location}</span>
                          <span className="text-white/40">({venue.floor})</span>
                        </div>
                        {venue.description && (
                          <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-2">
                            {venue.description}
                          </p>
                        )}
                      </div>

                      {venue.events && venue.events.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 flex-1">
                          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                            Featured Activities
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {venue.events.slice(0, 3).map((ev, i) => (
                              <span
                                key={i}
                                className="inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-white/80 truncate max-w-full"
                              >
                                {ev.name}
                              </span>
                            ))}
                            {venue.events.length > 3 && (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 text-[11px] text-emerald-400 font-mono">
                                +{venue.events.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3 justify-between">
                          <div className="flex items-center gap-2 text-white/50 group-hover:text-white/90 transition-colors duration-300">
                            <span className="text-xs sm:text-sm font-medium">View Schedule & Details</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>

                          <div className="flex items-center gap-2">
                            {venue.coordinates && (
                              <button
                                onClick={(e) => openInMaps(e, venue.coordinates)}
                                className="p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-md text-white hover:bg-white/10 transition-all duration-200"
                                aria-label={`Open ${venue.name} in maps`}
                              >
                                <Image src="/page-assets/googlemap.svg" className="pointer-events-none" alt="Open in maps" width={75} height={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <AnimatePresence>
            {selectedVenue && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedVenue(null)}
                className="fixed inset-0 bg-black/85 backdrop-blur-md z-40 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-2xl w-full bg-gradient-to-br from-zinc-900/90 to-zinc-950/95 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 md:p-10 max-h-[90vh] overflow-y-auto"
                >
                  <button
                    onClick={() => setSelectedVenue(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 z-50 cursor-pointer"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs sm:text-sm text-white/70">
                        {selectedVenue.block}
                      </div>
                      {selectedVenue.events && selectedVenue.events.length > 0 && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>{selectedVenue.events.length} Events Scheduled</span>
                        </div>
                      )}
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent tracking-tight uppercase">
                      {selectedVenue.name}.
                    </h2>
                  </div>

                  {selectedVenue.images && selectedVenue.images.length > 0 && (
                    <div className="mb-5">
                      <div className={`${selectedVenue.images.length > 1 ? 'overflow-x-auto scrollbar-hide' : ''}`}>
                        <div className={`flex gap-3 ${selectedVenue.images.length > 1 ? 'w-max' : ''}`}>
                          {selectedVenue.images.map((img, idx) => (
                            <div
                              key={idx}
                              className={`relative ${
                                selectedVenue.images && selectedVenue.images.length === 1
                                  ? 'w-full h-44 sm:h-64'
                                  : 'w-64 sm:w-80 h-40 sm:h-48'
                              } rounded-xl overflow-hidden flex-shrink-0 bg-black/30 border border-white/10`}
                            >
                              <Image
                                src={img}
                                alt={`${selectedVenue.name} ${idx + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      {selectedVenue.images.length > 1 && (
                        <p className="text-[11px] text-white/40 mt-1.5 text-center">Scroll horizontally to view all images</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                        Location & Access
                      </h3>
                      <div className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 mt-1 text-white/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-base sm:text-lg text-white/95">
                          {selectedVenue.location}
                          <span className="text-white/40 text-sm ml-2">({selectedVenue.floor})</span>
                        </p>
                      </div>
                    </div>

                    {selectedVenue.description && (
                      <div>
                        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                          About Venue
                        </h3>
                        <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                          {selectedVenue.description}
                        </p>
                      </div>
                    )}

                    {selectedVenue.events && selectedVenue.events.length > 0 && (
                      <div className="pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            Events & Timeline
                          </h3>
                          <span className="text-[11px] font-mono text-emerald-400">Festival Day</span>
                        </div>
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {selectedVenue.events.map((ev, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-white text-sm">
                                    {ev.name}
                                  </span>
                                  {ev.category && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">
                                      {ev.category}
                                    </span>
                                  )}
                                </div>
                                {ev.location && (
                                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                                    <svg className="w-3 h-3 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{ev.location}</span>
                                  </div>
                                )}
                              </div>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono whitespace-nowrap self-start sm:self-auto">
                                <svg className="w-3 h-3 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                  <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>{ev.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-white/60">
                        <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs sm:text-sm">
                          Look for venue signage and guides marked with {selectedVenue.name}
                        </span>
                      </div>
                      <div className="mt-4 flex gap-3">
                        {selectedVenue.coordinates && (
                          <button
                            onClick={(e) => openInMaps(e, selectedVenue.coordinates)}
                            className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-xs sm:text-sm text-white hover:bg-white/20 transition-all duration-200"
                          >
                            Open in Google Maps
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedVenue(null)}
                          className="px-4 py-2 bg-white text-black font-medium rounded-md text-xs sm:text-sm hover:opacity-90 transition-all"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Navigation Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Follow the Trail</h3>
                <p className="text-sm text-white/60">Look for Starlight Trail markers connecting blocks</p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Ask Volunteers</h3>
                <p className="text-sm text-white/60">Our team is ready to guide you to any venue</p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Plan Ahead</h3>
                <p className="text-sm text-white/60">Check event schedules to navigate efficiently</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-screen bg-black">
        <Footer hideHero />
      </footer>
    </div>
  );
}