"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { Book, ChevronRight, User } from "@/components/Icons";
import { useDemoUser } from "@/lib/useDemoUser";

export default function AccountPage() {
  const { user, setName } = useDemoUser();

  return (
    <main className="pb-32">
      <Header title="Account" />
      <div className="flex flex-col items-center px-4 pt-8">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-accent to-[#5b4bff] text-4xl font-black">
          {user?.name ? user.name.trim()[0]?.toUpperCase() : <User className="h-10 w-10" />}
        </div>
        <p className="mt-3 text-2xl font-bold">{user?.name || "Guest"}</p>
      </div>

      <div className="space-y-4 px-4 pt-8">
        <label className="glass block p-4">
          <span className="text-sm text-white/60">Passholder name (shown on your passes)</span>
          <input
            value={user?.name ?? ""}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={60}
            className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-lg placeholder:text-white/30 focus:border-accent focus:outline-none"
          />
        </label>

        <div className="glass divide-y divide-white/10">
          <Link href="/how-it-works" className="flex items-center gap-3 p-4 hover:bg-white/5">
            <Book className="h-6 w-6 text-accent" />
            <span className="flex-1 font-bold">How It Works</span>
            <ChevronRight />
          </Link>
        </div>

        <div className="glass p-4 text-sm text-white/60">
          <p className="font-bold text-white">About this demo</p>
          <p className="mt-1">
            Skipline is a college business law class project showing how bar line-skip and cover pass apps work.
            All bars, addresses and events are fictional. No real payments are taken.
          </p>
          <p className="mt-3 break-all font-mono text-xs text-white/40">Demo user id: {user?.id ?? "…"}</p>
        </div>
      </div>
    </main>
  );
}
