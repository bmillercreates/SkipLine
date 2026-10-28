"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { Coin } from "@/components/Icons";
import { useDemoUser } from "@/lib/useDemoUser";

// Demo points: 10 points for every dollar spent on passes.
export default function PointsPage() {
  const { user } = useDemoUser();
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/passes?owner=${encodeURIComponent(user.id)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const cents = (d.passes ?? []).reduce((sum: number, p: { totalCents: number }) => sum + p.totalCents, 0);
        setPoints(Math.floor(cents / 10));
      });
  }, [user]);

  return (
    <main className="pb-32">
      <Header title="Points" />
      <div className="flex flex-col items-center px-4 pt-10 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-accent to-[#5b4bff]">
          <Coin className="h-12 w-12" />
        </div>
        <p className="mt-4 text-5xl font-black tabular-nums">{points === null ? "…" : points.toLocaleString()}</p>
        <p className="mt-1 text-white/60">points available</p>
      </div>

      <div className="space-y-4 px-4 pt-8">
        <div className="glass p-4">
          <p className="font-bold">How you earn points</p>
          <p className="mt-1 text-sm text-white/65">You get 10 points for every $1 you spend on passes.</p>
        </div>
        <Link href="/" className="btn-primary">
          Browse venues
        </Link>
      </div>
    </main>
  );
}
