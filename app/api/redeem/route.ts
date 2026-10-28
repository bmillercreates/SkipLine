import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPass } from "@/lib/token";
import { formatDateTime } from "@/lib/dates";

type Reason = "UNKNOWN_PASS" | "INVALID_SIGNATURE" | "ALREADY_REDEEMED" | "EXPIRED" | "WRONG_VENUE";

function reject(reason: Reason, detail: string, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ accepted: false, reason, detail, ...extra });
}

// Door staff scan a QR code; this is the only place a pass can be redeemed.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = String(body?.token ?? "");
  const venueId = String(body?.venueId ?? "");
  if (!venueId) return NextResponse.json({ error: "venueId is required" }, { status: 400 });

  // 1. Is it signed with our secret? (A forged or edited token fails here.)
  const verified = verifyPass(token);
  if (!verified.ok) {
    return verified.reason === "INVALID_SIGNATURE"
      ? reject("INVALID_SIGNATURE", "The signature doesn't match. This code was forged or edited.")
      : reject("UNKNOWN_PASS", "This QR code isn't a Skipline pass.");
  }

  // 2. Does the pass actually exist in our database?
  const pass = await prisma.pass.findUnique({
    where: { id: verified.claims.pid },
    include: { venue: true, option: true },
  });
  if (!pass) return reject("UNKNOWN_PASS", "No pass with this ID exists in the system.");

  const info = {
    pass: {
      holderName: pass.holderName,
      name: pass.option.name,
      kind: pass.option.kind,
      quantity: pass.quantity,
      venueName: pass.venue.name,
    },
  };

  // 3. Is it for this bar?
  if (pass.venueId !== venueId) {
    return reject("WRONG_VENUE", `This pass is for ${pass.venue.name}.`, info);
  }

  // 4. Is it still valid tonight?
  if (pass.expiresAt.getTime() < Date.now()) {
    return reject("EXPIRED", `This pass expired ${formatDateTime(pass.expiresAt, { dateStyle: "medium", timeStyle: "short" })}.`, info);
  }

  // 5. Single use: atomically flip redeemedAt from null. If someone else
  //    already scanned it (even a split second earlier), count is 0.
  const now = new Date();
  const updated = await prisma.pass.updateMany({
    where: { id: pass.id, redeemedAt: null },
    data: { redeemedAt: now },
  });
  if (updated.count === 0) {
    const fresh = await prisma.pass.findUnique({ where: { id: pass.id } });
    const at = fresh?.redeemedAt ? formatDateTime(fresh.redeemedAt, { timeStyle: "short" }) : "earlier";
    return reject("ALREADY_REDEEMED", `This pass was already scanned at ${at}.`, info);
  }

  return NextResponse.json({ accepted: true, redeemedAt: now.toISOString(), ...info });
}
