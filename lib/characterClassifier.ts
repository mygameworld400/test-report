// 캐릭터 판정기
//  - 사용자 CORE 18차원 벡터 ↔ 12 centroid 의 RMS distance
//  - distance 오름차순 → primary / secondary / 전체 ranking / blendStrength
//  - LOVE 10개는 절대 사용하지 않는다 (CORE_KEYS 만 순회 → 구조적으로 차단).
//  - 특정 답변 하나로 캐릭터를 결정하지 않는다 (연속형 벡터 거리 기반).

import { CORE_KEYS } from '@/data/coreDimensions';
import { CHARACTER_CENTROIDS } from '@/data/characterCentroids';
import type {
  BlendStrength,
  CharacterKey,
  CharacterRankEntry,
  CharacterResult,
  CoreKey,
  NormalizedScores,
} from '@/lib/types';

// centroid 와의 RMS(root-mean-square) distance
export function rmsDistance(a: readonly number[], b: readonly number[]): number {
  if (a.length !== b.length) {
    throw new Error(`vector length mismatch: ${a.length} vs ${b.length}`);
  }
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum / a.length);
}

// 표시용 상대 유사도 (심리학적 정확도가 아니라 centroid 근접도)
export function distanceToDisplaySimilarity(distance: number): number {
  return Math.max(0, Math.min(100, 100 - distance));
}

function blendFromGap(gap: number): BlendStrength {
  if (gap < 2) return 'very_mixed';
  if (gap < 5) return 'mixed';
  if (gap < 9) return 'moderately_clear';
  return 'clear';
}

// CORE 정규화 점수 → 캐릭터 판정
export function classifyCharacter(coreNormalized: NormalizedScores<CoreKey>): CharacterResult {
  // CORE_KEYS 순서로만 벡터 구성 (LOVE 는 구조적으로 들어올 수 없음)
  const userVector = CORE_KEYS.map((k) => coreNormalized[k]);

  const ranking: CharacterRankEntry[] = (
    Object.entries(CHARACTER_CENTROIDS) as [CharacterKey, { label: string; vector: number[] }][]
  )
    .map(([key, character]) => {
      const distance = rmsDistance(userVector, character.vector);
      return {
        key,
        label: character.label,
        distance,
        similarity: distanceToDisplaySimilarity(distance),
      };
    })
    .sort((a, b) => a.distance - b.distance);

  const primary = ranking[0];
  const secondary = ranking[1];
  const gap = secondary.distance - primary.distance;

  return {
    primary,
    secondary,
    blendStrength: blendFromGap(gap),
    ranking,
  };
}
