// OTHER("나는 조금 달라요") 자유입력 분류기
//
// 역할 분리 원칙:
//  - AI 는 "분류기 + 설명 태거" 일 뿐, 최종 0~100 점수/캐릭터/순위를 만들지 않는다.
//  - AI 는 optionSimilarity(A/B/C/D 유사도) + dimensionAdjustments(미세조정) + tags 만 반환.
//  - 최종 문항점수는 코드가 계산한다: A/B/C/D 점수를 similarity 로 가중평균 + adjustment.
//
// 이 파일:
//  1) adapter 인터페이스 (실제 AI 는 나중에 교체)
//  2) mock adapter (규칙기반, MVP 용)
//  3) 결과 schema validation (allowedDimensions/범위/합계 위반 reject)
//  4) confidence 분기 (>=.60 / .40~.59 / <.40)
//  5) 최종 문항 점수 산출 (-3~+3 clamp)

import { clamp } from '@/lib/scoring';
import {
  isDimensionKey,
  type DimensionKey,
  type MeQuestion,
  type OptionId,
  type OtherClassifierResult,
  type ScoreObject,
} from '@/lib/types';

const OPTION_IDS: OptionId[] = ['A', 'B', 'C', 'D'];
const SIM_SUM_EPSILON = 1e-6;
const ADJ_MIN = -0.5;
const ADJ_MAX = 0.5;
const QSCORE_MIN = -3;
const QSCORE_MAX = 3;
const CONF_FULL = 0.6; // 이상: 점수 + adjustment
const CONF_PARTIAL = 0.4; // 이상 CONF_FULL 미만: 가중평균만
// 미만 CONF_PARTIAL: 보류 + 보조질문

// ---- adapter 인터페이스 ----
export interface OtherClassifierInput {
  question: string;
  options: Record<OptionId, string>;
  allowedDimensions: DimensionKey[];
  userAnswer: string;
}
export type OtherClassifierAdapter = (
  input: OtherClassifierInput,
) => Promise<OtherClassifierResult>;

export class OtherValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OtherValidationError';
  }
}

// ---------------------------------------------------------------------------
// 1) 결과 validation — 위반 시 OtherValidationError throw (reject)
// ---------------------------------------------------------------------------
export function validateOtherResult(
  result: OtherClassifierResult,
  allowedDimensions: readonly DimensionKey[],
): void {
  const allowed = new Set<string>(allowedDimensions);

  // optionSimilarity: 키 A/B/C/D 존재, 각 0~1, 합계 1
  const sim = result.optionSimilarity;
  if (!sim) throw new OtherValidationError('optionSimilarity 누락');
  let sum = 0;
  for (const id of OPTION_IDS) {
    const v = sim[id];
    if (typeof v !== 'number' || Number.isNaN(v)) {
      throw new OtherValidationError(`optionSimilarity.${id} 가 숫자가 아님`);
    }
    if (v < 0 || v > 1) {
      throw new OtherValidationError(`optionSimilarity.${id}=${v} 는 0~1 범위를 벗어남`);
    }
    sum += v;
  }
  if (Math.abs(sum - 1) > SIM_SUM_EPSILON) {
    throw new OtherValidationError(`optionSimilarity 합계=${sum} (1 이어야 함)`);
  }

  // dimensionAdjustments: allowedDimensions 안의 키만, 각 -0.5~+0.5
  for (const [k, v] of Object.entries(result.dimensionAdjustments ?? {})) {
    if (!isDimensionKey(k)) {
      throw new OtherValidationError(`dimensionAdjustments 키 '${k}' 는 유효 dimension 아님`);
    }
    if (!allowed.has(k)) {
      throw new OtherValidationError(
        `dimensionAdjustments 키 '${k}' 는 이 문항 allowedDimensions 밖`,
      );
    }
    if (typeof v !== 'number' || Number.isNaN(v)) {
      throw new OtherValidationError(`dimensionAdjustments.${k} 가 숫자가 아님`);
    }
    if (v < ADJ_MIN || v > ADJ_MAX) {
      throw new OtherValidationError(
        `dimensionAdjustments.${k}=${v} 는 ${ADJ_MIN}~${ADJ_MAX} 범위를 벗어남`,
      );
    }
  }

  // tags: 0~4개
  const tags = result.tags ?? [];
  if (!Array.isArray(tags) || tags.length > 4) {
    throw new OtherValidationError(`tags 는 0~4개여야 함 (현재 ${tags.length})`);
  }

  // confidence: 0~1
  if (
    typeof result.confidence !== 'number' ||
    Number.isNaN(result.confidence) ||
    result.confidence < 0 ||
    result.confidence > 1
  ) {
    throw new OtherValidationError(`confidence=${result.confidence} 는 0~1 이어야 함`);
  }
}

// ---------------------------------------------------------------------------
// 2) 가중평균 기본점수 (A/B/C/D score 를 optionSimilarity 로 가중)
// ---------------------------------------------------------------------------
export function weightedOptionScore(
  question: MeQuestion,
  sim: Record<OptionId, number>,
): ScoreObject {
  const out: Record<string, number> = {};
  for (const opt of question.options) {
    const w = sim[opt.id] ?? 0;
    for (const [k, v] of Object.entries(opt.score)) {
      out[k] = (out[k] ?? 0) + (v as number) * w;
    }
  }
  return out as ScoreObject;
}

// ---------------------------------------------------------------------------
// 3) confidence 분기 결과
// ---------------------------------------------------------------------------
export type OtherOutcome =
  | {
      status: 'scored';
      otherScore: ScoreObject; // 문항 단위 점수 (-3~+3 clamp)
      tags: string[]; // 설명용 (점수 미반영)
      confidence: number;
      appliedAdjustment: boolean;
      shortReason: string;
    }
  | {
      status: 'needs_followup'; // confidence < .40 → A/B/C/D 재질문
      confidence: number;
      shortReason: string;
    };

// 최종 문항 점수 산출 (validation 통과 후 호출)
export function computeOtherQuestionScore(
  question: MeQuestion,
  result: OtherClassifierResult,
): OtherOutcome {
  const { confidence } = result;

  if (confidence < CONF_PARTIAL) {
    return {
      status: 'needs_followup',
      confidence,
      shortReason: result.shortReason,
    };
  }

  const base = weightedOptionScore(question, result.optionSimilarity) as Record<string, number>;
  const applyAdjustment = confidence >= CONF_FULL;

  if (applyAdjustment) {
    for (const [k, v] of Object.entries(result.dimensionAdjustments ?? {})) {
      base[k] = (base[k] ?? 0) + (v as number);
    }
  }

  // 문항 단위 score 는 -3 ~ +3 clamp
  const otherScore: Record<string, number> = {};
  for (const [k, v] of Object.entries(base)) {
    otherScore[k] = clamp(v, QSCORE_MIN, QSCORE_MAX);
  }

  return {
    status: 'scored',
    otherScore: otherScore as ScoreObject,
    tags: result.tags ?? [],
    confidence,
    appliedAdjustment: applyAdjustment,
    shortReason: result.shortReason,
  };
}

// ---------------------------------------------------------------------------
// 4) 오케스트레이터: adapter 호출 → validate → 점수 산출
// ---------------------------------------------------------------------------
export async function classifyOther(
  question: MeQuestion,
  userAnswer: string,
  adapter: OtherClassifierAdapter = mockOtherClassifier,
): Promise<OtherOutcome> {
  const input: OtherClassifierInput = {
    question: question.prompt,
    options: {
      A: question.options.find((o) => o.id === 'A')!.text,
      B: question.options.find((o) => o.id === 'B')!.text,
      C: question.options.find((o) => o.id === 'C')!.text,
      D: question.options.find((o) => o.id === 'D')!.text,
    },
    allowedDimensions: question.other.allowedDimensions,
    userAnswer,
  };

  const result = await adapter(input);
  validateOtherResult(result, question.other.allowedDimensions); // 위반 시 throw
  return computeOtherQuestionScore(question, result);
}

// ---------------------------------------------------------------------------
// 5) MOCK adapter (MVP) — 실제 AI 없이도 동작
//    규칙: userAnswer 와 각 옵션 text 의 토큰 겹침으로 유사도 근사 → 정규화(합=1).
//    adjustment 는 만들지 않음(안전). confidence 는 최고 유사도 분리도로 근사.
//    실제 AI adapter 로 언제든 교체 가능(같은 시그니처).
// ---------------------------------------------------------------------------
export const mockOtherClassifier: OtherClassifierAdapter = async (input) => {
  const tokenize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter((t) => t.length >= 2);

  const ans = new Set(tokenize(input.userAnswer));
  const rawScores: Record<OptionId, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const id of OPTION_IDS) {
    const optTokens = tokenize(input.options[id]);
    let overlap = 0;
    for (const t of optTokens) if (ans.has(t)) overlap++;
    // Jaccard 유사 근사 + 최소값으로 0 분모 방지
    const denom = new Set([...optTokens, ...ans]).size || 1;
    rawScores[id] = overlap / denom;
  }

  let total = OPTION_IDS.reduce((s, id) => s + rawScores[id], 0);
  const optionSimilarity: Record<OptionId, number> = { A: 0, B: 0, C: 0, D: 0 };
  if (total <= 0) {
    // 겹치는 토큰이 전혀 없으면 균등 분배 + 낮은 confidence
    for (const id of OPTION_IDS) optionSimilarity[id] = 0.25;
    return {
      optionSimilarity,
      dimensionAdjustments: {},
      tags: [],
      confidence: 0.3, // < .40 → 보조질문 유도
      shortReason: '자유서술과 선택지 간 유사 신호가 약해 판단이 어려움.',
    };
  }
  for (const id of OPTION_IDS) optionSimilarity[id] = rawScores[id] / total;

  // 정확히 합 1 로 보정 (부동소수 잔차 제거)
  const drift = 1 - OPTION_IDS.reduce((s, id) => s + optionSimilarity[id], 0);
  optionSimilarity.A += drift;

  // confidence: 1위와 2위 유사도 격차로 근사 (분리도가 크면 확신 ↑)
  const sorted = OPTION_IDS.map((id) => optionSimilarity[id]).sort((a, b) => b - a);
  const separation = sorted[0] - sorted[1];
  const confidence = clamp(0.45 + separation * 1.2, 0, 0.95);

  return {
    optionSimilarity,
    dimensionAdjustments: {}, // mock 은 미세조정 안 함 (안전)
    tags: [],
    confidence,
    shortReason: 'mock 분류기: 자유서술 토큰과 선택지 텍스트 유사도로 근사.',
  };
};
