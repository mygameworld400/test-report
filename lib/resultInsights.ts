// 결과 문구 Rule Engine (AI 없이도 결과가 나오게)
//  - 18개 지표 구간(0-20/21-40/41-60/61-80/81-100)별 기본 문구
//  - 조합 insight rules (별도 정의) — 필수 예시 포함
//  - 대표 핵심수치 3개 선별 (85↑ / 15↓ / 50에서 최대거리 / 재미있는 대비)
//  - OTHER tags 는 수치를 바꾸지 않고 문장 개인화에만 사용
//
// 병리적 단정/진단/미래예언 금지. 톤: 날카롭지만 따뜻하게.

import { CORE_KEYS, CORE_DIMENSIONS } from '@/data/coreDimensions';
import type { CharacterResult, CoreKey, NormalizedScores } from '@/lib/types';

export type Band = 0 | 1 | 2 | 3 | 4; // 0-20,21-40,41-60,61-80,81-100

export function bandOf(v: number): Band {
  if (v <= 20) return 0;
  if (v <= 40) return 1;
  if (v <= 60) return 2;
  if (v <= 80) return 3;
  return 4;
}
const isHigh = (v: number) => bandOf(v) >= 3;
const isLow = (v: number) => bandOf(v) <= 1;

// ---- 18지표 × 5구간 기본 문구 ----
export const DIMENSION_BANDS: Record<CoreKey, [string, string, string, string, string]> = {
  intimacy: [
    '거리감 속에서 오히려 편안함을 느낍니다.',
    '가까움보다 각자의 공간이 먼저인 편입니다.',
    '거리와 가까움 사이에서 균형을 잡습니다.',
    '함께하는 시간에서 안정감을 얻는 편입니다.',
    '깊이 밀착된 관계에서 사랑을 크게 느낍니다.',
  ],
  personalSpace: [
    '혼자만의 공간이 크게 필요하지 않은 편입니다.',
    '함께 있는 쪽을 더 선호합니다.',
    '함께와 혼자 사이 균형을 중시합니다.',
    '나만의 시간이 꼭 필요한 편입니다.',
    '독립된 공간이 관계만큼 중요합니다.',
  ],
  contact: [
    '연락 빈도에 크게 얽매이지 않습니다.',
    '연락은 필요할 때 정도면 충분합니다.',
    '적당한 연락으로 연결감을 유지합니다.',
    '자주 연락하며 이어져 있고 싶어 합니다.',
    '촘촘한 연락에서 연결감을 크게 느낍니다.',
  ],
  reassurance: [
    '상대의 확인 없이도 관계에 흔들리지 않습니다.',
    '큰 확인 없이도 비교적 안정적입니다.',
    '가끔의 확인으로 충분히 안심합니다.',
    '마음을 확인받을 때 안정감을 얻습니다.',
    '분명한 확신이 자주 필요한 편입니다.',
  ],
  trustOpen: [
    '신뢰는 시간과 검증을 거쳐 천천히 엽니다.',
    '쉽게 믿기보다 지켜보는 편입니다.',
    '상황을 보며 신뢰를 조율합니다.',
    '비교적 열린 마음으로 신뢰합니다.',
    '기본적으로 믿고 시작하는 편입니다.',
  ],
  boundary: [
    '웬만한 일은 크게 선을 두지 않습니다.',
    '경계가 유연한 편입니다.',
    '상황에 따라 선을 조절합니다.',
    '지켜야 할 선이 분명한 편입니다.',
    '경계에 매우 민감하고 기준이 확고합니다.',
  ],
  privacy: [
    '사생활을 공유하는 데 거리낌이 적습니다.',
    '많은 것을 열어두는 편입니다.',
    '공유와 사생활의 균형을 둡니다.',
    '개인 영역을 분명히 존중받고 싶어 합니다.',
    '사생활은 관계와 별개로 지켜져야 한다고 봅니다.',
  ],
  conflictDirect: [
    '갈등은 되도록 피하고 싶어 합니다.',
    '정면 대립보다 우회를 택하는 편입니다.',
    '필요할 때 조심스럽게 문제를 꺼냅니다.',
    '문제는 피하지 않고 이야기하는 편입니다.',
    '갈등을 정면으로, 지금 다루려는 편입니다.',
  ],
  cooldown: [
    '감정이 생기면 바로 풀어야 하는 편입니다.',
    '오래 묵히기보다 빨리 이야기합니다.',
    '상황에 따라 시간을 두기도 합니다.',
    '감정을 정리할 시간이 필요한 편입니다.',
    '충분히 식힌 뒤에야 대화가 되는 편입니다.',
  ],
  empathy: [
    '감정보다 사실과 논리가 먼저 보입니다.',
    '위로보다 상황 파악이 앞서는 편입니다.',
    '공감과 실용 사이 균형을 둡니다.',
    '상대 감정을 먼저 살피는 편입니다.',
    '무엇보다 상대의 마음을 먼저 읽습니다.',
  ],
  solution: [
    '해결보다 함께 느끼는 것을 중시합니다.',
    '방법 제시보다 공감을 앞세우는 편입니다.',
    '공감과 해결을 상황에 맞춰 씁니다.',
    '문제 앞에서 해법을 먼저 떠올립니다.',
    '위로보다 구체적 해결책이 먼저 나옵니다.',
  ],
  accountability: [
    '잘잘못을 크게 따지지 않는 편입니다.',
    '책임 소재보다 넘어가는 쪽을 택합니다.',
    '상황에 따라 책임을 짚습니다.',
    '사과와 책임을 분명히 하는 편입니다.',
    '책임과 사과의 기준이 매우 분명합니다.',
  ],
  emotionExpression: [
    '감정을 겉으로 드러내지 않는 편입니다.',
    '표현보다 속으로 삭이는 편입니다.',
    '필요할 때 감정을 표현합니다.',
    '감정을 솔직하게 표현하는 편입니다.',
    '마음을 숨기지 않고 분명히 표현합니다.',
  ],
  leadership: [
    '결정은 상대에게 맡기는 쪽이 편합니다.',
    '주도하기보다 따라가는 편입니다.',
    '상황에 따라 이끌거나 맞춥니다.',
    '관계를 주도적으로 이끄는 편입니다.',
    '방향을 직접 정하고 이끌 때 편안합니다.',
  ],
  flexibility: [
    '내 기준을 분명히 지키는 편입니다.',
    '타협보다 원칙을 앞세우는 편입니다.',
    '상황에 따라 조율합니다.',
    '차이를 유연하게 맞춰가는 편입니다.',
    '거의 언제나 조율과 타협으로 풉니다.',
  ],
  repair: [
    '틀어지면 회복보다 정리를 택하기도 합니다.',
    '회복에 크게 매달리지 않는 편입니다.',
    '상황을 보며 회복을 시도합니다.',
    '한번 시작한 관계는 잘 포기하지 않습니다.',
    '어긋나도 끝까지 회복하려는 의지가 강합니다.',
  ],
  stability: [
    '변화와 즉흥을 즐기는 편입니다.',
    '안정보다 새로움을 선호합니다.',
    '안정과 변화의 균형을 둡니다.',
    '예측 가능한 안정을 선호합니다.',
    '안정감이 관계의 핵심 조건입니다.',
  ],
  future: [
    '지금 이 순간에 집중하는 편입니다.',
    '먼 미래보다 현재가 먼저입니다.',
    '현재와 미래를 함께 봅니다.',
    '관계의 미래를 자주 그려보는 편입니다.',
    '미래 설계를 관계의 중심에 둡니다.',
  ],
};

export function dimensionText(key: CoreKey, value: number): string {
  return DIMENSION_BANDS[key][bandOf(value)];
}
export function dimensionLabel(key: CoreKey): string {
  return CORE_DIMENSIONS[key];
}

// ---- 조합 insight rules ----
export interface InsightRule {
  id: string;
  title: string;
  when: (s: NormalizedScores<CoreKey>) => boolean;
  text: string;
}

export const INSIGHT_RULES: InsightRule[] = [
  {
    id: 'intimacy_space',
    title: '가까움과 거리, 둘 다',
    when: (s) => isHigh(s.intimacy) && isHigh(s.personalSpace),
    text: '깊게 사랑하고 싶지만, 사랑한다고 항상 붙어 있어야 한다고 생각하지는 않습니다.',
  },
  {
    id: 'reassure_lowexpress',
    title: '확인은 필요하지만 표현은 아껴요',
    when: (s) => isHigh(s.reassurance) && isLow(s.emotionExpression),
    text: '상대의 표현은 많이 필요하지만 자신의 감정은 상대적으로 덜 드러내는 편입니다.',
  },
  {
    id: 'conflict_cooldown',
    title: '피하진 않지만 서두르지도 않아요',
    when: (s) => isHigh(s.conflictDirect) && isHigh(s.cooldown),
    text: '문제를 피하지는 않지만 감정이 정리되지 않은 상태에서 바로 싸우는 것도 원하지 않습니다.',
  },
  {
    id: 'solution_lowempathy',
    title: '위로보다 해결이 먼저',
    when: (s) => isHigh(s.solution) && isLow(s.empathy),
    text: '상대가 힘들어하면 위로보다 해결 방법이 먼저 떠오르는 편입니다.',
  },
  {
    id: 'lowtrust_repair',
    title: '쉽게 믿진 않지만 쉽게 포기도 안 해요',
    when: (s) => isLow(s.trustOpen) && isHigh(s.repair),
    text: '쉽게 믿지는 않지만 한번 관계를 시작하면 쉽게 포기하지 않는 편입니다.',
  },
  {
    id: 'boundary_flexlow',
    title: '선은 분명하게',
    when: (s) => isHigh(s.boundary) && isLow(s.flexibility),
    text: '맞춰줄 수 있는 부분은 많지만, 한번 정한 선만큼은 잘 양보하지 않습니다.',
  },
  {
    id: 'leadership_solution',
    title: '방향을 잡는 사람',
    when: (s) => isHigh(s.leadership) && isHigh(s.solution),
    text: '관계가 흔들릴 때 방향을 제시하고 문제를 정리하는 역할을 자주 맡습니다.',
  },
  {
    id: 'future_stability',
    title: '멀리 보는 안정',
    when: (s) => isHigh(s.future) && isHigh(s.stability),
    text: '지금의 설렘만큼이나 이 관계가 오래 안정적으로 갈 수 있는지를 중요하게 봅니다.',
  },
  {
    id: 'contact_privacy',
    title: '연결되고 싶지만 통제는 싫어요',
    when: (s) => isHigh(s.contact) && isHigh(s.privacy),
    text: '자주 연결되어 있고 싶지만, 그것이 서로를 확인하고 통제하는 방식이 되는 건 원하지 않습니다.',
  },
  {
    id: 'empathy_flex',
    title: '맞춰주는 다정함',
    when: (s) => isHigh(s.empathy) && isHigh(s.flexibility),
    text: '상대의 감정을 먼저 읽고, 부딪히기보다 맞춰가며 관계를 부드럽게 유지합니다.',
  },
];

export function evaluateInsights(s: NormalizedScores<CoreKey>): InsightRule[] {
  return INSIGHT_RULES.filter((r) => r.when(s));
}

// ---- 대표 핵심수치 3개 선별 ----
// 높은 것만 뽑지 않는다: "강한 고점 + 강한 저점 + 다음으로 극단적인 값" 조합으로 대비를 만든다.
export interface SignatureDim {
  key: CoreKey;
  label: string;
  value: number;
  band: Band;
  direction: 'high' | 'low' | 'mid';
  text: string;
}

export function selectSignatureDimensions(
  s: NormalizedScores<CoreKey>,
  count = 3,
): SignatureDim[] {
  const entries = CORE_KEYS.map((k) => ({
    key: k,
    value: s[k],
    dist: Math.abs(s[k] - 50),
    band: bandOf(s[k]),
  }));

  const highs = entries.filter((e) => e.band >= 3).sort((a, b) => b.value - a.value);
  const lows = entries.filter((e) => e.band <= 1).sort((a, b) => a.value - b.value);
  const byDist = [...entries].sort(
    (a, b) => b.dist - a.dist || CORE_KEYS.indexOf(a.key) - CORE_KEYS.indexOf(b.key),
  );

  const chosen: typeof entries = [];
  const pushUnique = (e?: (typeof entries)[number]) => {
    if (e && !chosen.find((c) => c.key === e.key)) chosen.push(e);
  };

  // 1) 가장 강한 고점 2) 가장 강한 저점(대비) 3) 남은 것 중 가장 극단적
  pushUnique(highs[0]);
  pushUnique(lows[0]);
  for (const e of byDist) {
    if (chosen.length >= count) break;
    pushUnique(e);
  }
  // 그래도 부족하면 거리순으로 채움
  for (const e of byDist) {
    if (chosen.length >= count) break;
    pushUnique(e);
  }

  return chosen.slice(0, count).map((e) => ({
    key: e.key,
    label: CORE_DIMENSIONS[e.key],
    value: Math.round(e.value),
    band: e.band,
    direction: e.band >= 3 ? 'high' : e.band <= 1 ? 'low' : 'mid',
    text: dimensionText(e.key, e.value),
  }));
}

// ---- OTHER tags 개인화 (수치 불변, 문장만) ----
export function personalizeWithTags(base: string, tags?: string[]): string {
  if (!tags || tags.length === 0) return base;
  const clause = tags.slice(0, 2).join(', ');
  return `${base} (당신의 말: “${clause}”)`;
}

// ---- 무료 맛보기 결과 구성 ----
export interface FreePreview {
  primaryKey: string;
  secondaryKey: string;
  oneLiner: string; // 한 줄 설명 (character tagline 기반)
  signatureDims: SignatureDim[]; // 대표 수치 3개
  repeatPattern: { title: string; text: string } | null; // 반복 패턴 1개 무료공개
  lockedTitles: string[]; // 잠금 섹션 제목들
}

export const LOCKED_SECTION_TITLES = [
  '당신이 사랑하는 방식',
  '당신이 사랑받는 방식',
  '싸웠을 때의 진짜 모습',
  '신뢰가 깨졌을 때',
  '관계에서 가장 취약한 부분',
  '관계에서의 강점',
  '당신과 잘 맞는 캐릭터',
  '충돌하기 쉬운 캐릭터',
  '전체 18개 연애 수치',
  '나를 연애할 때 사용설명서',
];

export function buildFreePreview(
  character: CharacterResult,
  coreNormalized: NormalizedScores<CoreKey>,
  oneLiner: string,
  tags?: string[],
): FreePreview {
  const signatureDims = selectSignatureDimensions(coreNormalized, 3);
  const insights = evaluateInsights(coreNormalized);
  const top = insights[0];
  const repeatPattern = top
    ? { title: top.title, text: personalizeWithTags(top.text, tags) }
    : null;

  return {
    primaryKey: character.primary.key,
    secondaryKey: character.secondary.key,
    oneLiner,
    signatureDims,
    repeatPattern,
    lockedTitles: LOCKED_SECTION_TITLES,
  };
}
