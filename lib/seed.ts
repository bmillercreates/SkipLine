// Seed data: 8 fictional bars in the fictional college town of Larkspur Falls.
// Used by `prisma db seed` and by the site itself to keep the next 7 nights stocked.
import type { PrismaClient } from "@prisma/client";
import { addDays, dateStr } from "./dates";

type SeedVenue = {
  slug: string;
  name: string;
  shortName: string;
  address: string;
  blurb: string;
  hours: string;
  colorA: string;
  colorB: string;
  motif: string;
  featured?: { title: string; detail: string; offset: number };
  prices: { skip: number; cover: number; combo: number };
};

const VENUES: SeedVenue[] = [
  {
    slug: "copper-kettle",
    name: "The Copper Kettle",
    shortName: "COPPER KETTLE",
    address: "112 N Juniper St, Larkspur Falls",
    blurb: "Two-story sports bar with a rooftop patio and the loudest Thursday crowd in town.",
    hours: "Thu–Sat 8 PM – 2 AM",
    colorA: "#7c2d12",
    colorB: "#f59e0b",
    motif: "rays",
    featured: { title: "KETTLE KICKOFF THURSDAY", detail: "$3 pitchers until 11", offset: 1 },
    prices: { skip: 1000, cover: 500, combo: 1400 },
  },
  {
    slug: "neon-moose",
    name: "Neon Moose",
    shortName: "NEON MOOSE",
    address: "127 E Quarry St, Larkspur Falls",
    blurb: "Dance floor, light walls, and a DJ booth shaped like a moose head.",
    hours: "Wed–Sat 9 PM – 2 AM",
    colorA: "#4c1d95",
    colorB: "#ec4899",
    motif: "grid",
    featured: { title: "GLOW NIGHT: NEON MOOSE", detail: "Free glow sticks at the door", offset: 2 },
    prices: { skip: 1500, cover: 1000, combo: 2200 },
  },
  {
    slug: "pinecone-pub",
    name: "Pinecone Pub",
    shortName: "PINECONE",
    address: "18 S Alder St, Larkspur Falls",
    blurb: "Cozy cabin-style pub with 30 taps and trivia every Tuesday.",
    hours: "Daily 4 PM – 1 AM",
    colorA: "#14532d",
    colorB: "#84cc16",
    motif: "dots",
    prices: { skip: 800, cover: 300, combo: 1000 },
  },
  {
    slug: "lantern-room",
    name: "Lantern Room",
    shortName: "LANTERN",
    address: "45 Foundry Ln, Larkspur Falls",
    blurb: "Speakeasy cocktails downstairs, live bands upstairs on weekends.",
    hours: "Thu–Sat 7 PM – 2 AM",
    colorA: "#78350f",
    colorB: "#fde047",
    motif: "stars",
    featured: { title: "LANTERN LIVE: THE MOTHBALLS", detail: "Doors 9 PM", offset: 3 },
    prices: { skip: 1200, cover: 800, combo: 1800 },
  },
  {
    slug: "velvet-tractor",
    name: "Velvet Tractor",
    shortName: "VELVET TRACTOR",
    address: "220 Granary St, Larkspur Falls",
    blurb: "Country bar with line dancing, a mechanical hay bale, and cheap well drinks.",
    hours: "Thu–Sat 8 PM – 2 AM",
    colorA: "#881337",
    colorB: "#fb7185",
    motif: "grid",
    prices: { skip: 1000, cover: 700, combo: 1500 },
  },
  {
    slug: "owl-and-anchor",
    name: "The Owl & Anchor",
    shortName: "OWL & ANCHOR",
    address: "301 Mill Race Rd, Larkspur Falls",
    blurb: "Nautical dive bar on the river with a jukebox older than you.",
    hours: "Daily 5 PM – 2 AM",
    colorA: "#0c4a6e",
    colorB: "#22d3ee",
    motif: "waves",
    prices: { skip: 1000, cover: 500, combo: 1300 },
  },
  {
    slug: "basement-bluebird",
    name: "Basement Bluebird",
    shortName: "BLUEBIRD",
    address: "9 Larkspur Ave (Lower Level), Larkspur Falls",
    blurb: "Underground karaoke den. Sign-up sheet fills by 10.",
    hours: "Tue–Sat 8 PM – 2 AM",
    colorA: "#1e3a8a",
    colorB: "#60a5fa",
    motif: "rays",
    prices: { skip: 700, cover: 500, combo: 1100 },
  },
  {
    slug: "hatchs-hideaway",
    name: "Hatch's Hideaway",
    shortName: "HATCH'S",
    address: "204 Wren Ave, Larkspur Falls",
    blurb: "Arcade bar with pinball, skee-ball, and a patio fire pit.",
    hours: "Daily 3 PM – 1 AM",
    colorA: "#134e4a",
    colorB: "#2dd4bf",
    motif: "dots",
    prices: { skip: 900, cover: 400, combo: 1200 },
  },
];

const DESCRIPTIONS: Record<string, string> = {
  SKIP: "Skip to the front of the line. Show door staff this pass to redeem. DOES NOT INCLUDE COVER. Doesn't guarantee immediate entry. Must be 21+ with valid ID.",
  COVER: "Prepaid cover charge. You still wait in the regular line. Must be 21+ with valid ID.",
  COMBO: "Skip the line AND cover in one pass. Must be 21+ with valid ID.",
};

const NIGHTS = 7;

// Safe to run repeatedly: venues are refreshed and pass options are added for
// upcoming nights without touching passes that were already bought.
export async function seed(prisma: PrismaClient) {
  const today = dateStr();
  // Bars removed from the list above are removed from the site too.
  await prisma.venue.deleteMany({ where: { slug: { notIn: VENUES.map((v) => v.slug) } } });
  for (const [i, v] of VENUES.entries()) {
    const data = {
      name: v.name,
      shortName: v.shortName,
      address: v.address,
      blurb: v.blurb,
      hours: v.hours,
      colorA: v.colorA,
      colorB: v.colorB,
      motif: v.motif,
      featuredTitle: v.featured?.title ?? null,
      featuredDetail: v.featured?.detail ?? null,
      featuredDate: v.featured ? addDays(today, v.featured.offset) : null,
    };
    const venue = await prisma.venue.upsert({
      where: { slug: v.slug },
      update: data,
      create: { slug: v.slug, ...data },
    });

    for (let day = 0; day < NIGHTS; day++) {
      const date = addDays(today, day);
      const options = [
        { kind: "SKIP", name: "Skip the Line", priceCents: v.prices.skip, quantity: 40 },
        { kind: "COVER", name: "Cover", priceCents: v.prices.cover, quantity: 80 },
      ];
      // Busier nights get a combo pass.
      if (day % 2 === 1) {
        options.push({ kind: "COMBO", name: "Skip + Cover", priceCents: v.prices.combo, quantity: 25 });
      }
      for (const o of options) {
        // A few options start sold out so the "Sold Out" state is visible.
        const soldOut = (i + day) % 5 === 2 && o.kind === "COVER";
        await prisma.passOption.upsert({
          where: { venueId_name_date: { venueId: venue.id, name: o.name, date } },
          update: {},
          create: {
            venueId: venue.id,
            date,
            kind: o.kind,
            name: o.name,
            description: DESCRIPTIONS[o.kind],
            priceCents: o.priceCents,
            quantity: o.quantity,
            sold: soldOut ? o.quantity : Math.floor(o.quantity * 0.3),
          },
        });
      }
    }
  }
  return VENUES.length;
}

// Called on page loads: if the last of the next 7 nights isn't stocked yet
// (e.g. the site has been up for a few days), top everything up once.
let checked: { date: string; done: Promise<void> } | null = null;

export function ensureUpcomingNights(prisma: PrismaClient) {
  const today = dateStr();
  if (checked?.date === today) return checked.done;
  const done = (async () => {
    const last = addDays(today, NIGHTS - 1);
    const stocked = await prisma.passOption.findFirst({ where: { date: last } });
    if (!stocked) await seed(prisma);
  })().catch((e) => {
    checked = null; // try again on the next request
    console.error("Couldn't stock upcoming nights", e);
  });
  checked = { date: today, done };
  return done;
}
