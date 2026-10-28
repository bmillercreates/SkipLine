type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const ChevronLeft = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={2.4}><path d="M15 5l-7 7 7 7" /></svg>
);
export const ChevronRight = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={2.2}><path d="M9 5l7 7-7 7" /></svg>
);
export const Compass = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="12" r="9.5" /><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="currentColor" /></svg>
);
export const Ticket = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M3 7.5A1.5 1.5 0 014.5 6h15A1.5 1.5 0 0121 7.5V10a2 2 0 000 4v2.5a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 16.5V14a2 2 0 000-4z" /><path d="M9 6v12" strokeDasharray="2 2.2" /></svg>
);
export const User = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" /></svg>
);
export const Pin = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>
);
export const Clock = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const Check = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={3}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
export const XMark = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={3}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const Shield = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z" /><path d="M8.8 12l2.2 2.2 4.2-4.4" /></svg>
);
export const Scan = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 8V5.5A1.5 1.5 0 015.5 4H8M16 4h2.5A1.5 1.5 0 0120 5.5V8M20 16v2.5a1.5 1.5 0 01-1.5 1.5H16M8 20H5.5A1.5 1.5 0 014 18.5V16M4 12h16" /></svg>
);
export const Book = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 5.5A1.5 1.5 0 015.5 4H11v16H5.5A1.5 1.5 0 014 18.5zM20 5.5A1.5 1.5 0 0018.5 4H13v16h5.5a1.5 1.5 0 001.5-1.5z" /></svg>
);
export const Tag = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M3.5 12.3V4.5a1 1 0 011-1h7.8l8.2 8.2a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0z" /><circle cx="8" cy="8" r="1.5" /></svg>
);
export const Coin = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="12" r="9" /><path d="M14.5 9.2c-.5-.8-1.5-1.2-2.5-1.2-1.4 0-2.5.8-2.5 2s1.1 1.6 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-2-.4-2.5-1.2M12 6.5V8M12 16v1.5" /></svg>
);
export const Cards = ({ className = "h-7 w-7" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="8" y="3.5" width="11" height="15" rx="1.5" transform="rotate(12 13.5 11)" /><path d="M6.8 7.3L5 7.7a1.5 1.5 0 00-1.1 1.8l2.5 10.3A1.5 1.5 0 008.2 21l6-1.5" /></svg>
);
