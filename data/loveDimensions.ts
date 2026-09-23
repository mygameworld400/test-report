// 사랑표현 보조수치(LOVE) 10개 정의
// - 주는 사랑 5개 / 받는 사랑 5개.
// - CORE와 완전히 별개의 독립 dimension. 각각 독립적으로 0~100 정규화한다.
// - "주는 5개끼리" 혹은 "받는 5개끼리" 합계 100으로 만들지 않는다 (동시에 높거나 낮을 수 있음).
// - 캐릭터 유사도 계산에는 절대 사용하지 않는다 (별도 리포트 전용).

export const LOVE_DIMENSIONS = {
  giveWords: '주는 사랑_말',
  giveTime: '주는 사랑_시간',
  giveTouch: '주는 사랑_스킨십',
  giveGift: '주는 사랑_선물·기념',
  giveHelp: '주는 사랑_실질적 도움',
  receiveWords: '받는 사랑_말',
  receiveTime: '받는 사랑_시간',
  receiveTouch: '받는 사랑_스킨십',
  receiveGift: '받는 사랑_선물·기념',
  receiveHelp: '받는 사랑_실질적 도움',
} as const;

// 고정 순서 배열 (리포트/디버그 표시 순서)
export const LOVE_KEYS = [
  'giveWords',
  'giveTime',
  'giveTouch',
  'giveGift',
  'giveHelp',
  'receiveWords',
  'receiveTime',
  'receiveTouch',
  'receiveGift',
  'receiveHelp',
] as const;

// give/receive 묶음 (리포트 UI 그룹핑용, 계산에는 영향 없음)
export const LOVE_GROUPS = {
  give: ['giveWords', 'giveTime', 'giveTouch', 'giveGift', 'giveHelp'],
  receive: ['receiveWords', 'receiveTime', 'receiveTouch', 'receiveGift', 'receiveHelp'],
} as const;
