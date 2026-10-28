export default function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border border-amber-300/70 bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-200 ${className}`}
    >
      Demo – Class Project
    </span>
  );
}
