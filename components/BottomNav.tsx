"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cards, Coin, Compass, Ticket, User } from "./Icons";

const TABS = [
  { href: "/", label: "Venues", Icon: Compass, match: (p: string) => p === "/" || p.startsWith("/venues") || p.startsWith("/checkout") },
  { href: "/passes", label: "My Passes", Icon: Ticket, match: (p: string) => p.startsWith("/passes") },
  { href: "/points", label: "Points", Icon: Coin, match: (p: string) => p.startsWith("/points") },
  { href: "/drops", label: "Drops", Icon: Cards, match: (p: string) => p.startsWith("/drops") },
  { href: "/account", label: "Account", Icon: User, match: (p: string) => p.startsWith("/account") || p.startsWith("/how-it-works") },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/checkout")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-night-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md justify-around px-1 pb-[max(env(safe-area-inset-bottom),10px)] pt-2">
        {TABS.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 text-[12px] ${active ? "text-white" : "text-white/45"}`}
            >
              <span className={`grid h-8 w-8 place-items-center rounded-full ${active ? "bg-white text-night-950" : ""}`}>
                <Icon className={active ? "h-5 w-5" : "h-7 w-7"} />
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
