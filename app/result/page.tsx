'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ME_QUESTIONS } from '@/data/meQuestions';
import { storage } from '@/lib/storage';
import { analyzeME } from '@/lib/analyze';
import { buildFreePreview, evaluateInsights, LOCKED_SECTION_TITLES } from '@/lib/resultInsights';
import { CHARACTER_META } from '@/lib/characterMeta';
import type { AnswerInput, CharacterResult, CoreKey, LoveKey, NormalizedScores } from '@/lib/types';
import { CharacterCard } from '@/components/results/CharacterCard';
import { SectionHeader } from '@/components/results/SectionHeader';
import { SignatureCard } from '@/components/results/SignatureCard';
import { PatternCard } from '@/components/results/PatternCard';
import { LoveLanguageCard } from '@/components/results/LoveLanguageCard';
import { LockedSection } from '@/components/results/LockedSection';
import type { SignatureDim } from '@/lib/resultInsights';

type Analysis = {
  character: CharacterResult;
  core: NormalizedScores<CoreKey>;
  love: NormalizedScores<LoveKey>;
  signature: SignatureDim[];
  pattern: { title: string; text: string } | null;
  remaining: number;
  essenceLead: string;
  essenceBody: string;
  peekText: string;
};

export default function ResultPage() {
  const [state, setState] = useState<'loading' | 'incomplete' | 'ready'>('loading');
  const [data, setData] = useState<Analysis | null>(null);

  useEffect(() => {
    const s = storage.load();
    const answers = (s?.answers ?? []).filter(
      (a): a is AnswerInput => !!a.optionId || !!a.otherScore,
    );
    if (answers.length !== ME_QUESTIONS.length) {
      setState('incomplete');
      return;
    }
    try {
      const r = analyzeME(answers);
      const meta = CHARACTER_META[r.character.primary.key];
      const tags = answers.flatMap((a) => a.reasonTags ?? []);
      const preview = buildFreePreview(r.character, r.core.normalized, meta.tagline, tags);
      const insights = evaluateInsights(r.core.normalized);

      // essence 를 리드 문장 + 본문으로 분리
      const parts = meta.essence.split(/(?<=다\.)\s+/);
      const essenceLead = parts[0] ?? meta.essence;
      const essenceBody = parts.slice(1).join(' ');

      setData({
        character: r.character,
        core: r.core.normalized,
        love: r.love.normalized,
        signature: preview.signatureDims,
        pattern: preview.repeatPattern,
        remaining: Math.max(0, insights.length - 1),
        essenceLead,
        essenceBody,
        peekText: `${meta.strengths.join('. ')}. 다만 이 강점이 관계에서 온전히 빛나려면…`,
      });
      setState('ready');
    } catch {
      setState('incomplete');
    }
  }, []);

  if (state === 'loading') {
    return (
      <main className="mx-auto flex min-h-dvh max-w-[430px] items-center justify-center px-6">
        <p className="text-muted">리포트를 불러오는 중…</p>
      </main>
    );
  }

  if (state === 'incomplete' || !data) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-[430px] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 text-5xl">📝</div>
        <p className="mb-6 text-ink-soft">아직 45문항을 모두 완료하지 않았어요.</p>
        <Link href="/test" className="rounded-full bg-rose px-8 py-3 font-semibold text-white shadow-card">
          테스트 이어하기
        </Link>
      </main>
    );
  }

  const meta = CHARACTER_META[data.character.primary.key];

  return (
    <main className="mx-auto max-w-[430px] overflow-hidden px-[22px] pb-10">
      <CharacterCard character={data.character} />

      {/* 정체성 */}
      <section className="border-t border-line py-[30px]">
        <p className="font-serif text-[21px] leading-relaxed tracking-tight text-ink">
          <span className="mr-0.5 align-[-6px] font-display text-[30px] text-gold">“</span>
          {data.essenceLead}
        </p>
        {data.essenceBody && (
          <p className="mt-4 text-[14.5px] leading-[1.9] text-ink-soft">{data.essenceBody}</p>
        )}
      </section>

      {/* 01 시그니처 */}
      <section className="border-t border-line py-[30px]">
        <SectionHeader no="01" title="당신을 가장 잘 보여주는 3가지" />
        <SignatureCard dims={data.signature} />
      </section>

      {/* 02 반복 패턴 */}
      {data.pattern && (
        <section className="border-t border-line py-[30px]">
          <SectionHeader no="02" title="연애에서 반복하기 쉬운 패턴" />
          <PatternCard title={data.pattern.title} text={data.pattern.text} remaining={data.remaining} />
        </section>
      )}

      {/* 03 사랑 언어 */}
      <section className="border-t border-line py-[30px]">
        <SectionHeader no="03" title="사랑을 전하고 받는 방식" />
        <LoveLanguageCard love={data.love} />
      </section>

      {/* 04 전체 리포트 (잠금) */}
      <section className="border-t border-line py-[30px]">
        <SectionHeader no="04" title="전체 리포트" />
        <LockedSection
          peekTitle="관계에서의 강점"
          peekText={data.peekText}
          lockedTitles={LOCKED_SECTION_TITLES}
          archetypeName={meta.nameKo}
        />

        <div className="mt-6 flex gap-2.5">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-3.5 text-[13.5px] font-medium text-ink-soft"
          >
            처음으로
          </Link>
          <button
            onClick={() => {
              storage.clear();
              location.href = '/test';
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-3.5 text-[13.5px] font-medium text-ink-soft"
          >
            다시 테스트
          </button>
        </div>

        <p className="mt-[26px] text-center text-[11px] leading-relaxed text-muted">
          이 리포트는 심리 진단이 아닌 자기이해 콘텐츠예요.
          <br />
          같은 답변은 항상 같은 결과로 계산됩니다 · ME v1.0
        </p>
      </section>
    </main>
  );
}
