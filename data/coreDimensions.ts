// 18개 핵심수치(CORE) 정의
// - 엔진 파일 CORE_KEYS 순서를 그대로 유지한다 (centroid 벡터 인덱스와 1:1 대응).
// - 캐릭터 판정에는 오직 이 18개 CORE만 사용한다. LOVE 10개는 절대 포함하지 않는다.

export const CORE_DIMENSIONS = {
  intimacy: '친밀감 욕구',
  personalSpace: '개인공간 욕구',
  contact: '연락 연결도',
  reassurance: '확신 욕구',
  trustOpen: '신뢰 개방도',
  boundary: '경계 민감도',
  privacy: '사생활 존중도',
  conflictDirect: '갈등 직면도',
  cooldown: '냉각시간 필요도',
  empathy: '공감 우선도',
  solution: '해결책 우선도',
  accountability: '책임·사과 중요도',
  emotionExpression: '감정 표현도',
  leadership: '주도권 욕구',
  flexibility: '유연·타협도',
  repair: '관계 회복 의지',
  stability: '안정 선호도',
  future: '미래 설계도',
} as const;

// centroid 벡터 인덱스와 정확히 일치해야 하는 고정 순서 배열
export const CORE_KEYS = [
  'intimacy',
  'personalSpace',
  'contact',
  'reassurance',
  'trustOpen',
  'boundary',
  'privacy',
  'conflictDirect',
  'cooldown',
  'empathy',
  'solution',
  'accountability',
  'emotionExpression',
  'leadership',
  'flexibility',
  'repair',
  'stability',
  'future',
] as const;
