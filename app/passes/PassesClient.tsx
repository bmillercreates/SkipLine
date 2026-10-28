"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Header from "@/components/Header";
import { Check, XMark } from "@/components/Icons";
import { useDemoUser } from "@/lib/useDemoUser";
import { passStyle } from "@/lib/passStyle";
import { dateLabel, dateStr } from "@/lib/dates";
import { usd } from "@/lib/money";

type Pass = {
  id: string;
  kind: string;
  name: string;
  date: string;
  venueName: string;
  venueSlug: string;
  venueId: string;
  holderName: string;
  quantity: number;
  totalCents: number;
  expiresAt: string;
  redeemedAt: string | null;
  token: string;
};

type RedeemResult = { accepted: boolean; reason?: string; detail?: string };

const REASON_TITLES: Record<string, string> = {
  UNKNOWN_PASS: "Unknown pass",
  INVALID_SIGNATURE: "Invalid signature",
  ALREADY_REDEEMED: "Already redeemed",
  EXPIRED: "Expired",
  WRONG_VENUE: "Wrong venue",
};

function useDate() {
  const date = dateStr();
  return (d: string) => (d === date ? "Tonight" : dateLabel(d));
}

export default function PassesClient() {
  const { user } = useDemoUser();
  const params = useSearchParams();
  const useBy = useDate();
  const [passes, setPasses] = useState<Pass[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(params.get("new"));
  const [sheet, setSheet] = useState<"howto" | null>(null);
  const [staffBusy, setStaffBusy] = useState(false);
  const [staffError, setStaffError] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    const res = await fetch(`/api/passes?owner=${encodeURIComponent(user.id)}`, { cache: "no-store" });
    if (res.ok) setPasses((await res.json()).passes);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  // One tap from venue staff: the server verifies and marks the pass as used.
  async function staffRedeem(pass: Pass) {
    setStaffBusy(true);
    setStaffError("");
    const res = await fetch("/api/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: pass.token, venueId: pass.venueId }),
    });
    const data: RedeemResult = await res.json();
    if (!data.accepted) setStaffError(`${REASON_TITLES[data.reason ?? ""] ?? "Rejected"}: ${data.detail}`);
    setSelectedId(pass.id);
    await load();
    setStaffBusy(false);
  }

  const now = Date.now();
  const isActive = (p: Pass) => !p.redeemedAt && new Date(p.expiresAt).getTime() > now;
  const active = (passes ?? []).filter(isActive);
  const selected = (passes ?? []).find((p) => p.id === selectedId) ?? active[0] ?? null;
  // Keep a just-redeemed pass on screen so you can see it flip.
  const showSelected = selected && (isActive(selected) || selected.id === selectedId);
  const tabs = active.filter((p) => p.id !== selected?.id);
  const past = (passes ?? []).filter((p) => !isActive(p) && p.id !== (showSelected ? selected?.id : ""));

  return (
    <main className="pb-[92px]">
      <Header title="My Passes" compact />

      {passes === null ? (
        <p className="px-4 pt-10 text-center text-white/50">Loading passes…</p>
      ) : !showSelected ? (
        <div className="px-6 pt-16 text-center">
          <p className="text-2xl font-bold">No active passes</p>
          <p className="mt-2 text-white/60">Buy a Skip the Line or Cover pass and it will show up here.</p>
          <Link href="/" className="btn-primary mx-auto mt-6 max-w-xs">
            Browse venues
          </Link>
        </div>
      ) : (
        // Fills the screen above the bottom bar so the buttons sit at the bottom.
        <div className="flex min-h-[calc(100dvh-45px-92px)] flex-col px-4 pt-3">
          {tabs.map((p, i) => {
            const st = passStyle(p.kind);
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className="relative block h-9 w-full rounded-t-xl px-4 pt-1 text-left text-[14px] font-bold shadow-[0_-4px_14px_rgba(0,0,0,0.25)]"
                style={{
                  background: st.colors[0],
                  marginBottom: -10,
                  zIndex: i,
                }}
              >
                {p.name}
              </button>
            );
          })}
          <PassCard pass={selected!} useBy={useBy(selected!.date)} />

          <div className="mt-auto space-y-2.5 pb-3 pt-4">
            {staffError && (
              <p className="rounded-lg bg-red-500/15 px-3 py-1.5 text-center text-sm text-red-300">{staffError}</p>
            )}
            <button
              onClick={() => staffRedeem(selected!)}
              disabled={!!selected!.redeemedAt || staffBusy}
              className="h-11 w-full rounded-lg border border-white/60 bg-[#2a3646] text-[17px] font-bold disabled:opacity-60"
            >
              {selected!.redeemedAt ? "Redeemed" : "I am venue staff"}
            </button>
            <button onClick={() => setSheet("howto")} className="h-11 w-full rounded-lg bg-accent text-[17px] font-bold">
              How to redeem this pass
            </button>
          </div>
        </div>
      )}

      {past.length > 0 && (
        <section className="px-4 pt-8">
          <h2 className="text-[22px] font-bold">Past passes</h2>
          <div className="mt-3 space-y-3">
            {past.map((p) => (
              <div key={p.id} className="glass flex items-center gap-3 px-4 py-3 opacity-80">
                <span className="h-10 w-1.5 rounded-full" style={{ background: passStyle(p.kind).colors[0] }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">
                    {p.name} · {p.venueName}
                  </p>
                  <p className="text-sm text-white/55">
                    {dateLabel(p.date)} · Qty {p.quantity} · {usd(p.totalCents)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                    p.redeemedAt ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/50"
                  }`}
                >
                  {p.redeemedAt ? "Redeemed" : "Expired"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {sheet === "howto" && <HowToSheet onClose={() => setSheet(null)} />}
    </main>
  );
}

function PassCard({ pass, useBy }: { pass: Pass; useBy: string }) {
  const st = passStyle(pass.kind);
  const redeemed = !!pass.redeemedAt;

  return (
    <div
      className={`relative z-20 overflow-hidden rounded-xl px-5 py-4 shadow-2xl ${redeemed ? "grayscale-[0.6]" : ""}`}
      style={{ backgroundImage: `linear-gradient(120deg, ${st.colors[0]}, ${st.colors[1]})` }}
    >
      <div className="min-w-0">
        <p className="truncate text-[16px] font-bold text-white/80">{pass.venueName}</p>
        <p className="text-[30px] font-bold leading-tight">{pass.name}</p>
      </div>
      <p className="absolute right-5 top-[72px] text-[15px]">Qty: {pass.quantity}</p>

      <div className="mt-3 flex justify-center">
        <div className="rounded-xl bg-white p-2.5 shadow-lg">
          <QRCodeSVG value={pass.token} size={180} level="M" />
        </div>
      </div>

      <div className="mt-3 flex items-end gap-8 text-[13px]">
        <div className="min-w-0">
          <p className="text-white/75">Passholder</p>
          <p className="truncate text-base">{pass.holderName}</p>
        </div>
        <div className="flex-1">
          <p className="text-white/75">{redeemed ? "Redeemed at" : "Use by"}</p>
          <p className="text-base">
            {redeemed
              ? new Date(pass.redeemedAt!).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
              : useBy}
          </p>
        </div>
        <span className="text-xl font-black italic leading-none">S</span>
      </div>

      {redeemed && (
        <div className="absolute inset-0 grid place-items-center bg-black/20">
          <div className="flex -rotate-12 items-center gap-2 rounded-xl border-4 border-emerald-400 bg-night-950/90 px-5 py-2 text-3xl font-black uppercase text-emerald-300">
            <Check className="h-8 w-8" /> Redeemed
          </div>
        </div>
      )}
    </div>
  );
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-md rounded-t-2xl border-t border-white/15 bg-night-900 px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-white/25" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button aria-label="Close" onClick={onClose} className="rounded-full p-1 hover:bg-white/10">
            <XMark className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function HowToSheet({ onClose }: { onClose: () => void }) {
  const steps = [
    "Go to the venue on the night your pass is for.",
    "Skip the Line passes: walk to the front of the line. Cover passes: wait in the regular line.",
    "Show this screen and your ID to the door staff.",
    "Staff tap “I am venue staff” to redeem the pass. Each pass works once.",
  ];
  return (
    <Sheet title="How to redeem this pass" onClose={onClose}>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-sm font-black">
              {i + 1}
            </span>
            <span className="pt-0.5 text-white/85">{s}</span>
          </li>
        ))}
      </ol>
      <button onClick={onClose} className="btn-primary mt-5 h-12 text-base">
        Got it
      </button>
    </Sheet>
  );
}
