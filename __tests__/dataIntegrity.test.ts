// §15 데이터 계층 검증
import { describe, it, expect } from './_harness';
import { ME_QUESTIONS } from '@/data/meQuestions';
import { CORE_KEYS } from '@/data/coreDimensions';
import { LOVE_KEYS } from '@/data/loveDimensions';
import { CHARACTER_CENTROIDS } from '@/data/characterCentroids';
import { isDimensionKey, ALL_DIMENSION_KEYS } from '@/lib/types';
import { buildDimensionRanges } from '@/lib/scoring';

describe('데이터 무결성 (§15)', () => {
  it('질문 45개', () => {
    expect(ME_QUESTIONS.length).toBe(45);
  });

  it('질문 id 중복 없음', () => {
    const ids = ME_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('모든 질문에 A/B/C/D 존재', () => {
    for (const q of ME_QUESTIONS) {
      expect(q.options.map((o) => o.id).sort().join('')).toBe('ABCD');
    }
  });

  it('옵션 text 비어있지 않음', () => {
    for (const q of ME_QUESTIONS)
      for (const o of q.options) expect(o.text.trim().length > 0).toBeTrue();
  });

  it('score key 전부 유효 dimension', () => {
    for (const q of ME_QUESTIONS)
      for (const o of q.options)
        for (const k of Object.keys(o.score)) expect(isDimensionKey(k)).toBeTrue();
  });

  it('score 값 -3~+3 정수', () => {
    for (const q of ME_QUESTIONS)
      for (const o of q.options)
        for (const v of Object.values(o.score)) {
          expect(Number.isInteger(v)).toBeTrue();
          expect(v as number).toBeGE(-3);
          expect(v as number).toBeLE(3);
        }
  });

  it('OTHER allowedDimensions 유효 & enabled & 비어있지 않음', () => {
    for (const q of ME_QUESTIONS) {
      expect(q.other.enabled).toBeTrue();
      expect(q.other.allowedDimensions.length > 0).toBeTrue();
      for (const k of q.other.allowedDimensions) expect(isDimensionKey(k)).toBeTrue();
    }
  });

  it('CORE 18개 모두 실제 측정됨', () => {
    const measured = new Set<string>();
    for (const q of ME_QUESTIONS)
      for (const o of q.options) for (const k of Object.keys(o.score)) measured.add(k);
    for (const k of CORE_KEYS) expect(measured.has(k)).toBeTrue();
  });

  it('LOVE 10개 모두 실제 측정됨', () => {
    const measured = new Set<string>();
    for (const q of ME_QUESTIONS)
      for (const o of q.options) for (const k of Object.keys(o.score)) measured.add(k);
    for (const k of LOVE_KEYS) expect(measured.has(k)).toBeTrue();
  });

  it('모든 dimension minPossible < maxPossible', () => {
    const ranges = buildDimensionRanges(ALL_DIMENSION_KEYS);
    for (const k of ALL_DIMENSION_KEYS)
      expect(ranges.minRaw[k] < ranges.maxRaw[k]).toBeTrue();
  });

  it('centroid 12종 · 벡터 18 · 값 0~100', () => {
    const entries = Object.values(CHARACTER_CENTROIDS);
    expect(entries.length).toBe(12);
    for (const c of entries) {
      expect(c.vector.length).toBe(18);
      for (const v of c.vector) {
        expect(v).toBeGE(0);
        expect(v).toBeLE(100);
      }
    }
  });
});
