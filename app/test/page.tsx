'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ME_QUESTIONS } from '@/data/meQuestions';
import type { AnswerInput, MeQuestion, OptionId, ScoreObject } from '@/lib/types';
import { storage, upsertAnswer, getAnswer, type TestState } from '@/lib/storage';
import { buildQuestionOrder } from '@/lib/questionOrder';
import { ProgressBar } from '@/components/test/ProgressBar';
import { QuestionCard } from '@/components/test/QuestionCard';
import { Intermission } from '@/components/test/Intermission';

const TOTAL = ME_QUESTIONS.length;
const byId = new Map(ME_QUESTIONS.map((q) => [q.id, q]));

function freshState(): TestState {
  return {
    answers: [],
    order: buildQuestionOrder(),
    currentIndex: 0,
    startedAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export default function TestPage() {
  const router = useRouter();
  const [state, setState] = useState<TestState | null>(null);
  const [intermission, setIntermission] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // 새로고침 후 이어하기: 저장된 상태 로드
  useEffect(() => {
    const saved = storage.load();
    if (saved && Array.isArray(saved.order) && saved.order.length === TOTAL) {
      setState(saved);
    } else {
      const s = freshState();
      setState(s);
      storage.save(s);
    }
    setHydrated(true);
  }, []);

  const persist = (next: TestState) => {
    next.updatedAt = Date.now();
    setState(next);
    storage.save(next);
  };

  const currentQuestion: MeQuestion | null = useMemo(() => {
    if (!state) return null;
    const id = state.order[state.currentIndex];
    return byId.get(id) ?? null;
  }, [state]);

  if (!hydrated || !state || !currentQuestion) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md items-center justify-center px-5">
        <p className="text-muted">불러오는 중…</p>
      </main>
    );
  }

  const answer = getAnswer(state, currentQuestion.id);
  const answered = !!answer && (!!answer.optionId || !!answer.otherScore);
  const isLast = state.currentIndex === TOTAL - 1;
  const answeredCount = state.answers.filter((a) => a.optionId || a.otherScore).length;

  // ---- 답변 핸들러 ----
  const setAnswer = (partial: Omit<AnswerInput, 'questionId'>) => {
    const merged: AnswerInput = { ...partial, questionId: currentQuestion.id };
    persist(upsertAnswer(state, merged));
  };

  const handleSelectOption = (optionId: OptionId) => {
    const prev = getAnswer(state, currentQuestion.id);
    setAnswer({
      optionId,
      isOther: false,
      otherScore: undefined,
      reasonText: prev?.isOther ? '' : prev?.reasonText,
      reasonTags: prev?.reasonTags,
    });
  };

  const handleReason = (text: string) => {
    const prev = getAnswer(state, currentQuestion.id);
    if (!prev) return;
    setAnswer({ ...prev, reasonText: text });
  };

  const handleOtherScored = (otherScore: ScoreObject, text: string, tags: string[]) => {
    setAnswer({
      optionId: undefined,
      isOther: true,
      otherScore,
      reasonText: text,
      reasonTags: tags,
    });
  };

  const handleOtherFallback = (optionId: OptionId, text: string) => {
    setAnswer({ optionId, isOther: false, otherScore: undefined, reasonText: text });
  };

  // ---- 네비게이션 ----
  const goPrev = () => {
    if (state.currentIndex === 0) return;
    persist({ ...state, currentIndex: state.currentIndex - 1 });
  };

  const goNext = () => {
    if (!answered) return;
    if (isLast) {
      if (answeredCount >= TOTAL) router.push('/result');
      return;
    }
    const nextIndex = state.currentIndex + 1;
    persist({ ...state, currentIndex: nextIndex });
    if (nextIndex % 10 === 0 && nextIndex < TOTAL) setIntermission(nextIndex);
  };

  if (intermission !== null) {
    return (
      <main className="mx-auto max-w-md px-5">
        <Intermission count={intermission} onContinue={() => setIntermission(null)} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-5 pb-28 pt-6">
      <ProgressBar current={state.currentIndex + 1} total={TOTAL} />

      <div className="mt-7">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          index={state.currentIndex + 1}
          total={TOTAL}
          answer={answer}
          onSelectOption={handleSelectOption}
          onReason={handleReason}
          onOtherScored={handleOtherScored}
          onOtherFallback={handleOtherFallback}
        />
      </div>

      {/* 하단 고정 네비게이션 */}
      <div className="fixed inset-x-0 bottom-0 border-t border-beige bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3 px-5 py-3.5">
          <button
            type="button"
            onClick={goPrev}
            disabled={state.currentIndex === 0}
            className="rounded-full border border-beige bg-white px-5 py-3 text-sm font-medium text-muted disabled:opacity-40 hover:border-pink-soft transition-colors"
          >
            이전
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!answered}
            className="flex-1 rounded-full bg-pink py-3 text-sm font-semibold text-white shadow-card disabled:opacity-40 hover:bg-pink-deep transition-colors"
          >
            {isLast ? '결과 보기' : '다음'}
          </button>
        </div>
      </div>
    </main>
  );
}
