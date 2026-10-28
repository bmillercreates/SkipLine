import { createHmac, timingSafeEqual } from "node:crypto";

// Token format: SKL1.<base64url JSON payload>.<base64url HMAC-SHA256 signature>
// The signature covers the prefix and payload, so changing any character
// (pass id, venue, expiry) breaks it. Only the server knows the secret.
const PREFIX = "SKL1";

export type PassClaims = {
  pid: string; // pass id in the database
  vid: string; // venue id the pass is good at
  exp: number; // expiry, unix seconds
};

function secret() {
  const s = process.env.PASS_SIGNING_SECRET;
  if (!s) throw new Error("PASS_SIGNING_SECRET is not set (see .env.example)");
  return s;
}

function hmac(data: string) {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function signPass(claims: PassClaims) {
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  const body = `${PREFIX}.${payload}`;
  return `${body}.${hmac(body)}`;
}

export type VerifyResult =
  | { ok: true; claims: PassClaims }
  | { ok: false; reason: "MALFORMED" | "INVALID_SIGNATURE" };

export function verifyPass(token: string): VerifyResult {
  const parts = token.trim().split(".");
  if (parts.length !== 3 || parts[0] !== PREFIX) return { ok: false, reason: "MALFORMED" };

  const [prefix, payload, sig] = parts;
  const expected = Buffer.from(hmac(`${prefix}.${payload}`));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return { ok: false, reason: "INVALID_SIGNATURE" };
  }

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString()) as PassClaims;
    return { ok: true, claims };
  } catch {
    return { ok: false, reason: "MALFORMED" };
  }
}
