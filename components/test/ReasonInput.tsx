'use client';

import { useState } from 'react';

// A/B/C/D 선택 후 "이 선택을 한 이유 추가하기"
// - 선택지 점수는 절대 바꾸지 않는다. 이 텍스트는 설명 개인화(tags)용.
export function ReasonInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (text: string) => void;
}) {
  const [open, setOpen] = useState(!!value);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 text-sm text-muted hover:text-pink-deep transition-colors"
      >
        💬 이 선택을 한 이유 추가하기
      </button>
    );
  }

  return (
    <div className="mt-3 animate-fade-in-up">
      <label className="block text-sm text-muted mb-1.5">
        💬 이유 (선택) — 점수에는 영향을 주지 않고 결과 설명에만 반영돼요
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="왜 이 선택을 했는지 편하게 적어주세요."
        className="w-full rounded-2xl border border-beige bg-white p-3 text-sm text-ink placeholder:text-muted/60 focus:border-pink-soft focus:outline-none focus:ring-2 focus:ring-pink-soft/40 resize-none"
      />
    </div>
  );
}
