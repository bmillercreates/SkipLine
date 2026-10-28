// Card colors per pass type. Three stops so the animated gradient visibly moves.
export const PASS_STYLES: Record<string, { label: string; colors: [string, string, string] }> = {
  SKIP: { label: "Skip the Line", colors: ["#0a84ff", "#3b5bff", "#00b3ff"] },
  COVER: { label: "Cover", colors: ["#f5b301", "#f08c00", "#ffd34d"] },
  COMBO: { label: "Skip + Cover", colors: ["#ff2fa8", "#c026d3", "#ff6ad5"] },
};

export function passStyle(kind: string) {
  return PASS_STYLES[kind] ?? PASS_STYLES.SKIP;
}
