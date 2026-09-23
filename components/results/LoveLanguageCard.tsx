'use client';

import type { LoveKey } from '@/lib/types';
import type { NormalizedScores } from '@/lib/types';
import { ScoreCard } from './ScoreCard';

const TYPES: { base: string; give: LoveKey; receive: LoveKey; emoji: string }[] = [
  { base: '말', give: 'giveWords', receive: 'receiveWords', emoji: '💬' },
  { base: '시간', give: 'giveTime', receive: 'receiveTime', emoji: '⏳' },
  { base: '스킨십', give: 'giveTouch', receive: 'receiveTouch', emoji: '🤍' },
  { base: '선물·기념', give: 'giveGift', receive: 'receiveGift', emoji: '🎁' },
  { base: '실질적 도움', give: 'giveHelp', receive: 'receiveHelp', emoji: '🤝' },
];

const GIVE_ORDER: LoveKey[] = ['giveWords', 'giveTime', 'giveTouch', 'giveGift', 'giveHelp'];
const RECEIVE_ORDER: LoveKey[] = ['receiveWords', 'receiveTime', 'receiveTouch', 'receiveGift', 'receiveHelp'];
const LABEL: Record<LoveKey, string> = {
  giveWords: '말', giveTime: '시간', giveTouch: '스킨십', giveGift: '선물·기념', giveHelp: '실질적 도움',
  receiveWords: '말', receiveTime: '시간', receiveTouch: '스킨십', receiveGift: '선물·기념', receiveHelp: '실질적 도움',
};

export function LoveLanguageCard({ love }: { love: NormalizedScores<LoveKey> }) {
  // 지배적 사랑 언어 = give+receive 합이 가장 큰 타입
  const dominant = [...TYPES].sort(
    (a, b) => love[b.give] + love[b.receive] - (love[a.give] + love[a.receive]),
  )[0];
  const topGive = Math.round(love[dominant.give]);
  const topReceive = Math.round(love[dominant.receive]);

  const giveRows = GIVE_ORDER.map((k) => ({ k, v: Math.round(love[k]) })).sort((a, b) => b.v - a.v);
  const recvRows = RECEIVE_ORDER.map((k) => ({ k, v: Math.round(love[k]) })).sort((a, b) => b.v - a.v);

  return (
    <div>
      <div className="mb-5 flex items-center gap-4">
        <div className="text-[34px]">{dominant.emoji}</div>
        <div>
          <div className="font-display text-[15px] font-semibold text-ink">
            당신의 사랑 언어 · {dominant.base}
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
            여러 방식 중 <b className="text-ink">{dominant.base}</b>(으)로 사랑을 전하고, 또 그렇게 받을 때 가장
            사랑받는다고 느끼는 편이에요.
          </p>
        </div>
      </div>

      <h4 className="mb-2.5 mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">주는 사랑</h4>
      {giveRows.map((r, i) => (
        <ScoreCard key={r.k} label={LABEL[r.k]} value={r.v} highlight={i === 0 && r.v > 0} muted={r.v === 0} />
      ))}

      <h4 className="mb-2.5 mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">받고 싶은 사랑</h4>
      {recvRows.map((r, i) => (
        <ScoreCard key={r.k} label={LABEL[r.k]} value={r.v} highlight={i === 0 && r.v > 0} muted={r.v === 0} />
      ))}

      <p className="mt-3 text-[11.5px] text-muted">
        주는 {dominant.base} {topGive} · 받고 싶은 {dominant.base} {topReceive} — 각 수치는 서로 독립이에요.
      </p>
    </div>
  );
}
