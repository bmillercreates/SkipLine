import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ensureUpcomingNights } from "@/lib/seed";
import { dateLabel, dateStr } from "@/lib/dates";
import { usd } from "@/lib/money";
import Header from "@/components/Header";
import VenueArt from "@/components/VenueArt";
import { Clock } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function VenuePage({ params }: { params: Promise<{ slug: string }> }) {
  await ensureUpcomingNights(prisma);
  const { slug } = await params;
  const venue = await prisma.venue.findUnique({
    where: { slug },
    include: {
      options: { where: { date: { gte: dateStr() } }, orderBy: [{ date: "asc" }, { priceCents: "asc" }] },
    },
  });
  if (!venue) notFound();

  const byDate = new Map<string, typeof venue.options>();
  for (const o of venue.options) byDate.set(o.date, [...(byDate.get(o.date) ?? []), o]);

  return (
    <main className="pb-28">
      <Header back divider={false} />

      <div className="flex flex-col items-center px-4 text-center">
        <VenueArt {...venue} className="h-36 w-36 rounded-xl border border-white/20 shadow-2xl" />
        <h1 className="mt-5 text-[28px] font-bold leading-tight">{venue.name}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-white/50">
          <Clock /> {venue.hours}
        </p>
        <p className="mt-3 max-w-xs text-sm text-white/70">{venue.blurb}</p>
      </div>

      {venue.featuredTitle && venue.featuredDate && (
        <div className="mx-4 mt-5 rounded-xl border border-accent/50 bg-accent/10 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-widest text-[#7cc0ff]">{dateLabel(venue.featuredDate)}</p>
          <p className="font-bold">{venue.featuredTitle}</p>
          <p className="text-sm text-white/65">{venue.featuredDetail}</p>
        </div>
      )}

      <div className="space-y-7 px-4 pt-7">
        {[...byDate.entries()].map(([date, options]) => (
          <section key={date}>
            <h2 className="text-[22px] font-bold">{dateLabel(date)}</h2>
            <div className="mt-3 space-y-4">
              {options.map((o) => {
                const left = o.quantity - o.sold;
                const soldOut = left <= 0;
                const inner = (
                  <>
                    <p className={`text-lg font-bold ${soldOut ? "text-white/30" : ""}`}>{o.name}</p>
                    <p className={`mt-1 text-base ${soldOut ? "text-white/30" : "text-white/85"}`}>
                      {usd(o.priceCents, { trim: true })}
                    </p>
                    {!soldOut && left <= 10 && (
                      <p className="mt-1 text-xs font-bold text-amber-300">Only {left} left</p>
                    )}
                    {soldOut && (
                      <span className="absolute -right-px -top-px rounded-bl-xl rounded-tr-xl border border-white/25 bg-night-900 px-4 py-1.5 text-sm font-bold uppercase tracking-wide">
                        Sold out
                      </span>
                    )}
                  </>
                );
                return soldOut ? (
                  <div key={o.id} aria-disabled className="relative rounded-xl border border-white/15 bg-white/[0.03] px-5 py-4">
                    {inner}
                  </div>
                ) : (
                  <Link key={o.id} href={`/checkout/${o.id}`} className="glass glass-hover relative block bg-white/[0.12] px-5 py-4">
                    {inner}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
