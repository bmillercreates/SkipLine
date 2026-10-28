import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

export const dynamic = "force-dynamic";

// For the How It Works page: builds a token the way a copycat app would,
// with a believable payload but no access to the real secret.
export async function GET() {
  const claims = {
    pid: "forged" + randomBytes(6).toString("hex"),
    vid: "any-venue",
    exp: Math.floor(Date.now() / 1000) + 6 * 3600,
  };
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  const fakeSig = randomBytes(32).toString("base64url");
  return NextResponse.json({ token: `SKL1.${payload}.${fakeSig}`, claims });
}
