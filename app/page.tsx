import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ensureUpcomingNights } from "@/lib/seed";
import { dateLabel, dateStr } from "@/lib/dates";
import { usd } from "@/lib/money";
import Header from "@/components/Header";
import VenueArt from "@/components/VenueArt";
import { ChevronRight } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function VenuesPage() {
  await ensureUpcomingNights(prisma);
  const today = dateStr();
  const venues = await prisma.venue.findMany({
    orderBy: { name: "asc" },
    include: { options: { where: { date: today }, orderBy: { priceCents: "asc" } } },
  });
  const featured = venues
    .filter((v) => v.featuredTitle && v.featuredDate && v.featuredDate >= today)
    .sort((a, b) => a.featuredDate!.localeCompare(b.featuredDate!));

  return (
    <main className="pb-28">
      <Header title="Larkspur Falls" />

      <div className="px-4 pt-4">
        <Link
          href="/how-it-works"
          className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#0a84ff] to-[#5b4bff] px-4 py-3 shadow-lg"
        >
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white/75">Class project</p>
            <p className="text-lg font-black leading-tight">Why can&apos;t these passes be faked?</p>
          </div>
          <ChevronRight className="h-6 w-6" />
        </Link>
      </div>

      {featured.length > 0 && (
        <section className="pt-6">
          <h2 className="section-title px-4">Featured</h2>
          <div className="no-scrollbar mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
            {featured.map((v) => (
              <Link
                key={v.id}
                href={`/venues/${v.slug}`}
                className="glass glass-hover relative flex w-[85%] shrink-0 snap-start gap-3 p-1.5"
              >
                <VenueArt {...v} className="h-28 w-28 shrink-0 rounded-lg" />
                <div className="min-w-0 py-1 pr-6">
                  <p className="text-[17px] font-normal uppercase leading-snug">{v.featuredTitle}</p>
                  <p className="mt-1 text-[15px] text-white/65">{dateLabel(v.featuredDate!)}</p>
                  <p className="text-[15px] text-white/65">{v.name}</p>
                </div>
                <span className="absolute bottom-2.5 right-2.5 grid h-6 w-6 place-items-center rounded-full border border-white/40 bg-white/15">
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 pt-7">
        <h2 className="section-title">Venues</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 min-[420px]:gap-5">
          {venues.map((v) => (
            <Link key={v.id} href={`/venues/${v.slug}`} className="glass glass-hover flex items-center gap-4 p-1.5">
              <VenueArt {...v} className="h-[104px] w-[104px] shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 py-1 pr-2">
                <p className="truncate text-[21px] font-bold">{v.name}</p>
                <p className="truncate text-[15px] text-white/60">{v.address.replace(", Larkspur Falls", "")}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {v.options.length === 0 && <span className="text-xs text-white/50">No passes tonight</span>}
                  {v.options.map((o) => {
                    const soldOut = o.sold >= o.quantity;
                    return (
                      <span
                        key={o.id}
                        className={`rounded-full border px-2 py-0.5 text-xs font-bold ${
                          soldOut ? "border-white/15 text-white/35 line-through" : "border-accent/60 bg-accent/15 text-[#7cc0ff]"
                        }`}
                      >
                        {o.kind === "SKIP" ? "Skip" : o.kind === "COVER" ? "Cover" : "Combo"} {usd(o.priceCents, { trim: true })}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
