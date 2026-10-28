import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signPass } from "@/lib/token";

export const dynamic = "force-dynamic";

// Lists a demo user's passes. The QR token is signed here, on the server,
// because the browser never has the secret.
export async function GET(req: Request) {
  const ownerId = new URL(req.url).searchParams.get("owner");
  if (!ownerId) return NextResponse.json({ error: "owner is required" }, { status: 400 });

  const passes = await prisma.pass.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    include: { venue: true, option: true },
  });

  return NextResponse.json({
    serverTime: Date.now(),
    passes: passes.map((p) => ({
      id: p.id,
      kind: p.option.kind,
      name: p.option.name,
      date: p.option.date,
      venueName: p.venue.name,
      venueSlug: p.venue.slug,
      venueId: p.venueId,
      holderName: p.holderName,
      quantity: p.quantity,
      totalCents: p.totalCents,
      expiresAt: p.expiresAt.toISOString(),
      redeemedAt: p.redeemedAt?.toISOString() ?? null,
      token: signPass({
        pid: p.id,
        vid: p.venueId,
        exp: Math.floor(p.expiresAt.getTime() / 1000),
      }),
    })),
  });
}
