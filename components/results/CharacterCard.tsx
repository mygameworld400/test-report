'use client';

import type { CharacterResult } from '@/lib/types';
import { CHARACTER_META } from '@/lib/characterMeta';

const BLEND_LABEL: Record<string, string> = {
  very_mixed: '복합형 · Mixed',
  mixed: '혼합형 · Blended',
  moderately_clear: '뚜렷한 편 · Defined',
  clear: '뚜렷한 유형 · Distinct',
};

export function CharacterCard({ character }: { character: CharacterResult }) {
  const meta = CHARACTER_META[character.primary.key];
  const secondary = CHARACTER_META[character.secondary.key];
  const [g0, g1] = meta.gradient;

  return (
    <section className="pt-9 pb-7 text-center">
      <span className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.3em] text-muted before:h-px before:w-5 before:bg-gold/70 after:h-px after:w-5 after:bg-gold/70">
        My Love Archetype
      </span>

      <div
        className="relative mx-auto mt-6 grid h-24 w-24 place-items-center rounded-full"
        style={{
          background: `conic-gradient(from 140deg, ${g1}, ${g0}, ${g1})`,
          boxShadow: `0 14px 30px ${g0}44, inset 0 0 0 1px rgba(255,255,255,.35)`,
        }}
      >
        <span className="absolute inset-[6px] rounded-full border border-white/45" />
        <span className="relative font-display text-[44px] font-semibold text-white drop-shadow">
          {meta.monogram}
        </span>
      </div>

      <div className="mt-5 font-display text-[13px] font-medium uppercase tracking-[0.34em]" style={{ color: g0 }}>
        {meta.nameEn}
      </div>
      <h1 className="mt-1.5 font-serif text-[52px] font-extrabold leading-[1.05] tracking-tight text-ink">
        {meta.nameKo}
      </h1>
      <div className="mt-4 font-serif text-[17px] italic text-ink-soft">“{meta.tagline}”</div>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Chip>
          유사도 <b className="font-display font-semibold text-ink">{Math.round(character.primary.similarity)}%</b>
        </Chip>
        <Chip>
          보조 유형 <b className="font-semibold text-rose-deep">{secondary.nameKo}</b>
        </Chip>
        <Chip>{BLEND_LABEL[character.blendStrength]}</Chip>
      </div>
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-[11.5px] text-ink-soft shadow-cardSm">
      {children}
    </span>
  );
}
