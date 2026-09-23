// ME 공용 타입 / 스키마
// CORE 18 + LOVE 10 을 모두 "dimension" 이라는 하나의 개념으로 취급해
// 같은 generic normalization 로직을 재사용할 수 있게 한다.
// (단, 캐릭터 판정에는 CORE 18개만 사용 — characterClassifier에서 강제)

import { CORE_DIMENSIONS, CORE_KEYS } from '@/data/coreDimensions';
import { LOVE_DIMENSIONS, LOVE_KEYS } from '@/data/loveDimensions';

// ---- dimension key 타입 ----
export type CoreKey = (typeof CORE_KEYS)[number];
export type LoveKey = (typeof LOVE_KEYS)[number];

// 한 선택지 score / OTHER allowedDimensions 는 CORE·LOVE 를 함께 담을 수 있다.
export type DimensionKey = CoreKey | LoveKey;

// dimension 이름 룩업 (CORE + LOVE 합침)
export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  ...CORE_DIMENSIONS,
  ...LOVE_DIMENSIONS,
};

// 전체 dimension 키 집합 (validation 용)
export const ALL_DIMENSION_KEYS: DimensionKey[] = [...CORE_KEYS, ...LOVE_KEYS];
const CORE_KEY_SET = new Set<string>(CORE_KEYS);
const LOVE_KEY_SET = new Set<string>(LOVE_KEYS);
const ALL_KEY_SET = new Set<string>(ALL_DIMENSION_KEYS);

export function isCoreKey(k: string): k is CoreKey {
  return CORE_KEY_SET.has(k);
}
export function isLoveKey(k: string): k is LoveKey {
  return LOVE_KEY_SET.has(k);
}
export function isDimensionKey(k: string): k is DimensionKey {
  return ALL_KEY_SET.has(k);
}

// ---- 점수 오브젝트 ----
// 선택지 하나가 여러 dimension(CORE+LOVE 혼합)에 -3~+3 상대가중치를 준다.
export type ScoreObject = Partial<Record<DimensionKey, number>>;

// ---- 질문 스키마 ----
export type OptionId = 'A' | 'B' | 'C' | 'D';

export interface QuestionOption {
  id: OptionId;
  text: string;
  score: ScoreObject;
}

export interface OtherConfig {
  enabled: boolean;
  // OTHER 자유입력에서 AI adjustment 가 허용되는 dimension (CORE+LOVE 혼합 가능)
  allowedDimensions: DimensionKey[];
}

export interface MeQuestion {
  id: string;
  category: string;
  prompt: string;
  options: QuestionOption[];
  other: OtherConfig;
}

// ---- 사용자 답변 ----
// 두 종류의 자유입력을 데이터 구조에서 분리한다:
//  1) reasonText/reasonTags : A/B/C/D 선택 후 "이유 추가" — 점수 불변, 설명 개인화용
//  2) otherScore            : "나는 조금 달라요"(OTHER) — 점수 계산에 반영
export interface AnswerInput {
  questionId: string;
  optionId?: OptionId; // A/B/C/D 를 골랐을 때
  otherScore?: ScoreObject; // OTHER classifier 결과로부터 산출된 문항 점수
  reasonText?: string; // "이유 추가" 원문 (점수 영향 없음)
  reasonTags?: string[]; // 이유에서 추출한 설명용 태그 (점수 영향 없음)
  isOther?: boolean; // OTHER 경로로 답했는지 (UI/디버그 구분)
}

// ---- OTHER classifier (AI adapter) 반환 스키마 ----
// AI 는 최종 0~100 점수/캐릭터/순위를 만들지 않는다. 분류기 + 태거 역할만 한다.
export interface OtherClassifierResult {
  optionSimilarity: Record<OptionId, number>; // 합계 1, 각 0~1
  dimensionAdjustments: Partial<Record<DimensionKey, number>>; // allowedDimensions 내, 각 -0.5~+0.5
  tags: string[]; // 0~4개, 점수 계산에 미사용
  confidence: number; // 0~1
  shortReason: string;
}

// ---- 정규화 결과 ----
export type NormalizedScores<K extends string = DimensionKey> = Record<K, number>;

export interface DimensionRanges<K extends string = DimensionKey> {
  minRaw: Record<K, number>;
  maxRaw: Record<K, number>;
}

// ---- 캐릭터 판정 결과 ----
export type CharacterKey =
  | 'fox'
  | 'dog'
  | 'cat'
  | 'rabbit'
  | 'otter'
  | 'hedgehog'
  | 'wolf'
  | 'tiger'
  | 'panda'
  | 'swan'
  | 'dolphin'
  | 'owl';

export interface CharacterRankEntry {
  key: CharacterKey;
  label: string;
  distance: number;
  similarity: number; // 표시용 상대 유사도 (0~100)
}

export type BlendStrength = 'very_mixed' | 'mixed' | 'moderately_clear' | 'clear';

export interface CharacterResult {
  primary: CharacterRankEntry;
  secondary: CharacterRankEntry;
  blendStrength: BlendStrength;
  ranking: CharacterRankEntry[];
}
