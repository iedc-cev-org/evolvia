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
//if u need to add raw data then use this otherwise make this [] empty or dont use this, instead connect postgress...(me who reworked dont remember wtf i did)
//im using raw data cause we got db limit and optimisation limit in web so....(and doing this after event)
export const preEvents: PreEvent[] = [
  { id: 1, name: "Confluence", slug: "confluence", link: "https://discover.snaptiqz.com/event/WSUdSJJnzwS5fcYRSRvWz", dateTime: "17 September 2026", image: "/pre-events/confluence.webp", order_index: 1, isClosed: true, isCompleted: true, type: "pre_event" },
  { id: 2, name: "Idea To Impact", slug: "ideatoimpact", link: "https://discover.snaptiqz.com/event/HM9MC1crHmUKj5Iox4Ttn", dateTime: "Sep 21 2026 | 7PM - 8PM", image: "/pre-events/ITM.webp", order_index: 2, isClosed: true, isCompleted: true, type: "pre_event" },
  { id: 3, name: "Out Of Syllabus", slug: "outofsyllabus", link: "https://discover.snaptiqz.com/event/cigTcdf50p-ZWtYBQqeul", dateTime: "Sep 20 2026 | 7PM - 8PM", image: "/pre-events/OOS2.webp", order_index: 3, isClosed: true, isCompleted: true, type: "pre_event" },
  { id: 4, name: "BIT BURST 3.0", slug: "bitburst", link: "https://discover.snaptiqz.com/event/c77eoclUVT29vKEsjaAqo", dateTime: "29 SEP 2026", image: "/pre-events/bitburst.webp", order_index: 4, isClosed: true, isCompleted: true, type: "pre_event" },
  { id: 5, name: "Thrive", slug: "thrive", link: "https://discover.snaptiqz.com/event/_FXsXF5_VWpPHvmhhGoWT", dateTime: "30 SEP 2026", venue: "College of Engineering Vadakara", image: "/pre-events/thrive.webp", order_index: 5, isClosed: true, isCompleted: true, type: "pre_event" }
];
export const StallsAndExpos: StallAndExpo[] = [
  { id: 1, name: "Bethleham", image: "/stalls/bethleham.webp", order_index: 1 },
  { id: 2, name: "Beyond the Games", image: "/stalls/btg.webp", order_index: 2 },
  { id: 3, name: "Euphoria", image: "/stalls/euph.webp", order_index: 3 },
  { id: 4, name: "Maker Station", image: "/stalls/maker station.webp", order_index: 4 },
  { id: 5, name: "Paper Forge", image: "/stalls/pf 3.webp", order_index: 5 },
  { id: 6, name: "Starship", image: "/stalls/starship.webp", order_index: 6 },
  { id: 7, name: "StartupStreet", image: "/stalls/strp street.webp", order_index: 7 },
  { id: 8, name: "Wevolve", image: "/stalls/wevolve.webp", order_index: 8 },
];
export const Sponsors: Sponsor[] = [
  { id: 1, name: "Snaptiqz", image: "/sponsors/snaptiqz.webp", order_index: 1 },
  { id: 2, name: "MadeStore", image: "/sponsors/madestore.webp", order_index: 2 },
  { id: 3, name: "Techdealer", image: "/sponsors/techdealer.webp", order_index: 3 },
];
export const Events: Event[] = [
  { id: 1, name: "PITCH BOX", slug: "pitchbox", dateTime: "1 OCT 2026 | 12:30 PM - 3:30 PM", venue: "ASTRA (ASAP Room)", link: "https://discover.snaptiqz.com/event/zAoBIh5grmMMBbt6PshN9", image: "/events/pitchbox.webp", isClosed: true, isCompleted: true, type: "main_event", order_index: 1 },
  { id: 2, name: "QUIZZARD COLLEGE", slug: "quizzardcollege", dateTime: "1 OCT 2026", venue: "COSMA (CS B101)", link: "https://discover.snaptiqz.com/event/_rYIyVD1FhyR5pfxEb3hb", image: "/events/q_c.webp", isClosed: true, isCompleted: true, type: "main_event", order_index: 2 },
  { id: 3, name: "DEAL OR NO DEAL", slug: "deal-or-no-deal", dateTime: "1 Oct 2026", venue: "LYRA (Chemistry Lab)", link: "https://discover.snaptiqz.com/event/U5oeXAneRgYELdtQ1qnvn", image: "/events/dond.webp", isClosed: true, isCompleted: true, type: "main_event", order_index: 3 },
  { id: 4, name: "COSMIC QUEST", slug: "cosmicquest", dateTime: "1 OCT 2026", venue: "LYRA (Chemistry Lab)", link: "https://discover.snaptiqz.com/event/sWXCcocQSzNojodJ3yGf0", image: "/events/cosmic.webp", isClosed: true, isCompleted: true, type: "main_event", order_index: 4 },
  { id: 5, name: "LINE FOLLOWER", slug: "linefollower", dateTime: "1 OCT 2026", venue: "PEGASUS (EC Hall 2)", link: "https://discover.snaptiqz.com/event/2fZFecW-ye8nxizUrlrBk", image: "/events/lf.webp", isClosed: true, isCompleted: true, type: "main_event", order_index: 5 },
  { id: 6, name: "Capture the Flag", slug: "ctf", dateTime: "1 Oct 2026", venue: "ECLIPSE (CCF Lab)", link: "https://discover.snaptiqz.com/event/tivsE18Y2i2CJn-v6B1HJ", image: "/events/ctf.webp", isClosed: true, isCompleted: true, type: "main_event", order_index: 6 },
  { id: 7, name: "Cyberpulse", slug: "cyberpulse", dateTime: "1 Oct 2026", venue: "ASTRA (ASAP Room)", link: "https://fossunited.org/c/college-of-engineering-vadakara/cyberpulse/rsvp", image: "/events/cp.webp", isClosed: true, isCompleted: true, type: "main_event", order_index: 7 },
  { id: 8, name: "SELL YOUR IDEA", slug: "sellyouridea", dateTime: "1 OCT 2026 | 10:00 AM - 11:00 AM", venue: "ZENITH (Mini Auditorium)", link: "https://discover.snaptiqz.com/event/Aep6g8b4Qu7SlCIl0pVzp", image: "/events/syi.webp", isClosed: true, isCompleted: true, type: "main_event", order_index: 8 },
  { id: 9, name: "MIND2MAKE", slug: "mind2make", dateTime: "1 Oct 2026", venue: "ZENITH (Mini Auditorium)", link: "https://discover.snaptiqz.com/event/kW06FYzG3dMMLKMXwH_gv", image: "/events/m2m.webp", isClosed: true, isCompleted: true, type: "main_event", order_index: 9 },
  { id: 10, name: "STARTUP STORIES", slug: "startupstories", dateTime: "1 OCT 2026 | 1:30 pm - 3:30 pm", venue: "ZENITH (Mini Auditorium)", link: "https://discover.snaptiqz.com/event/bolPN32QvapChjahe_i4S", image: "/events/sst_w.webp", isClosed: true, isCompleted: true, type: "main_event", order_index: 10 },


];
export const Speakers: Speaker[] = [
  { id: 1, name: "Akash Akhilesh", designation: "Founder and director morfuel India Pvt Ltd", expertise: "", image: "/speakers/akash_1.webp", order_index: 1 },
  { id: 2, name: "Misla U", designation: "Co - founder of Latech Academy", image: "/speakers/misla.webp", order_index: 2 },
  { id: 3, name: "Afsal Salim", designation: "Founder German Cafe Academy", expertise: "", image: "/speakers/afsal.webp", order_index: 3 },
  { id: 4, name: "Abrar Salim", designation: "CEO A brar Future Tech LLP", expertise: "", image: "/speakers/abrar.webp", order_index: 4 },
  { id: 5, name: "Jasim Nasar", designation: "Founder and CEO Conspace group", expertise: "", image: "/speakers/jasim.webp", order_index: 5 },
  { id: 6, name: "Danish shabeeb", designation: "Founder-D School of Sales", expertise: "", image: "/speakers/danish.webp", order_index: 6 },
  { id: 7, name: "KIRAN K S", designation: "Both ceo and director at Lofritex IT Solutions LLP & txtudio coretech pvt ltd", expertise: "", image: "/speakers/kiran.webp", order_index: 6 },

];

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
  image: row.poster_url || row.image_url || row.image || "/sponsors/madestore.webp",
  order_index: row.order_index ?? index,
});

//used for raw and db fetching work at same time
function mergeAndSort<T extends { id?: number | string; name?: string; order_index?: number }>(
  rawList: T[],
  dbList: T[]
): T[] {
  const map = new Map<string | number, T>();

  for (const item of rawList) {
    const key = item.id ?? item.name ?? JSON.stringify(item);
    map.set(key, item);
  }

  for (const item of dbList) {
    const key = item.id ?? item.name ?? JSON.stringify(item);
    map.set(key, item);
  }

  return Array.from(map.values()).sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
  );
}

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
    const dbItems = (data as RawDatabaseRow[]).map((row, index) => mapEventFromDb(row, index, "pre_event"));
    return mergeAndSort(preEvents, dbItems);
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
    const dbItems = (data as RawDatabaseRow[]).map((row, index) => mapEventFromDb(row, index, "main_event"));
    return mergeAndSort(Events, dbItems);
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
    const dbItems = (data as RawDatabaseRow[]).map(mapStallFromDb);
    return mergeAndSort(StallsAndExpos, dbItems);
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
    const dbItems = (data as RawDatabaseRow[]).map(mapSpeakerFromDb);
    return mergeAndSort(Speakers, dbItems);
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
    const dbItems = (data as RawDatabaseRow[]).map(mapSponsorFromDb);
    return mergeAndSort(Sponsors, dbItems);
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
