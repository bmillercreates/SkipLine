import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dateStr, expiresAtFor } from "@/lib/dates";
import { feeFor } from "@/lib/money";

// "Place Demo Order": no payment is taken. We reserve inventory and create the pass.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const optionId = String(body?.optionId ?? "");
  const ownerId = String(body?.ownerId ?? "");
  const holderName = String(body?.holderName ?? "").trim().slice(0, 60);
  const quantity = Number(body?.quantity);

  if (!optionId || !ownerId || !holderName) {
    return NextResponse.json({ error: "Missing order details." }, { status: 400 });
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    return NextResponse.json({ error: "Quantity must be between 1 and 10." }, { status: 400 });
  }

  const option = await prisma.passOption.findUnique({ where: { id: optionId } });
  if (!option) return NextResponse.json({ error: "Pass not found." }, { status: 404 });
  if (option.date < dateStr()) {
    return NextResponse.json({ error: "That night has already passed." }, { status: 400 });
  }

  const unitCents = option.priceCents;
  const feeCents = feeFor(unitCents) * quantity;

  try {
    const pass = await prisma.$transaction(async (tx) => {
      // Atomic inventory check: only increments if enough are left.
      const reserved = await tx.passOption.updateMany({
        where: { id: option.id, sold: { lte: option.quantity - quantity } },
        data: { sold: { increment: quantity } },
      });
      if (reserved.count === 0) throw new Error("SOLD_OUT");

      return tx.pass.create({
        data: {
          optionId: option.id,
          venueId: option.venueId,
          ownerId,
          holderName,
          quantity,
          unitCents,
          feeCents,
          totalCents: unitCents * quantity + feeCents,
          expiresAt: expiresAtFor(option.date),
        },
      });
    });
    return NextResponse.json({ passId: pass.id });
  } catch (e) {
    if (e instanceof Error && e.message === "SOLD_OUT") {
      return NextResponse.json({ error: "Not enough passes left. It may be sold out." }, { status: 409 });
    }
    throw e;
  }
}
