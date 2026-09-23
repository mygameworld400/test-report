// 점수 계산 엔진
// 핵심 원칙:
//  - score(-3~+3 상대가중치) 합산 → raw
//  - dimension별 minPossible/maxPossible 을 질문은행에서 자동 계산
//  - normalized = ((raw - minPossible) / (maxPossible - minPossible)) * 100, 0~100 clamp
//  - "50 + delta" 방식 금지, 동일 답변 → 동일 결과 (결정론적)
//  - CORE 18 과 LOVE 10 은 "같은 generic normalization 함수"를 재사용해 각각 독립 계산
//    (주는5끼리/받는5끼리 합계 100으로 만들지 않음 — 완전 독립축)

import { ME_QUESTIONS } from '@/data/meQuestions';
import { CORE_KEYS } from '@/data/coreDimensions';
import { LOVE_KEYS } from '@/data/loveDimensions';
import type {
  AnswerInput,
  DimensionKey,
  DimensionRanges,
  MeQuestion,
  NormalizedScores,
  ScoreObject,
} from '@/lib/types';

// 한 답변에서 문항 점수 오브젝트를 얻는다.
// OTHER("나는 조금 달라요")면 otherScore 를 사용, 아니면 선택지 score.
export function getScoreForAnswer(question: MeQuestion, answer: AnswerInput): ScoreObject {
  if (answer.otherScore) return answer.otherScore;
  const option = question.options.find((o) => o.id === answer.optionId);
  if (!option) throw new Error(`Invalid answer for ${question.id}: optionId=${answer.optionId}`);
  return option.score ?? {};
}

// ---------------------------------------------------------------------------
// GENERIC NORMALIZATION — CORE / LOVE / (미래 다른 축) 모두 이 함수로 처리
// ---------------------------------------------------------------------------

// 주어진 key 집합에 대해 질문은행에서 가능한 min/max raw 를 자동 계산.
// 각 문항은 그 문항 옵션들 중 해당 key 의 min/max 를 더한다.
export function buildDimensionRanges<K extends DimensionKey>(
  keys: readonly K[],
  questions: readonly MeQuestion[] = ME_QUESTIONS,
): DimensionRanges<K> {
  const minRaw = {} as Record<K, number>;
  const maxRaw = {} as Record<K, number>;
  for (const k of keys) {
    minRaw[k] = 0;
    maxRaw[k] = 0;
  }
  for (const q of questions) {
    for (const k of keys) {
      const vals = q.options.map((o) => Number((o.score as Record<string, number>)[k] ?? 0));
      minRaw[k] += Math.min(...vals);
      maxRaw[k] += Math.max(...vals);
    }
  }
  return { minRaw, maxRaw };
}

// 답변들로부터 주어진 key 집합의 raw 합계를 계산.
export function accumulateRaw<K extends DimensionKey>(
  keys: readonly K[],
  answers: readonly AnswerInput[],
  questions: readonly MeQuestion[] = ME_QUESTIONS,
): Record<K, number> {
  const raw = {} as Record<K, number>;
  for (const k of keys) raw[k] = 0;

  for (const answer of answers) {
    const q = questions.find((x) => x.id === answer.questionId);
    if (!q) throw new Error(`Unknown question: ${answer.questionId}`);
    const score = getScoreForAnswer(q, answer);
    for (const k of keys) raw[k] += Number((score as Record<string, number>)[k] ?? 0);
  }
  return raw;
}

// 하나의 generic 정규화기: raw + ranges → 0~100
export function normalizeDimensions<K extends DimensionKey>(
  keys: readonly K[],
  raw: Record<K, number>,
  ranges: DimensionRanges<K>,
): NormalizedScores<K> {
  const normalized = {} as NormalizedScores<K>;
  for (const k of keys) {
    const lo = ranges.minRaw[k];
    const hi = ranges.maxRaw[k];
    // 이론상 lo===hi 는 그 축이 측정되지 않은 경우뿐 (데이터 validation 에서 배제됨).
    const value = hi === lo ? 50 : ((raw[k] - lo) / (hi - lo)) * 100;
    normalized[k] = clamp(value, 0, 100);
  }
  return normalized;
}

// key 집합 하나에 대한 raw + normalized 를 한 번에.
export function computeDimensionScores<K extends DimensionKey>(
  keys: readonly K[],
  answers: readonly AnswerInput[],
  questions: readonly MeQuestion[] = ME_QUESTIONS,
): { raw: Record<K, number>; normalized: NormalizedScores<K> } {
  const ranges = buildDimensionRanges(keys, questions);
  const raw = accumulateRaw(keys, answers, questions);
  const normalized = normalizeDimensions(keys, raw, ranges);
  return { raw, normalized };
}

// ---------------------------------------------------------------------------
// CORE / LOVE 공개 API (둘 다 위 generic 을 재사용)
// ---------------------------------------------------------------------------

export function calculateCoreScores(
  answers: readonly AnswerInput[],
  questions: readonly MeQuestion[] = ME_QUESTIONS,
) {
  return computeDimensionScores(CORE_KEYS, answers, questions);
}

export function calculateLoveScores(
  answers: readonly AnswerInput[],
  questions: readonly MeQuestion[] = ME_QUESTIONS,
) {
  return computeDimensionScores(LOVE_KEYS, answers, questions);
}

// 전체 답변 → CORE + LOVE 점수 (답변 개수 검사 포함)
export function calculateAllScores(
  answers: readonly AnswerInput[],
  questions: readonly MeQuestion[] = ME_QUESTIONS,
) {
  if (answers.length !== questions.length) {
    throw new Error(`Expected ${questions.length} answers, got ${answers.length}`);
  }
  return {
    core: calculateCoreScores(answers, questions),
    love: calculateLoveScores(answers, questions),
  };
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
