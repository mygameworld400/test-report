'use client';

import type { SignatureDim } from '@/lib/resultInsights';

export function SignatureCard({ dims }: { dims: SignatureDim[] }) {
  // 대비 문구: 최고 high 와 최저 low 를 찾아 안내
  const high = dims.find((d) => d.direction === 'high');
  const low = dims.find((d) => d.direction === 'low');

  return (
    <div>
      <p className="mb-5 mt-[-8px] text-[12.5px] leading-relaxed text-muted">
        높은 수치만이 아니라, 가장 <b className="text-ink">당신다운 대비</b>를 골랐어요.
      </p>

      <div className="flex flex-col">
        {dims.map((d) => (
          <div
            key={d.key}
            className="grid grid-cols-[auto_1fr] items-baseline gap-4 border-b border-line py-[18px] last:border-b-0"
          >
            <div
              className="font-display text-[46px] font-semibold leading-[0.9] tracking-tight tabular-nums"
              style={{ color: d.direction === 'low' ? '#7C8BA1' : '#A44863' }}
            >
              {d.value}
              <sup className="ml-0.5 align-super text-[15px] font-medium text-muted">/100</sup>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[15px] font-semibold text-ink">{d.label}</span>
                <Badge direction={d.direction} />
              </div>
              <p className="mt-1.5 text-[13.5px] leading-snug text-ink-soft">{d.text}</p>
            </div>
          </div>
        ))}
      </div>

      {high && low && (
        <div className="mt-[18px] rounded-2xl border border-[#ECDCC6] bg-[#F6EFE7] px-4 py-3 text-[12.5px] leading-relaxed text-ink-soft">
          {high.label} <b className="text-ink">{high.value}</b> ↔ {low.label} <b className="text-ink">{low.value}</b>. 이
          간격이 당신의 핵심이에요 — 한쪽으로 치우쳤다기보다, <b className="text-ink">분명한 방식</b>을 가진 것에 가깝습니다.
        </div>
      )}
    </div>
  );
}

function Badge({ direction }: { direction: 'high' | 'low' | 'mid' }) {
  if (direction === 'high')
    return <span className="rounded-full bg-blush px-2 py-[3px] text-[9.5px] font-semibold uppercase tracking-wider text-rose-deep">매우 높음</span>;
  if (direction === 'low')
    return <span className="rounded-full bg-[#EAEEF3] px-2 py-[3px] text-[9.5px] font-semibold uppercase tracking-wider text-[#5E6C82]">매우 낮음</span>;
  return <span className="rounded-full bg-beige px-2 py-[3px] text-[9.5px] font-semibold uppercase tracking-wider text-muted">중간</span>;
}
