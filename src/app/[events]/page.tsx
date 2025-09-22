import { getEventsByType } from "@/components/eventLists";
import Image from "next/image";


export default function Page({ params }: { params: { events: string } }) {
  const { events } = params;
  const filteredEvents = getEventsByType(events);

  return (
    <div className="w-full min-h-screen relative">
      <div className="px-4 py-4 lg:py-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center py-2 lg:py-4 relative">
          <Image src="/logo.webp" alt="logo" width={140} height={140} />
          <Image
            src="/iedclogo.webp"
            alt="IEDC logo"
            width={70}
            height={70}
            className="object-contain w-18 h-18"
          />
        </div>
        <div className="w-full min-h-full flex justify-center py-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl text-white max-w-4xl 
                        bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
            >

                {/* Event image wrapper */}
                <div className="relative w-32 h-32 bg-amber-600 mb-4">
                  <Image
                    src="/vercel.svg"
                    alt="Event Image"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="space-y-2 my-2 text-justify font-extralight">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm opacity-80">{item.time}</p>
                  <p className="text-sm opacity-80">{item.venue}</p>
                </div>
                <div className="mt-6">
                  <p>{item.description}</p>
                </div>
                <button className="bg-white text-black px-6 py-4 rounded-sm my-4">
                  Registration
                </button>
              </div>
            ))
          ) : (
            <p className="text-white text-lg">No events found for this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}
