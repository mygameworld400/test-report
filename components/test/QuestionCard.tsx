'use client';

import { useEffect, useState } from 'react';
import type { AnswerInput, MeQuestion, OptionId, ScoreObject } from '@/lib/types';
import { ReasonInput } from './ReasonInput';
import { OtherAnswerInput } from './OtherAnswerInput';

export function QuestionCard({
  question,
  index,
  total,
  answer,
  onSelectOption,
  onReason,
  onOtherScored,
  onOtherFallback,
}: {
  question: MeQuestion;
  index: number; // 1-based 표시용
  total: number;
  answer?: AnswerInput;
  onSelectOption: (optionId: OptionId) => void;
  onReason: (text: string) => void;
  onOtherScored: (otherScore: ScoreObject, text: string, tags: string[]) => void;
  onOtherFallback: (optionId: OptionId, text: string) => void;
}) {
  const [otherOpen, setOtherOpen] = useState(false);

  // 질문이 바뀌면 OTHER 패널 상태 초기화 (이미 OTHER로 답한 경우엔 열어둠)
  useEffect(() => {
    setOtherOpen(!!answer?.isOther);
  }, [question.id, answer?.isOther]);

  const selectedOption = !answer?.isOther ? answer?.optionId : undefined;
  const otherResolved = answer?.isOther && !!answer.otherScore;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-pink">
        {question.category}
      </div>
      <h2 className="text-xl font-bold leading-snug text-ink mb-5">{question.prompt}</h2>

      <div className="flex flex-col gap-3">
        {question.options.map((o) => {
          const active = selectedOption === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setOtherOpen(false);
                onSelectOption(o.id);
              }}
              className={[
                'text-left rounded-2xl border px-4 py-4 transition-all duration-150',
                'flex items-start gap-3',
                active
                  ? 'border-pink bg-blush shadow-card'
                  : 'border-beige bg-white hover:border-pink-soft hover:shadow-card',
              ].join(' ')}
            >
              <span
                className={[
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  active ? 'bg-pink text-white' : 'bg-beige text-muted',
                ].join(' ')}
              >
                {o.id}
              </span>
              <span className="text-[15px] leading-relaxed text-ink">{o.text}</span>
            </button>
          );
        })}
      </div>

      {/* A/B/C/D 선택 후: 이유 추가 (점수 영향 없음) */}
      {selectedOption && !otherOpen && (
        <ReasonInput value={answer?.reasonText ?? ''} onChange={onReason} />
      )}

      {/* OTHER 진입점 */}
      {!otherOpen && !otherResolved && (
        <button
          type="button"
          onClick={() => setOtherOpen(true)}
          className="mt-4 w-full rounded-2xl border border-dashed border-pink-soft py-3 text-sm font-medium text-pink-deep hover:bg-blush/40 transition-colors"
        >
          ✏️ 나는 조금 달라요
        </button>
      )}

      {/* OTHER 패널 */}
      {otherOpen && (
        <OtherAnswerInput
          question={question}
          initialText={answer?.reasonText ?? ''}
          onScored={(score, text, tags) => {
            onOtherScored(score, text, tags);
          }}
          onFallbackSelect={(optionId, text) => {
            setOtherOpen(false);
            onOtherFallback(optionId, text);
          }}
        />
      )}

      {/* OTHER 완료 표시 */}
      {otherResolved && (
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-blush/50 px-4 py-3 text-sm animate-fade-in-up">
          <span className="text-pink-deep">✓ 내 답변으로 분석 반영됨</span>
          <button
            type="button"
            onClick={() => setOtherOpen(true)}
            className="text-xs text-muted underline hover:text-pink-deep"
          >
            수정
          </button>
        </div>
      )}
    </div>
  );
}
