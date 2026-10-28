// Generated venue "logo" art: a gradient tile with a pattern and a sign-style emblem.
type Props = {
  name: string;
  shortName: string;
  colorA: string;
  colorB: string;
  motif: string;
  className?: string;
};

function Motif({ motif, id }: { motif: string; id: string }) {
  switch (motif) {
    case "rays":
      return (
        <g opacity="0.22" stroke="white" strokeWidth="5">
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return <line key={i} x1="100" y1="100" x2={100 + Math.cos(a) * 160} y2={100 + Math.sin(a) * 160} />;
          })}
        </g>
      );
    case "grid":
      return (
        <g opacity="0.2" stroke="white" strokeWidth="1.5">
          {Array.from({ length: 11 }, (_, i) => (
            <g key={i}>
              <line x1={i * 20} y1="0" x2={i * 20} y2="200" />
              <line x1="0" y1={i * 20} x2="200" y2={i * 20} />
            </g>
          ))}
        </g>
      );
    case "waves":
      return (
        <g opacity="0.25" fill="none" stroke="white" strokeWidth="3">
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M-10 ${i * 28 + 8} q 25 -14 50 0 t 50 0 t 50 0 t 50 0 t 50 0`} />
          ))}
        </g>
      );
    case "stars":
      return (
        <g opacity="0.35" fill="white">
          {[
            [24, 30, 3], [160, 22, 4], [40, 160, 2.5], [176, 150, 3.5], [100, 18, 2], [16, 100, 2], [186, 86, 2.5], [130, 180, 2],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} />
          ))}
        </g>
      );
    default:
      return (
        <g opacity="0.2">
          <pattern id={`${id}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="2.5" fill="white" />
          </pattern>
          <rect width="200" height="200" fill={`url(#${id}-dots)`} />
        </g>
      );
  }
}

export default function VenueArt({ name, shortName, colorA, colorB, motif, className = "" }: Props) {
  const id = "va-" + name.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const words = shortName.split(" ");
  const lines = words.length > 1 && shortName.length > 9 ? [words.slice(0, -1).join(" "), words.at(-1)!] : [shortName];

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={`${name} logo`}>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colorA} />
          <stop offset="1" stopColor={colorB} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="white" stopOpacity="0.35" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${id}-bg)`} />
      <Motif motif={motif} id={id} />
      <rect width="200" height="200" fill="#06101f" opacity="0.25" />
      <circle cx="100" cy="100" r="90" fill={`url(#${id}-glow)`} />
      <circle cx="100" cy="100" r="70" fill="#06101f" opacity="0.55" stroke="white" strokeWidth="3" />
      <circle cx="100" cy="100" r="62" fill="none" stroke={colorB} strokeWidth="2" strokeDasharray="4 5" />
      {lines.map((line, i) => (
        <text
          key={i}
          x="100"
          y={lines.length === 1 ? 108 : 94 + i * 26}
          textAnchor="middle"
          fontFamily="var(--font-lato), system-ui, sans-serif"
          fontWeight="900"
          fontSize={line.length > 8 ? 20 : 24}
          fill="white"
          stroke={colorA}
          strokeWidth="1"
          paintOrder="stroke"
          letterSpacing="0.5"
        >
          {line}
        </text>
      ))}
      <text x="100" y="152" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="700" fill={colorB} letterSpacing="2">
        EST. LARKSPUR FALLS
      </text>
    </svg>
  );
}
