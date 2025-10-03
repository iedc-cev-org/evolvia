"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from '@/components/Footer';
import venuesData from '@/data/venues.json';

interface Venue {
  id: string;
  name: string;
  location: string;
  block: string;
  description?: string;
  images?: string[];
}

const venues: Venue[] = venuesData;

export default function MapPage() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [activeBlock, setActiveBlock] = useState<string>("all");

  const blocks = ["all", "Main Block", "Celestara (MCA Block)", "Pathway", "Special Zone"];

  const filteredVenues = activeBlock === "all" 
    ? venues 
    : venues.filter(v => v.block === activeBlock);

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

      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-30">
        {/* <Image
          src="/page-assets/iedclogo.webp"
          alt="IEDC Logo"
          width={60}
          height={60}
          className="opacity-90 w-12 h-12 md:w-16 md:h-16"
        /> */}
      </div>

      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-30">
        <Link href="/">
          <button className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm hover:bg-white/20 transition-all duration-300">
            Home
          </button>
        </Link>
      </div>

      <div className="relative z-10 pt-20 md:pt-24 pb-12 px-4 md:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 mix-blend-exclusion">
              Venue Map
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Navigate through our cosmic venues across the campus
            </p>
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
                      ? "bg-white text-black"
                      : "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  {block === "all" ? "All Venues" : block}
                </button>
              ))}
            </div>
          </motion.div>

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
                <div className="relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>

                  <div className="p-4 md:p-6">
                    <div className="rounded-lg overflow-hidden h-18 relative bg-black/10">
                      {venue.images && venue.images.length > 0 && (
                        <Image
                          src="/map-assets/image.png"
                          alt={venue.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/60"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white text-center px-4 mix-blend-exclusion">
                          {venue.name}.
                        </h3>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs md:text-sm text-white/70 mb-3">
                        {venue.block}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm md:text-base text-white/70">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{venue.location}</span>
                      </div>
                      {venue.description && (
                        <p className="text-white/60 text-sm mt-3 group-hover:text-white/80 transition-colors duration-300 line-clamp-2">
                          {venue.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-white/50 group-hover:text-white/80 transition-colors duration-300">
                        <span className="text-sm">View Details</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selectedVenue && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedVenue(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-2xl w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12"
                >
                  <button
                    onClick={() =>  setSelectedVenue(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 z-50 cursor-pointer"
                  >
                    <svg 
                    className="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="mb-4">
                    <div className="inline-block px-4 py-2 rounded-full bg-white/10 text-sm text-white/70 mb-4">
                      {selectedVenue.block}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent tracking-tight">
                      {selectedVenue.name}.
                    </h2>
                  </div>

                  {selectedVenue.images && selectedVenue.images.length > 0 && (
                    <div className="mb-4">
                      <div className={`${selectedVenue.images.length > 1 ? 'overflow-x-auto scrollbar-hide' : ''}`}>
                        <div className={`flex gap-3 ${selectedVenue.images.length > 1 ? 'w-max' : ''}`}>
                          {selectedVenue.images.map((img, idx) => (
                            <div key={idx} className={`relative ${selectedVenue.images && selectedVenue.images.length === 1 ? 'w-full' : 'w-80'} h-48 rounded-lg overflow-hidden flex-shrink-0`}>
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
                        <p className="text-xs text-white/50 mt-2 text-center">Scroll horizontally to view all images</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">
                        Location
                      </h3>
                      <div className="flex items-start gap-3">
                        <svg className="w-4 h-4 mt-1 text-white/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-lg text-white/90">{selectedVenue.location}</p>
                      </div>
                    </div>

                    {selectedVenue.description && (
                      <div>
                        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">
                          About
                        </h3>
                        <p className="text-md text-white/80 leading-relaxed">
                          {selectedVenue.description}
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-white/60">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">
                          Look for venue signage with the {selectedVenue.name} emblem
                        </span>
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