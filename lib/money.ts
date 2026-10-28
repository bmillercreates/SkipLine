export const SERVICE_FEE_RATE = 0.055;

export function feeFor(unitCents: number) {
  return Math.round(unitCents * SERVICE_FEE_RATE);
}

export function usd(cents: number, opts: { trim?: boolean } = {}) {
  const v = cents / 100;
  if (opts.trim && Number.isInteger(v)) return `$${v}`;
  return `$${v.toFixed(2)}`;
}
