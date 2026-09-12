import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface PreEvent {
  id?: number | string;
  slug?: string;
  name: string;
  image: string;
  completed_image?: string;
  spec?: string;
  dateTime?: string;
  venue?: string;
  link?: string;
  description?: string;
  isClosed?: boolean;
  isCompleted?: boolean;
  order_index?: number;
  type?: string;
}

export interface Event {
  id: number | string;
  slug?: string;
  name: string;
  image: string;
  completed_image?: string;
  spec?: string;
  dateTime?: string;
  venue?: string;
  link?: string;
  description?: string;
  isClosed?: boolean;
  isCompleted?: boolean;
  order_index?: number;
  type?: string;
}

export interface StallAndExpo {
  id?: number | string;
  name: string;
  image: string;
  description?: string;
  order_index?: number;
}

export interface Speaker {
  id?: number | string;
  name: string;
  designation?: string;
  expertise?: string;
  image: string;
  order_index?: number;
}

export interface Sponsor {
  id?: number | string;
  name: string;
  image: string;
  order_index?: number;
}

export const preEvents: PreEvent[] = [];
export const StallsAndExpos: StallAndExpo[] = [];
export const Sponsors: Sponsor[] = [];
export const Events: Event[] = [];
export const Speakers: Speaker[] = [];

interface RawDatabaseRow {
  id?: number | string;
  slug?: string;
  name?: string;
  title?: string;
  poster_url?: string;
  image_url?: string;
  image?: string;
  completed_poster_url?: string;
  completed_image_url?: string;
  completed_image?: string;
  spec?: string;
  specification?: string;
  tagline?: string;
  date_time?: string;
  dateTime?: string;
  venue?: string;
  location?: string;
  link?: string;
  registration_link?: string;
  url?: string;
  description?: string;
  is_closed?: boolean;
  isClosed?: boolean;
  is_completed?: boolean;
  isCompleted?: boolean;
  order_index?: number;
  type?: string;
  designation?: string;
  expertise?: string;
}

const mapEventFromDb = (row: RawDatabaseRow, index: number, fallbackType: string): Event => {
  const eventName = row.name || row.title || `Event ${index + 1}`;
  const generatedSlug =
    row.slug ||
    eventName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  return {
    id: row.id ?? index + 1,
    slug: generatedSlug,
    name: eventName,
    image: row.poster_url || row.image_url || row.image || "/events/alumini.webp",
    completed_image: row.completed_poster_url || row.completed_image_url || row.completed_image || undefined,
    spec: row.spec || row.specification || row.tagline || "",
    dateTime: row.date_time || row.dateTime || "",
    venue: row.venue || row.location || "",
    link: row.link || row.registration_link || row.url || "",
    description: row.description || "",
    isClosed: Boolean(row.is_closed ?? row.isClosed ?? false),
    isCompleted: Boolean(row.is_completed ?? row.isCompleted ?? false),
    order_index: row.order_index ?? index,
    type: row.type || fallbackType,
  };
};

const mapStallFromDb = (row: RawDatabaseRow, index: number): StallAndExpo => ({
  id: row.id ?? index + 1,
  name: row.name || row.title || `Stall ${index + 1}`,
  image: row.poster_url || row.image_url || row.image || "/stalls/innoverse.webp",
  description: row.description || "",
  order_index: row.order_index ?? index,
});

const mapSpeakerFromDb = (row: RawDatabaseRow, index: number): Speaker => ({
  id: row.id ?? index + 1,
  name: row.name || row.title || `Speaker ${index + 1}`,
  designation: row.designation || "",
  expertise: row.expertise || "",
  image: row.poster_url || row.image_url || row.image || "/speakers/nandu_krishna.webp",
  order_index: row.order_index ?? index,
});

const mapSponsorFromDb = (row: RawDatabaseRow, index: number): Sponsor => ({
  id: row.id ?? index + 1,
  name: row.name || row.title || `Sponsor ${index + 1}`,
  image: row.poster_url || row.image_url || row.image || "/sponsors/made_cover.webp",
  order_index: row.order_index ?? index,
});

export async function fetchPreEvents(): Promise<PreEvent[]> {
  if (!isSupabaseConfigured) return preEvents;
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("type", "pre_event")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return preEvents;
    }
    return (data as RawDatabaseRow[]).map((row, index) => mapEventFromDb(row, index, "pre_event"));
  } catch {
    return preEvents;
  }
}

export async function fetchMainEvents(): Promise<Event[]> {
  if (!isSupabaseConfigured) return Events;
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("type", "main_event")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return Events;
    }
    return (data as RawDatabaseRow[]).map((row, index) => mapEventFromDb(row, index, "main_event"));
  } catch {
    return Events;
  }
}

export async function fetchStallsAndExpos(): Promise<StallAndExpo[]> {
  if (!isSupabaseConfigured) return StallsAndExpos;
  try {
    const { data, error } = await supabase
      .from("stalls_and_expos")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return StallsAndExpos;
    }
    return (data as RawDatabaseRow[]).map(mapStallFromDb);
  } catch {
    return StallsAndExpos;
  }
}

export async function fetchSpeakers(): Promise<Speaker[]> {
  if (!isSupabaseConfigured) return Speakers;
  try {
    const { data, error } = await supabase
      .from("speakers")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return Speakers;
    }
    return (data as RawDatabaseRow[]).map(mapSpeakerFromDb);
  } catch {
    return Speakers;
  }
}

export async function fetchSponsors(): Promise<Sponsor[]> {
  if (!isSupabaseConfigured) return Sponsors;
  try {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return Sponsors;
    }
    return (data as RawDatabaseRow[]).map(mapSponsorFromDb);
  } catch {
    return Sponsors;
  }
}

export interface EvolviaDataset {
  preEvents: PreEvent[];
  events: Event[];
  stallsAndExpos: StallAndExpo[];
  stalls: StallAndExpo[];
  speakers: Speaker[];
  sponsors: Sponsor[];
}

export async function fetchAllEvolviaData(): Promise<EvolviaDataset> {
  const [preEventsRes, eventsRes, stallsRes, speakersRes, sponsorsRes] = await Promise.allSettled([
    fetchPreEvents(),
    fetchMainEvents(),
    fetchStallsAndExpos(),
    fetchSpeakers(),
    fetchSponsors(),
  ]);

  const resolvedPre = preEventsRes.status === "fulfilled" && Array.isArray(preEventsRes.value) ? preEventsRes.value : preEvents;
  const resolvedEvents = eventsRes.status === "fulfilled" && Array.isArray(eventsRes.value) ? eventsRes.value : Events;
  const resolvedStalls = stallsRes.status === "fulfilled" && Array.isArray(stallsRes.value) ? stallsRes.value : StallsAndExpos;
  const resolvedSpeakers = speakersRes.status === "fulfilled" && Array.isArray(speakersRes.value) ? speakersRes.value : Speakers;
  const resolvedSponsors = sponsorsRes.status === "fulfilled" && Array.isArray(sponsorsRes.value) ? sponsorsRes.value : Sponsors;

  return {
    preEvents: resolvedPre,
    events: resolvedEvents,
    stallsAndExpos: resolvedStalls,
    stalls: resolvedStalls,
    speakers: resolvedSpeakers,
    sponsors: resolvedSponsors,
  };
}
