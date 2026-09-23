'use client';

// 재사용 점수 바 (love 리포트, 전체 18수치 등에서 사용)
export function ScoreCard({
  label,
  value,
  highlight = false,
  muted = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  muted?: boolean;
}) {
  const width = Math.max(3, Math.min(100, value));
  return (
    <div className="mb-[9px] grid grid-cols-[minmax(64px,auto)_1fr_34px] items-center gap-2.5">
      <span className={`text-[12.5px] ${muted ? 'text-[#C4B3B8]' : 'text-ink-soft'}`}>{label}</span>
      <div className="h-[7px] overflow-hidden rounded-md bg-line">
        <div
          className="h-full rounded-md"
          style={{
            width: `${width}%`,
            background: highlight
              ? 'linear-gradient(90deg,#E9A23B,#C9761B)'
              : 'linear-gradient(90deg,#C2607A,#A44863)',
          }}
        />
      </div>
      <span className={`text-right font-display text-[13px] tabular-nums ${muted ? 'text-[#C4B3B8]' : 'text-ink'}`}>
        {value}
      </span>
    </div>
  );
}
