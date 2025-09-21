import { getEventsByType } from "@/components/eventLists";
import Image from "next/image";

export default function Page({ params }: { params: { events: string } }) {
  const { events } = params;
  const filteredEvents = getEventsByType(events);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black relative">
      <div className="absolute top-10">
        <Image src="/logo.webp" alt="logo" width={150} height={150} />
      </div>
      <h1 className="text-white text-4xl font-bold mb-8 mt-48">
        {events} Events
      </h1>
      <div className="space-y-4 w-full max-w-md">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-black/50 border border-white/20 rounded-lg text-white"
            >
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm opacity-80">{item.time}</p>
              <p className="text-sm opacity-80">{item.venue}</p>
            </div>
          ))
        ) : (
          <p className="text-white text-lg">No events found for this category.</p>
        )}
      </div>
    </div>
  );
}
