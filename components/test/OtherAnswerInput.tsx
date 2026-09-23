'use client';

import { useState } from 'react';
import type { MeQuestion, OptionId, ScoreObject } from '@/lib/types';
import { classifyOther } from '@/lib/otherAnswerClassifier';

// "✏️ 나는 조금 달라요" — OTHER 자유입력
// A/B/C/D "이유 추가"와 완전히 다른 경로. 이 답변만 optionSimilarity 방식으로 점수 계산.
export function OtherAnswerInput({
  question,
  initialText = '',
  onScored,
  onFallbackSelect,
}: {
  question: MeQuestion;
  initialText?: string;
  onScored: (otherScore: ScoreObject, text: string, tags: string[]) => void;
  onFallbackSelect: (optionId: OptionId, text: string) => void;
}) {
  const [text, setText] = useState(initialText);
  const [busy, setBusy] = useState(false);
  const [followup, setFollowup] = useState(false);
  const [note, setNote] = useState<string>('');

  async function analyze() {
    if (!text.trim() || busy) return;
    setBusy(true);
    setNote('');
    try {
      const outcome = await classifyOther(question, text.trim());
      if (outcome.status === 'scored') {
        onScored(outcome.otherScore, text.trim(), outcome.tags);
      } else {
        // confidence < .40 → 보조 선택질문
        setFollowup(true);
      }
    } catch {
      setNote('분석 중 문제가 발생했어요. 아래에서 가장 가까운 답을 골라주세요.');
      setFollowup(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 animate-fade-in-up rounded-2xl border border-pink-soft/60 bg-blush/40 p-4">
      <label className="block text-sm font-medium text-pink-deep mb-2">
        ✏️ 나는 조금 달라요 — 내 생각을 자유롭게 적어주세요
      </label>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setFollowup(false);
        }}
        rows={4}
        placeholder="선택지에 없는 나만의 반응을 적어주세요."
        className="w-full rounded-xl border border-beige bg-white p-3 text-sm text-ink placeholder:text-muted/60 focus:border-pink-soft focus:outline-none focus:ring-2 focus:ring-pink-soft/40 resize-none"
      />

      {!followup && (
        <button
          type="button"
          onClick={analyze}
          disabled={!text.trim() || busy}
          className="mt-3 w-full rounded-xl bg-pink py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:bg-pink-deep transition-colors"
        >
          {busy ? '분석 중…' : '이 답변으로 분석하기'}
        </button>
      )}

      {followup && (
        <div className="mt-4 animate-fade-in-up">
          <p className="text-sm text-ink mb-1">
            적어주신 답변을 정확히 이해하기 어려워요. 아래 중 <b>그나마 가까운 쪽</b>은 무엇인가요?
          </p>
          {note && <p className="text-xs text-pink-deep mb-2">{note}</p>}
          <div className="mt-2 flex flex-col gap-2">
            {question.options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => onFallbackSelect(o.id, text.trim())}
                className="text-left rounded-xl border border-beige bg-white px-3 py-2.5 text-sm hover:border-pink-soft hover:bg-blush/40 transition-colors"
              >
                <span className="font-semibold text-pink-deep mr-1.5">{o.id}</span>
                {o.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
