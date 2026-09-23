export function SectionHeader({ no, title }: { no: string; title: string }) {
  return (
    <div className="mb-[18px] flex items-center gap-3">
      <span className="font-display text-[12px] tracking-widest text-gold tabular-nums">{no}</span>
      <h3 className="font-serif text-[19px] font-extrabold tracking-tight text-ink">{title}</h3>
    </div>
  );
}
