import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const venues = await prisma.venue.findMany({
    orderBy: { name: "asc" },
    select: { id: true, slug: true, name: true, address: true },
  });
  return NextResponse.json({ venues });
}
