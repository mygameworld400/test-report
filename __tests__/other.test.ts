// §15 OTHER classifier 검증
import { describe, it, expect } from './_harness';
import { ME_QUESTIONS } from '@/data/meQuestions';
import {
  validateOtherResult,
  computeOtherQuestionScore,
  weightedOptionScore,
  classifyOther,
  mockOtherClassifier,
  OtherValidationError,
} from '@/lib/otherAnswerClassifier';
import type { MeQuestion, OtherClassifierResult } from '@/lib/types';

const Q06 = ME_QUESTIONS.find((q) => q.id === 'ME_Q06') as MeQuestion;
// Q06 allowedDimensions: contact,reassurance,personalSpace,trustOpen,conflictDirect,emotionExpression,boundary

const valid = (over: Partial<OtherClassifierResult> = {}): OtherClassifierResult => ({
  optionSimilarity: { A: 0.25, B: 0.25, C: 0.25, D: 0.25 },
  dimensionAdjustments: {},
  tags: [],
  confidence: 0.8,
  shortReason: 'ok',
  ...over,
});

describe('OTHER classifier (§15)', () => {
  it('유효 결과는 통과 (throw 안 함)', () => {
    // throw 하면 테스트 실패, 통과하면 성공
    validateOtherResult(valid(), Q06.other.allowedDimensions);
    validateOtherResult(valid({ tags: ['a', 'b'], dimensionAdjustments: { contact: 0.3 } }), Q06.other.allowedDimensions);
  });

  it('optionSimilarity 합계 = 1 강제 (아니면 reject)', () => {
    expect(() =>
      validateOtherResult(
        valid({ optionSimilarity: { A: 0.5, B: 0.3, C: 0.1, D: 0.2 } }),
        Q06.other.allowedDimensions,
      ),
    ).toThrow(OtherValidationError);
    // 정확히 1 은 통과
    validateOtherResult(
      valid({ optionSimilarity: { A: 0.4, B: 0.3, C: 0.2, D: 0.1 } }),
      Q06.other.allowedDimensions,
    );
  });

  it('optionSimilarity 각 값 0~1 벗어나면 reject', () => {
    expect(() =>
      validateOtherResult(
        valid({ optionSimilarity: { A: 1.2, B: -0.2, C: 0, D: 0 } }),
        Q06.other.allowedDimensions,
      ),
    ).toThrow(OtherValidationError);
  });

  it('adjustment allowedDimensions 밖 키 → reject', () => {
    expect(() =>
      validateOtherResult(
        valid({ dimensionAdjustments: { future: 0.2 } }), // future 는 Q06 allowed 밖
        Q06.other.allowedDimensions,
      ),
    ).toThrow(OtherValidationError);
  });

  it('adjustment 범위 -0.5~+0.5 초과 → reject', () => {
    expect(() =>
      validateOtherResult(
        valid({ dimensionAdjustments: { contact: 0.9 } }),
        Q06.other.allowedDimensions,
      ),
    ).toThrow(OtherValidationError);
    expect(() =>
      validateOtherResult(
        valid({ dimensionAdjustments: { contact: -0.6 } }),
        Q06.other.allowedDimensions,
      ),
    ).toThrow(OtherValidationError);
  });

  it('tags 4개 초과 → reject', () => {
    expect(() =>
      validateOtherResult(valid({ tags: ['1', '2', '3', '4', '5'] }), Q06.other.allowedDimensions),
    ).toThrow(OtherValidationError);
  });

  it('confidence 0~1 벗어나면 reject', () => {
    expect(() =>
      validateOtherResult(valid({ confidence: 1.5 }), Q06.other.allowedDimensions),
    ).toThrow(OtherValidationError);
  });

  it('가중평균: 단일 옵션(sim B=1)이면 그 옵션 score 와 동일', () => {
    const ws = weightedOptionScore(Q06, { A: 0, B: 1, C: 0, D: 0 }) as Record<string, number>;
    const optB = Q06.options.find((o) => o.id === 'B')!.score as Record<string, number>;
    for (const k of Object.keys(optB)) expect(ws[k]).toBeCloseTo(optB[k]);
  });

  it('confidence >= .60 → adjustment 반영', () => {
    const out = computeOtherQuestionScore(
      Q06,
      valid({ optionSimilarity: { A: 0, B: 1, C: 0, D: 0 }, dimensionAdjustments: { contact: 0.5 }, confidence: 0.7 }),
    );
    if (out.status !== 'scored') throw new Error('expected scored');
    expect(out.appliedAdjustment).toBeTrue();
    expect((out.otherScore as any).contact).toBeCloseTo(1 + 0.5); // Q06.B.contact=1
  });

  it('confidence .40~.59 → adjustment 무시, 가중평균만', () => {
    const out = computeOtherQuestionScore(
      Q06,
      valid({ optionSimilarity: { A: 0, B: 1, C: 0, D: 0 }, dimensionAdjustments: { contact: 0.5 }, confidence: 0.5 }),
    );
    if (out.status !== 'scored') throw new Error('expected scored');
    expect(out.appliedAdjustment).toBeFalse();
    expect((out.otherScore as any).contact).toBeCloseTo(1); // adjustment 무시
  });

  it('confidence < .40 → needs_followup (점수 보류)', () => {
    const out = computeOtherQuestionScore(Q06, valid({ confidence: 0.3 }));
    expect(out.status).toBe('needs_followup');
  });

  it('문항 점수 -3~+3 clamp', () => {
    // sim C=1 (Q06.C: contact3,reassurance3) + contact +0.5 → 3.5 → clamp 3
    const out = computeOtherQuestionScore(
      Q06,
      valid({ optionSimilarity: { A: 0, B: 0, C: 1, D: 0 }, dimensionAdjustments: { contact: 0.5 }, confidence: 0.7 }),
    );
    if (out.status !== 'scored') throw new Error('expected scored');
    expect((out.otherScore as any).contact).toBeCloseTo(3); // 3.5 clamp
  });

  it('classifyOther(mock): 유사 문장 → scored, 무의미 → needs_followup', async () => {
    const high = await classifyOther(Q06, Q06.options[2].text, mockOtherClassifier);
    expect(high.status).toBe('scored');
    const low = await classifyOther(Q06, 'zzz qqq', mockOtherClassifier);
    expect(low.status).toBe('needs_followup');
  });

  it('classifyOther: adapter 가 잘못된 결과 주면 reject', async () => {
    const badAdapter = async () => valid({ optionSimilarity: { A: 0.9, B: 0.9, C: 0.9, D: 0.9 } });
    await expect(() => classifyOther(Q06, 'x', badAdapter)).toRejectValidation(OtherValidationError);
  });
});
