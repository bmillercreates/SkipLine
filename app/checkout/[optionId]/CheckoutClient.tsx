"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoUser } from "@/lib/useDemoUser";
import { feeFor, usd } from "@/lib/money";
import { passStyle } from "@/lib/passStyle";
import { ChevronLeft, Tag } from "@/components/Icons";
import DemoBadge from "@/components/DemoBadge";

type Option = {
  id: string;
  kind: string;
  name: string;
  description: string;
  priceCents: number;
  remaining: number;
  dateLabel: string;
  expiresAt: string;
  venueName: string;
};

export default function CheckoutClient({ option }: { option: Option }) {
  const router = useRouter();
  const { user, setName } = useDemoUser();
  const [qty, setQty] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const max = Math.min(10, option.remaining);
  const fee = feeFor(option.priceCents) * qty;
  const subtotal = option.priceCents * qty;
  const total = subtotal + fee;
  const style = passStyle(option.kind);
  const expires = new Date(option.expiresAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const name = user?.name ?? "";

  async function placeOrder() {
    if (!user) return;
    if (!name.trim()) return setError("Add the passholder name first.");
    setBusy(true);
    setError("");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId: option.id, quantity: qty, ownerId: user.id, holderName: name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setBusy(false);
      return setError(data.error ?? "Something went wrong.");
    }
    router.push(`/passes?new=${data.passId}`);
  }

  return (
    <main className="flex min-h-dvh flex-col bg-night-950/40">
      <div className="relative px-4 pt-4">
        <div className="flex items-start gap-3">
          <button
            aria-label="Back"
            onClick={() => router.back()}
            className="mt-3 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20 hover:bg-white/30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div
            className="flex-1 rounded-xl p-5 shadow-xl"
            style={{ backgroundImage: `linear-gradient(120deg, ${style.colors.join(", ")})` }}
          >
            <p className="text-[15px] font-bold text-white/75">{option.venueName}</p>
            <p className="text-[28px] font-bold leading-tight">{option.name}</p>
            <div className="mt-5 flex gap-6 text-[13px]">
              <div className="min-w-0">
                <p className="text-white/75">Passholder</p>
                <p className="truncate text-base">{name || "—"}</p>
              </div>
              <div>
                <p className="text-white/75">Expires at</p>
                <p className="text-base">{expires}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <DemoBadge />
        </div>
      </div>

      <p className="px-4 pb-4 pt-2 text-[15px] leading-snug text-white/55">
        <span className="font-bold text-white/70">{option.dateLabel}.</span>{" "}
        {expanded ? option.description : option.description.slice(0, 90) + "… "}
        {!expanded && (
          <button className="text-white/85" onClick={() => setExpanded(true)}>
            See More
          </button>
        )}
      </p>

      <div className="divide-y divide-white/10 border-y border-white/10">
        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-xl">{usd(option.priceCents)} ea</span>
          <div className="flex items-center gap-5 text-2xl">
            <button
              aria-label="Decrease"
              disabled={qty <= 1}
              onClick={() => setQty((q) => q - 1)}
              className="h-8 w-8 leading-none disabled:text-white/30"
            >
              −
            </button>
            <span className="w-5 text-center">{qty}</span>
            <button
              aria-label="Increase"
              disabled={qty >= max}
              onClick={() => setQty((q) => q + 1)}
              className="h-8 w-8 leading-none disabled:text-white/30"
            >
              +
            </button>
          </div>
        </div>

        <label className="flex items-center gap-3 px-4 py-4">
          <span className="w-28 shrink-0 text-white/70">Passholder</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={60}
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
          />
        </label>

        <div className="flex items-center gap-3 px-4 py-4">
          <span className="grid h-9 w-14 place-items-center rounded-md bg-gradient-to-br from-zinc-500 to-zinc-700 text-[10px] font-black tracking-wider">
            DEMO
          </span>
          <span className="flex-1 text-white/80">No payment method needed</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-4 text-white/40">
          <Tag />
          <span>Promo codes disabled in demo</span>
        </div>
      </div>

      <div className="space-y-1.5 px-4 py-5 text-[17px]">
        <div className="flex justify-between text-white/75">
          <span>
            {option.name} x {qty}
          </span>
          <span>{usd(subtotal)}</span>
        </div>
        <div className="flex justify-between text-white/75">
          <span>Service Fee x {qty}</span>
          <span>{usd(fee)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{usd(total)}</span>
        </div>
      </div>

      <div className="mt-auto border-t border-white/10 px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-4">
        {error && <p className="mb-3 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">{error}</p>}
        <button className="btn-primary" disabled={busy || !user || max < 1} onClick={placeOrder}>
          {max < 1 ? "Sold Out" : busy ? "Placing order…" : `Place Demo Order ${usd(total)}`}
        </button>
        <p className="mt-2 text-xs text-white/45">
          This is a class-project demo. No card is charged and nothing real is purchased. Tapping the button
          creates a demo pass in the database.
        </p>
      </div>
    </main>
  );
}
