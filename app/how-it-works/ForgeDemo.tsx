"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function ForgeDemo() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<{ accepted: boolean; detail?: string } | null>(null);

  async function forge() {
    const res = await fetch("/api/demo/forge", { cache: "no-store" });
    setToken((await res.json()).token);
    setResult(null);
  }

  async function check() {
    const res = await fetch("/api/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, venueId: "any-venue" }),
    });
    setResult(await res.json());
  }

  return (
    <section className="glass p-5 text-[15px] text-white/80">
      <h2 className="text-xl font-bold text-white">Try it: make a fake pass</h2>
      <p className="mt-1">
        This builds a token the way a copycat app would: a believable payload with a random signature. Then send
        it to the server to see what happens.
      </p>
      <button onClick={forge} className="btn-primary mt-4 h-12 text-base">
        {token ? "Make another fake" : "Make a fake pass"}
      </button>
      {token && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <div className="rounded-xl bg-white p-3">
            <QRCodeSVG value={token} size={180} />
          </div>
          <code className="w-full break-all rounded-lg bg-black/40 p-2 text-[11px] text-white/70">{token}</code>
          <button onClick={check} className="h-12 w-full rounded-xl border border-white/40 bg-white/10 font-bold">
            Check it with the server
          </button>
          {result && (
            <p
              className={`w-full rounded-lg px-3 py-2 text-center font-bold ${
                result.accepted ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
              }`}
            >
              {result.accepted ? "Accepted" : "Rejected"}: {result.detail}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
