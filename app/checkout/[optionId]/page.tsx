import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dateLabel, expiresAtFor } from "@/lib/dates";
import CheckoutClient from "./CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }: { params: Promise<{ optionId: string }> }) {
  const { optionId } = await params;
  const option = await prisma.passOption.findUnique({ where: { id: optionId }, include: { venue: true } });
  if (!option) notFound();

  return (
    <CheckoutClient
      option={{
        id: option.id,
        kind: option.kind,
        name: option.name,
        description: option.description,
        priceCents: option.priceCents,
        remaining: Math.max(0, option.quantity - option.sold),
        dateLabel: dateLabel(option.date),
        expiresAt: expiresAtFor(option.date).toISOString(),
        venueName: option.venue.name,
      }}
    />
  );
}
