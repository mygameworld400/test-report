// §11 결과 Rule Engine 검증
import { describe, it, expect } from './_harness';
import { CORE_KEYS } from '@/data/coreDimensions';
import {
  bandOf,
  dimensionText,
  DIMENSION_BANDS,
  INSIGHT_RULES,
  evaluateInsights,
  selectSignatureDimensions,
  personalizeWithTags,
  buildFreePreview,
} from '@/lib/resultInsights';
import { classifyCharacter } from '@/lib/characterClassifier';
import { CHARACTER_CENTROIDS } from '@/data/characterCentroids';
import { CHARACTER_META } from '@/lib/characterMeta';
import type { CoreKey, NormalizedScores } from '@/lib/types';

function scores(partial: Partial<Record<CoreKey, number>>): NormalizedScores<CoreKey> {
  const s = {} as NormalizedScores<CoreKey>;
  for (const k of CORE_KEYS) s[k] = partial[k] ?? 50;
  return s;
}

describe('Rule Engine (§11)', () => {
  it('bandOf 경계값', () => {
    expect(bandOf(0)).toBe(0);
    expect(bandOf(20)).toBe(0);
    expect(bandOf(21)).toBe(1);
    expect(bandOf(60)).toBe(2);
    expect(bandOf(61)).toBe(3);
    expect(bandOf(100)).toBe(4);
  });

  it('18지표 × 5구간 문구 전부 존재 & 비어있지 않음', () => {
    for (const k of CORE_KEYS) {
      const bands = DIMENSION_BANDS[k];
      expect(bands.length).toBe(5);
      for (let b = 0; b < 5; b++) expect(bands[b].trim().length > 0).toBeTrue();
    }
  });

  it('dimensionText 는 구간에 맞는 문구 반환', () => {
    expect(dimensionText('intimacy', 90)).toBe(DIMENSION_BANDS.intimacy[4]);
    expect(dimensionText('intimacy', 10)).toBe(DIMENSION_BANDS.intimacy[0]);
  });

  it('필수 조합 rule 5종이 정확히 발화', () => {
    // 친밀 HIGH + 개인공간 HIGH
    expect(evaluateInsights(scores({ intimacy: 90, personalSpace: 85 })).some((r) => r.id === 'intimacy_space')).toBeTrue();
    // 확신 HIGH + 감정표현 LOW
    expect(evaluateInsights(scores({ reassurance: 85, emotionExpression: 20 })).some((r) => r.id === 'reassure_lowexpress')).toBeTrue();
    // 갈등직면 HIGH + 냉각시간 HIGH
    expect(evaluateInsights(scores({ conflictDirect: 90, cooldown: 80 })).some((r) => r.id === 'conflict_cooldown')).toBeTrue();
    // 해결책 HIGH + 공감 LOW
    expect(evaluateInsights(scores({ solution: 90, empathy: 25 })).some((r) => r.id === 'solution_lowempathy')).toBeTrue();
    // 신뢰개방 LOW + 관계회복 HIGH
    expect(evaluateInsights(scores({ trustOpen: 20, repair: 85 })).some((r) => r.id === 'lowtrust_repair')).toBeTrue();
  });

  it('중립(50) 점수면 극단 rule 은 발화하지 않음', () => {
    expect(evaluateInsights(scores({})).length).toBe(0);
  });

  it('대표수치 3개: 높은 것만 뽑지 않고 대비 포함', () => {
    // 강한 고점(solution 93) + 강한 저점(reassurance 12) 존재
    const s = scores({ solution: 93, personalSpace: 82, reassurance: 12, empathy: 45 });
    const sig = selectSignatureDimensions(s, 3);
    expect(sig.length).toBe(3);
    // 저점이 하나 이상 포함되어야 (모두 high 아님)
    expect(sig.some((d) => d.direction === 'low')).toBeTrue();
    expect(sig.some((d) => d.direction === 'high')).toBeTrue();
  });

  it('대표수치 선별은 결정론적', () => {
    const s = scores({ solution: 93, reassurance: 12, boundary: 88, empathy: 30 });
    expect(JSON.stringify(selectSignatureDimensions(s))).toBe(
      JSON.stringify(selectSignatureDimensions(s)),
    );
  });

  it('tags 없으면 문장 불변, 있으면 개인화 (수치 언급 아님)', () => {
    expect(personalizeWithTags('기본 문장')).toBe('기본 문장');
    const p = personalizeWithTags('기본 문장', ['필요한 확인만 함']);
    expect(p.includes('기본 문장')).toBeTrue();
    expect(p.includes('필요한 확인만 함')).toBeTrue();
  });

  it('buildFreePreview: 구조 완비 + 잠금 10섹션', () => {
    const char = classifyCharacter(
      (() => {
        const s = {} as NormalizedScores<CoreKey>;
        CORE_KEYS.forEach((k, i) => (s[k] = CHARACTER_CENTROIDS.fox.vector[i]));
        return s;
      })(),
    );
    const s = scores({ solution: 90, reassurance: 20, boundary: 85 });
    const preview = buildFreePreview(char, s, CHARACTER_META[char.primary.key as keyof typeof CHARACTER_META].tagline);
    expect(preview.signatureDims.length).toBe(3);
    expect(preview.lockedTitles.length).toBe(10);
    expect(preview.oneLiner.length > 0).toBeTrue();
  });

  it('CHARACTER_META 12종 완비 + centroid 키와 일치', () => {
    const metaKeys = Object.keys(CHARACTER_META).sort().join(',');
    const centKeys = Object.keys(CHARACTER_CENTROIDS).sort().join(',');
    expect(metaKeys).toBe(centKeys);
    for (const m of Object.values(CHARACTER_META)) {
      expect(m.nameKo.length > 0).toBeTrue();
      expect(m.tagline.length > 0).toBeTrue();
      expect(m.strengths.length >= 2).toBeTrue();
    }
  });
});
