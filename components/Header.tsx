"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "./Icons";

export default function Header({
  title,
  back = false,
  divider = true,
  compact = false,
}: {
  title?: string;
  back?: boolean;
  divider?: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  // Single short row with just the title, no logo.
  if (compact) {
    return (
      <header className="sticky top-0 z-30 border-b border-white/10 bg-night-950/40 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="flex h-11 items-center justify-center px-4">
          <h1 className="text-lg font-bold text-white">{title}</h1>
        </div>
      </header>
    );
  }
  return (
    <header
      className={`sticky top-0 z-30 bg-night-950/40 backdrop-blur-xl ${divider ? "border-b border-white/10" : ""}`}
    >
      <div className="relative flex h-14 items-center px-3 pt-[env(safe-area-inset-top)]">
        {back ? (
          <button
            aria-label="Back"
            onClick={() => (history.length > 1 ? router.back() : router.push("/"))}
            className="rounded-full p-1.5 text-white hover:bg-white/10"
          >
            <ChevronLeft />
          </button>
        ) : (
          <span className="text-lg font-black italic tracking-tight text-white">
            skip<span className="text-accent">line</span>
          </span>
        )}
        {title && (
          <h1 className="pointer-events-none absolute inset-x-0 mx-auto w-fit max-w-[60%] truncate text-center text-lg font-bold text-white">
            {title}
          </h1>
        )}
      </div>
    </header>
  );
}
