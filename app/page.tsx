'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { ME_QUESTIONS } from '@/data/meQuestions';

export default function HomePage() {
  const [hasProgress, setHasProgress] = useState(false);

  useEffect(() => {
    const s = storage.load();
    setHasProgress(!!s && s.answers.some((a) => a.optionId || a.otherScore));
  }, []);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-10">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-6 text-7xl">💗</div>
        <h1 className="text-3xl font-extrabold leading-tight text-ink">
          ME
          <span className="block text-lg font-semibold text-pink-deep mt-1">
            내 연애스타일 분석
          </span>
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted">
          45개의 상황에서 <b className="text-ink">내가 어떻게 생각하고 행동하는지</b>로
          나의 연애 성향과 캐릭터를 알아봐요.
        </p>

        <div className="mt-8 grid w-full grid-cols-3 gap-2 text-center">
          {[
            { n: ME_QUESTIONS.length, l: '상황 질문' },
            { n: 18, l: '연애 수치' },
            { n: 12, l: '캐릭터' },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-white p-4 shadow-card">
              <div className="text-2xl font-extrabold text-pink-deep">{s.n}</div>
              <div className="mt-1 text-xs text-muted">{s.l}</div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-muted/80">
          ⚠️ 이 서비스는 심리 진단이 아니라, 내 연애 패턴을 이해하기 위한 자기이해 콘텐츠예요.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/test"
          className="rounded-full bg-pink py-4 text-center font-bold text-white shadow-card hover:bg-pink-deep transition-colors"
        >
          {hasProgress ? '이어서 하기' : '테스트 시작하기'}
        </Link>
        {hasProgress && (
          <button
            type="button"
            onClick={() => {
              storage.clear();
              setHasProgress(false);
            }}
            className="text-sm text-muted underline hover:text-pink-deep"
          >
            처음부터 다시 하기
          </button>
        )}
      </div>
    </main>
  );
}
