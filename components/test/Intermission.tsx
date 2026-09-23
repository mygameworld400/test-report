'use client';

const MESSAGES: Record<number, { emoji: string; title: string; sub: string }> = {
  10: { emoji: '🌱', title: '10개 완료!', sub: '벌써 시작이 좋아요. 편하게 계속 가볼까요?' },
  20: { emoji: '🌤️', title: '절반 가까이 왔어요', sub: '정답은 없어요. 지금 느낌 그대로면 충분해요.' },
  30: { emoji: '🔥', title: '30개 돌파!', sub: '이제 조금만 더 하면 결과가 보여요.' },
  40: { emoji: '🏁', title: '마지막 스퍼트', sub: '5문항만 더! 곧 내 캐릭터를 만나요.' },
};

export function Intermission({ count, onContinue }: { count: number; onContinue: () => void }) {
  const m = MESSAGES[count] ?? { emoji: '✨', title: `${count}개 완료!`, sub: '계속 가볼까요?' };
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center text-center animate-fade-in-up">
      <div className="text-6xl mb-4">{m.emoji}</div>
      <h2 className="text-2xl font-bold text-ink mb-2">{m.title}</h2>
      <p className="text-muted mb-8 max-w-xs">{m.sub}</p>
      <button
        type="button"
        onClick={onContinue}
        className="rounded-full bg-pink px-10 py-3.5 font-semibold text-white shadow-card hover:bg-pink-deep transition-colors"
      >
        계속하기
      </button>
    </div>
  );
}
