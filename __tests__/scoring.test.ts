// §15 점수/정규화 검증
import { describe, it, expect } from './_harness';
import { ME_QUESTIONS } from '@/data/meQuestions';
import { CORE_KEYS } from '@/data/coreDimensions';
import { LOVE_KEYS } from '@/data/loveDimensions';
import {
  calculateAllScores,
  calculateCoreScores,
  calculateLoveScores,
  buildDimensionRanges,
  normalizeDimensions,
} from '@/lib/scoring';
import type { AnswerInput, OptionId } from '@/lib/types';

const answersAll = (opt: OptionId): AnswerInput[] =>
  ME_QUESTIONS.map((q) => ({ questionId: q.id, optionId: opt }));

// 결정적 의사난수 답변 (seed)
function seededAnswers(seed: number): AnswerInput[] {
  let s = seed;
  const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const opts: OptionId[] = ['A', 'B', 'C', 'D'];
  return ME_QUESTIONS.map((q) => ({ questionId: q.id, optionId: opts[Math.floor(rnd() * 4)] }));
}

describe('정규화/점수 (§15)', () => {
  it('normalized 는 항상 0~100 & NaN 없음 (A/B/C/D 전체 + 랜덤 50케이스)', () => {
    const cases: AnswerInput[][] = [
      answersAll('A'),
      answersAll('B'),
      answersAll('C'),
      answersAll('D'),
    ];
    for (let i = 0; i < 50; i++) cases.push(seededAnswers(i + 1));

    for (const ans of cases) {
      const { core, love } = calculateAllScores(ans);
      for (const k of CORE_KEYS) {
        const v = core.normalized[k];
        expect(Number.isNaN(v)).toBeFalse();
        expect(v).toBeGE(0);
        expect(v).toBeLE(100);
      }
      for (const k of LOVE_KEYS) {
        const v = love.normalized[k];
        expect(Number.isNaN(v)).toBeFalse();
        expect(v).toBeGE(0);
        expect(v).toBeLE(100);
      }
    }
  });

  it('동일 답변 → 동일 결과 (결정론)', () => {
    const a = seededAnswers(42);
    expect(JSON.stringify(calculateAllScores(a))).toBe(JSON.stringify(calculateAllScores(a)));
  });

  it('정규화 공식 검증: raw=min→0, raw=max→100, 중간→비례', () => {
    const ranges = buildDimensionRanges(CORE_KEYS);
    const k = 'intimacy' as const;
    const lo = ranges.minRaw[k];
    const hi = ranges.maxRaw[k];
    const mid = (lo + hi) / 2;
    const n0 = normalizeDimensions(CORE_KEYS, { ...zero(), [k]: lo } as any, ranges);
    const n1 = normalizeDimensions(CORE_KEYS, { ...zero(), [k]: hi } as any, ranges);
    const nm = normalizeDimensions(CORE_KEYS, { ...zero(), [k]: mid } as any, ranges);
    expect(n0[k]).toBeCloseTo(0);
    expect(n1[k]).toBeCloseTo(100);
    expect(nm[k]).toBeCloseTo(50, 1e-6);
  });

  it('LOVE 는 give5/receive5 합계 100 강제 없음 (동시 고득점 가능)', () => {
    // 모든 love give 계열이 최대가 되는 답 조합이 존재하는지까지는 데이터 의존이므로,
    // 여기서는 "합계가 100으로 정규화되지 않는다"는 구조를 확인:
    // 각 love dimension 은 자기 min/max 로 독립 정규화되므로 합이 100 고정일 수 없다.
    const { love } = calculateAllScores(answersAll('A'));
    const giveSum = ['giveWords', 'giveTime', 'giveTouch', 'giveGift', 'giveHelp'].reduce(
      (s, k) => s + (love.normalized as any)[k],
      0,
    );
    // 합이 정확히 100일 확률은 사실상 0 — 독립축임을 보이는 회귀 지표
    expect(giveSum !== 100).toBeTrue();
  });

  it('CORE 와 LOVE 는 같은 generic 정규화기를 쓰지만 서로 영향 없음', () => {
    // calculateCoreScores 는 CORE_KEYS 만, calculateLoveScores 는 LOVE_KEYS 만 담는다.
    const core = calculateCoreScores(answersAll('A'));
    const love = calculateLoveScores(answersAll('A'));
    expect(Object.keys(core.normalized).sort().join(',')).toBe([...CORE_KEYS].sort().join(','));
    expect(Object.keys(love.normalized).sort().join(',')).toBe([...LOVE_KEYS].sort().join(','));
  });

  it('답변 개수 != 45 → throw', () => {
    expect(() => calculateAllScores([{ questionId: 'ME_Q01', optionId: 'A' }])).toThrow();
  });
});

function zero(): Record<string, number> {
  const o: Record<string, number> = {};
  for (const k of CORE_KEYS) o[k] = 0;
  return o;
}
