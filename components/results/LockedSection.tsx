'use client';

import { useState } from 'react';

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[15px] w-[15px]">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function LockedSection({
  peekTitle,
  peekText,
  lockedTitles,
  price = 4900,
  wasPrice = 9900,
  archetypeName,
}: {
  peekTitle: string;
  peekText: string;
  lockedTitles: string[];
  price?: number;
  wasPrice?: number;
  archetypeName: string;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div>
      {/* 블러 미리보기 */}
      <div className="relative my-4 overflow-hidden rounded-2xl border border-line">
        <div className="bg-surface p-5">
          <h4 className="mb-2 font-serif text-[15px] font-bold text-ink">{peekTitle}</h4>
          <p className="select-none text-[13.5px] leading-relaxed text-ink-soft blur-[5px]">{peekText}</p>
        </div>
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-b from-transparent to-cream/95 pb-3.5">
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-rose-deep">🔒 전체 리포트에서 공개</span>
        </div>
      </div>

      {/* 잠금 리스트 */}
      <div className="flex flex-col gap-[9px]">
        {lockedTitles.map((t) => (
          <div key={t} className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-[15px] shadow-cardSm">
            <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-[9px] bg-[#F1E7EC] text-rose-deep">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
                <path d="M12 3s7 2 7 9-4 8-7 9c-3-1-7-3-7-9s7-9 7-9z" />
              </svg>
            </span>
            <span className="text-[14px] font-medium text-ink">{t}</span>
            <span className="ml-auto text-muted">
              <LockIcon />
            </span>
          </div>
        ))}
      </div>

      {/* 언락 CTA */}
      <div className="relative mt-[22px] overflow-hidden rounded-[22px] px-[22px] py-[26px] text-center text-white shadow-[0_20px_44px_rgba(58,30,45,.34)]"
        style={{ background: 'linear-gradient(160deg,#2E1D26,#43222F)' }}>
        <span
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 80% 0, rgba(233,162,59,.22), transparent 60%)' }}
        />
        <div className="relative font-display text-[11px] uppercase tracking-[0.28em] text-gold-soft">Full Report</div>
        <h3 className="relative mt-3 font-serif text-[22px] font-extrabold leading-snug text-white">
          {archetypeName}의 연애, 끝까지 읽어보기
        </h3>
        <p className="relative mt-3 text-[13px] leading-relaxed text-[#E9D9DF]">
          {lockedTitles.length}개의 심층 섹션과 18개 수치 전체,
          <br />
          나와 맞는·부딪히는 아키타입까지.
        </p>
        <div className="relative mt-5 mb-1 flex items-baseline justify-center gap-2">
          <span className="text-[14px] text-[#B9A0A9] line-through">{wasPrice.toLocaleString()}원</span>
          <span className="font-display text-[32px] font-semibold text-white">{price.toLocaleString()}</span>
          <span className="text-[15px] text-[#E9D9DF]">원</span>
        </div>
        <button
          onClick={() => setSheetOpen(true)}
          className="relative mt-4 w-full rounded-full py-4 text-[15.5px] font-bold text-ink"
          style={{ background: 'linear-gradient(135deg,#E7D3A8,#C4A05E)', boxShadow: '0 10px 24px rgba(196,160,94,.4)' }}
        >
          전체 리포트 열기
        </button>
        <div className="relative mt-3 text-[10.5px] text-[#B9A0A9]">1회 결제 · 평생 다시보기 · 링크로 공유 가능</div>
      </div>

      {/* 모의 결제 시트 */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-[rgba(46,29,38,.5)]"
          onClick={() => setSheetOpen(false)}
        >
          <div
            className="w-full max-w-[430px] rounded-t-[26px] bg-cream px-6 pb-[calc(30px+env(safe-area-inset-bottom,0px))] pt-[26px] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-[18px] h-1 w-10 rounded bg-line" />
            <h4 className="mb-2 font-serif text-[19px] font-extrabold text-ink">전체 리포트 열기</h4>
            <p className="mb-[18px] text-[13px] leading-relaxed text-ink-soft">
              지금은 결제 화면 미리보기예요.
              <br />
              실제 서비스에서는 여기서 안전하게 결제가 진행됩니다.
            </p>
            <button
              onClick={() => setSheetOpen(false)}
              className="w-full rounded-full py-[15px] text-[15px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#C2607A,#A44863)' }}
            >
              {price.toLocaleString()}원 결제하기 (모의)
            </button>
            <button onClick={() => setSheetOpen(false)} className="mt-3 text-[13px] text-muted underline">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
