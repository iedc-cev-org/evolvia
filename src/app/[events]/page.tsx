import { getEventsByType } from "@/components/eventLists";
import Image from "next/image";

export default function Page({ params }: { params: { events: string } }) {
  const { events } = params;
  const filteredEvents = getEventsByType(events);

  return (
    <div className="w-full min-h-screen bg-black text-white flex justify-center items-center p-4 relative">
      {/* Evolvia logo (outside left) */}
      <div className="absolute top-8 left-6">
        <Image src="/logo.webp" alt="Evolvia logo" width={100} height={100} />
      </div>

      {/* IEDC logo (outside right) */}
      <div className="absolute top-8 right-6">
        <Image
          src="/iedclogo.webp"
          alt="IEDC logo"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>

      {/* Ticket Card */}
      <div className="border-2 border-white max-w-sm w-full rounded-xl overflow-hidden font-mono relative">
        {/* Header */}
        <div className="text-center py-4 border-b-2 border-white tracking-widest">
          <h1 className="text-5xl font-extrabold">EVENT</h1>
        </div>

        {/* Poster */}
        <div className="w-full flex justify-center border-b-2 border-white">
          <Image
            src="/your-image-path.png" // replace with your poster
            alt="Event Poster"
            width={320}
            height={250}
            className="object-contain"
          />
        </div>

        {/* Date Section */}
        <div className="flex justify-between items-center text-center py-3 border-b-2 border-white text-sm tracking-wider">
          <span>SEP</span>
          <span className="text-lg font-bold">25TH</span>
          <span>2025</span>
        </div>

        {/* Dotted separator (ticket cut line) */}
        <div className="flex items-center justify-center">
          <div className="w-3 h-3 bg-black border-2 border-white rounded-full -ml-2"></div>
          <div className="flex-1 border-t-2 border-dashed border-white"></div>
          <div className="w-3 h-3 bg-black border-2 border-white rounded-full -mr-2"></div>
        </div>

        {/* Events List */}
        <div className="text-left py-6 px-6 space-y-6 text-sm">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((item, index) => (
              <div key={index} className="space-y-3">
                <h2 className="text-lg font-bold">{item.name}</h2>
                <p className="text-sm text-gray-300">
                  {item.time} || {item.venue}
                </p>
                <p className="text-gray-200 text-justify">{item.description}</p>
              </div>
            ))
          ) : (
            <p>No events found for this category.</p>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center items-center bg-white text-black font-bold px-6 py-3 text-sm">
          <button className="bg-green-500 text-black px-6 py-2 rounded-md hover:bg-blue-200">
            REGISTER NOW
          </button>
        </div>
      </div>
    </div>
  );
}
