import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function PreEventpage() {
  return (
   
     <div className="absolute inset-0 flex items-center justify-center p-4">
     {/* Events Grid */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">PRE EVENT</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Event 1 */}
          <div className="bg-white/10 rounded-xl p-6 text-center hover:bg-white/20 transition">
            <Image src="/event1.jpg" alt="Event 1" width={400} height={250} className="rounded-lg mb-4" />
            <h3 className="text-xl font-semibold mb-2">Event One</h3>
            <p className="text-sm text-gray-300 mb-4">Short description about event one.</p>
            <Link href="/events/1" className="text-purple-400 hover:underline">
              Learn More
            </Link>
          </div>

          {/* Event 2 */}
          <div className="bg-white/10 rounded-xl p-6 text-center hover:bg-white/20 transition">
            <Image src="/event2.jpg" alt="Event 2" width={400} height={250} className="rounded-lg mb-4" />
            <h3 className="text-xl font-semibold mb-2">Event Two</h3>
            <p className="text-sm text-gray-300 mb-4">Short description about event two.</p>
            <Link href="/events/2" className="text-purple-400 hover:underline">
              Learn More
            </Link>
          </div>

          {/* Event 3 */}
          <div className="bg-white/10 rounded-xl p-6 text-center hover:bg-white/20 transition">
            <Image src="/event3.jpg" alt="Event 3" width={400} height={250} className="rounded-lg mb-4" />
            <h3 className="text-xl font-semibold mb-2">Event Three</h3>
            <p className="text-sm text-gray-300 mb-4">Short description about event three.</p>
            <Link href="/events/3" className="text-purple-400 hover:underline">
              Learn More
            </Link>
          </div>
        </div>
      </section>

 </div>
  )
}
