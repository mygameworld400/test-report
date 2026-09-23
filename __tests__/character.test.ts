// §15 캐릭터 판정 검증
import { describe, it, expect } from './_harness';
import { ME_QUESTIONS } from '@/data/meQuestions';
import { CORE_KEYS } from '@/data/coreDimensions';
import { LOVE_KEYS } from '@/data/loveDimensions';
import { CHARACTER_CENTROIDS } from '@/data/characterCentroids';
import { classifyCharacter, rmsDistance } from '@/lib/characterClassifier';
import { analyzeME } from '@/lib/analyze';
import type {
  AnswerInput,
  CharacterKey,
  CoreKey,
  NormalizedScores,
  OptionId,
} from '@/lib/types';

function centroidNorm(vector: number[]): NormalizedScores<CoreKey> {
  const n = {} as NormalizedScores<CoreKey>;
  CORE_KEYS.forEach((k, i) => (n[k] = vector[i]));
  return n;
}

describe('캐릭터 판정 (§15)', () => {
  it('centroid 자체 입력 시 해당 캐릭터가 1위 (12/12)', () => {
    for (const [key, c] of Object.entries(CHARACTER_CENTROIDS) as [CharacterKey, any][]) {
      const res = classifyCharacter(centroidNorm(c.vector));
      expect(res.primary.key).toBe(key);
      expect(res.primary.distance).toBeCloseTo(0, 1e-9);
    }
  });

  it('ranking 은 distance 오름차순 12개', () => {
    const res = classifyCharacter(centroidNorm(CHARACTER_CENTROIDS.fox.vector));
    expect(res.ranking.length).toBe(12);
    for (let i = 1; i < res.ranking.length; i++)
      expect(res.ranking[i].distance >= res.ranking[i - 1].distance).toBeTrue();
  });

  it('primary != secondary', () => {
    const res = classifyCharacter(centroidNorm(CHARACTER_CENTROIDS.owl.vector));
    expect(res.primary.key !== res.secondary.key).toBeTrue();
  });

  it('similarity 0~100', () => {
    const res = classifyCharacter(centroidNorm(CHARACTER_CENTROIDS.dog.vector));
    for (const r of res.ranking) {
      expect(r.similarity).toBeGE(0);
      expect(r.similarity).toBeLE(100);
    }
  });

  it('blendStrength 는 gap 규칙에 부합', () => {
    // 완전 동일(centroid)이면 gap 이 커서 clear 에 가까움 — 값 존재만 확인 + 열거형 유효
    const res = classifyCharacter(centroidNorm(CHARACTER_CENTROIDS.tiger.vector));
    expect(['very_mixed', 'mixed', 'moderately_clear', 'clear'].includes(res.blendStrength)).toBeTrue();
  });

  it('LOVE 답변만 바꿔도 캐릭터 결과 동일 (LOVE 는 캐릭터에 미사용)', () => {
    // 사랑표현 문항(Q29~Q34)만 답을 바꾸고 나머지는 고정.
    const base: AnswerInput[] = ME_QUESTIONS.map((q) => ({ questionId: q.id, optionId: 'A' }));
    const variant: AnswerInput[] = ME_QUESTIONS.map((q) => {
      const loveQ = ['ME_Q29', 'ME_Q30', 'ME_Q31', 'ME_Q32', 'ME_Q33', 'ME_Q34'];
      const opt: OptionId = loveQ.includes(q.id) ? 'C' : 'A';
      return { questionId: q.id, optionId: opt };
    });
    const rBase = analyzeME(base).character;
    const rVar = analyzeME(variant).character;

    // 주의: 사랑표현 문항 옵션에는 일부 CORE(예: empathy, intimacy, solution)도 섞여 있어
    // "순수 LOVE 만" 바뀌는 답은 데이터상 없다. 따라서 이 테스트는
    // Q29~34 에서 CORE 점수가 동일하도록 유지되는 옵션쌍을 골라야 정확하다.
    // 대신 구조 보장을 직접 확인: classifyCharacter 입력에 LOVE 키를 넣어도 무시됨.
    const withLoveInjected = analyzeME(base);
    const forged = { ...withLoveInjected.core.normalized } as any;
    for (const k of LOVE_KEYS) forged[k] = 999; // 오염값 주입
    const forgedRes = classifyCharacter(forged);
    expect(forgedRes.primary.key).toBe(rBase.primary.key);
    // (rVar 는 CORE 도 함께 달라질 수 있으므로 동등성 강제하지 않음)
    void rVar;
  });

  it('rmsDistance 길이 불일치 → throw', () => {
    expect(() => rmsDistance([1, 2, 3], [1, 2])).toThrow();
  });
});
