'use client';

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-pink-deep">{current} / {total}</span>
        <span className="text-xs text-muted">{pct}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-beige overflow-hidden">
        <div
          className="h-full rounded-full bg-pink transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
