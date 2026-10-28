import Link from "next/link";
import Header from "@/components/Header";
import { Cards } from "@/components/Icons";

export default function DropsPage() {
  return (
    <main className="pb-32">
      <Header title="Drops" />
      <div className="flex flex-col items-center px-6 pt-16 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full border border-white/20 bg-white/[0.07]">
          <Cards className="h-12 w-12 text-white/70" />
        </div>
        <p className="mt-5 text-2xl font-bold">No drops right now</p>
        <p className="mt-2 text-white/60">
          Drops are limited-time deals from bars, like discounted passes. Check back soon.
        </p>
        <Link href="/" className="btn-primary mx-auto mt-6 max-w-xs">
          Browse venues
        </Link>
      </div>
    </main>
  );
}
