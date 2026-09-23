'use client';

export function PatternCard({
  title,
  text,
  remaining,
}: {
  title: string;
  text: string;
  remaining: number;
}) {
  return (
    <div>
      <span className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
        ✦ Free Preview
      </span>
      <div className="relative mt-3.5 overflow-hidden rounded-[20px] border border-line bg-surface px-[22px] py-6 shadow-card">
        <span className="pointer-events-none absolute -top-[18px] right-3.5 font-display text-[120px] leading-none text-blush">
          &ldquo;
        </span>
        <div className="relative font-serif text-[16px] font-bold text-rose-deep">{title}</div>
        <p className="relative mt-3 font-serif text-[18.5px] leading-relaxed text-ink">{text}</p>
      </div>
      {remaining > 0 && (
        <p className="mt-3.5 text-center text-[12.5px] text-muted">
          전체 리포트에는 당신의 패턴 <b className="text-rose-deep">{remaining}가지</b>가 더 담겨 있어요
        </p>
      )}
    </div>
  );
}
