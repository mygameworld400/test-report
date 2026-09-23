// 캐릭터 브랜드 메타 (프리미엄 리브랜딩)
//  - 유치한 이모지 동물명 대신 "아키타입 + 영문 코드 + 한 줄 정체성" 체계.
//  - centroid 키/벡터는 그대로. 여기서는 표시/카피용 메타만 정의.
//  - SNS 공유를 고려해 20~30대가 부끄럽지 않은 톤.

import type { CharacterKey } from '@/lib/types';

export interface CharacterMeta {
  key: CharacterKey;
  nameKo: string; // 한글 아키타입명
  nameEn: string; // 영문 코드 (배지/모노그램)
  monogram: string; // 심볼 문자 (일러스트 교체 전 placeholder)
  gradient: [string, string]; // 배지 그라디언트
  tagline: string; // 한 줄 정체성 (결과 헤드라인)
  essence: string; // 2~3문장 설명 (무료 한 줄 설명 확장)
  strengths: string[]; // 관계에서의 강점
  cautions: string[]; // 조심하면 좋은 점 (병리적 단정 금지)
  matchKeys: CharacterKey[]; // 잘 맞는 아키타입
  clashKeys: CharacterKey[]; // 충돌하기 쉬운 아키타입
}

export const CHARACTER_META: Record<CharacterKey, CharacterMeta> = {
  fox: {
    key: 'fox',
    nameKo: '전략가',
    nameEn: 'THE STRATEGIST',
    monogram: 'S',
    gradient: ['#E9A23B', '#C9761B'],
    tagline: '감정도 구조로 푸는 사람',
    essence:
      '문제가 생기면 감정에 오래 머물기보다 원인과 해법을 먼저 찾습니다. 관계를 더 낫게 만들 방법을 설계하는 데 강하고, 그만큼 명확한 대화를 선호합니다.',
    strengths: ['갈등을 회피하지 않고 구조적으로 해결', '반복되는 문제를 규칙으로 바꾸는 힘', '분명한 커뮤니케이션'],
    cautions: ['상대가 위로를 원할 때 해결부터 꺼내지 않기', '감정을 정리할 시간도 함께 존중하기'],
    matchKeys: ['owl', 'otter'],
    clashKeys: ['dolphin', 'panda'],
  },
  dog: {
    key: 'dog',
    nameKo: '조율가',
    nameEn: 'THE HARMONIZER',
    monogram: 'H',
    gradient: ['#F19AAC', '#E06A83'],
    tagline: '관계의 온도를 맞추는 사람',
    essence:
      '상대의 감정을 먼저 살피고 관계의 분위기를 부드럽게 유지합니다. 공감과 표현이 자연스럽고, 함께 맞춰가는 것을 사랑의 방식으로 여깁니다.',
    strengths: ['높은 공감과 따뜻한 표현', '갈등을 관계 회복으로 연결', '상대가 편안함을 느끼게 하는 힘'],
    cautions: ['맞추다 내 감정을 뒤로 미루지 않기', '가끔은 내 needs 도 분명히 말하기'],
    matchKeys: ['swan', 'otter'],
    clashKeys: ['cat', 'wolf'],
  },
  cat: {
    key: 'cat',
    nameKo: '독립가',
    nameEn: 'THE INDEPENDENT',
    monogram: 'I',
    gradient: ['#7C8BA1', '#4E5D73'],
    tagline: '거리를 지키며 깊게 사랑하는 사람',
    essence:
      '사랑하더라도 각자의 공간과 사생활을 중요하게 여깁니다. 붙어 있는 시간보다 서로를 존중하는 거리에서 안정감을 느낍니다.',
    strengths: ['건강한 경계와 자기 세계', '상대의 자유도 존중', '독립적이고 안정적인 태도'],
    cautions: ['거리 두기가 무관심으로 오해되지 않게 표현하기', '가까움이 필요한 순간 알아차리기'],
    matchKeys: ['dolphin', 'owl'],
    clashKeys: ['rabbit', 'swan'],
  },
  rabbit: {
    key: 'rabbit',
    nameKo: '로맨티스트',
    nameEn: 'THE ROMANTIC',
    monogram: 'R',
    gradient: ['#F48FB1', '#D81B60'],
    tagline: '확신과 가까움으로 사랑을 확인하는 사람',
    essence:
      '자주 연락하고 마음을 확인하며 가까이 있을 때 사랑을 크게 느낍니다. 표현이 풍부하고, 관계의 온기를 소중히 합니다.',
    strengths: ['풍부한 애정 표현', '관계에 대한 헌신과 몰입', '함께하는 시간을 소중히'],
    cautions: ['확인 욕구가 상대에게 부담이 되지 않게 균형 잡기', '혼자여도 괜찮은 시간 만들기'],
    matchKeys: ['swan', 'dog'],
    clashKeys: ['cat', 'dolphin'],
  },
  otter: {
    key: 'otter',
    nameKo: '유연가',
    nameEn: 'THE ADAPTER',
    monogram: 'A',
    gradient: ['#4DB6AC', '#00897B'],
    tagline: '부딪힘보다 맞춰가며 흐르는 사람',
    essence:
      '고집보다 조율을 택하고, 상황에 맞춰 유연하게 움직입니다. 상대와의 차이를 협상으로 풀며 관계를 편안하게 이끕니다.',
    strengths: ['높은 유연성과 타협력', '차이를 갈등 대신 조정으로', '함께 있기 편안한 사람'],
    cautions: ['맞추다 내 기준이 흐려지지 않게', '중요한 건 분명히 지키기'],
    matchKeys: ['dog', 'fox'],
    clashKeys: ['wolf', 'tiger'],
  },
  hedgehog: {
    key: 'hedgehog',
    nameKo: '신중가',
    nameEn: 'THE GUARDIAN',
    monogram: 'G',
    gradient: ['#9575CD', '#5E35B1'],
    tagline: '천천히, 안전하게 마음을 여는 사람',
    essence:
      '빠르게 다가가기보다 신중하게 관계를 살핍니다. 안정과 경계를 중요하게 여기며, 한번 연 마음은 책임 있게 지킵니다.',
    strengths: ['신중하고 안정적인 태도', '분명한 책임감', '깊이 있는 신뢰 형성'],
    cautions: ['신중함이 벽으로 느껴지지 않게 신호 주기', '가끔은 먼저 다가가 보기'],
    matchKeys: ['owl', 'wolf'],
    clashKeys: ['tiger', 'dolphin'],
  },
  wolf: {
    key: 'wolf',
    nameKo: '원칙가',
    nameEn: 'THE KEEPER',
    monogram: 'K',
    gradient: ['#546E7A', '#263238'],
    tagline: '지킬 선과 책임이 분명한 사람',
    essence:
      '관계에서 지켜야 할 원칙과 책임을 분명히 합니다. 신뢰와 경계를 중시하고, 옳고 그름에 대한 기준이 뚜렷합니다.',
    strengths: ['분명한 원칙과 책임감', '신뢰를 지키는 일관성', '흔들리지 않는 태도'],
    cautions: ['기준을 상대에게 강요하지 않기', '유연함이 필요한 순간 알아차리기'],
    matchKeys: ['hedgehog', 'owl'],
    clashKeys: ['dolphin', 'otter'],
  },
  tiger: {
    key: 'tiger',
    nameKo: '직진가',
    nameEn: 'THE INITIATOR',
    monogram: 'T',
    gradient: ['#FF7043', '#E64A19'],
    tagline: '돌려 말하지 않고 바로 다가가는 사람',
    essence:
      '마음이 생기면 주도적으로 움직이고, 문제도 미루지 않고 바로 이야기합니다. 솔직하고 추진력 있는 태도가 강점입니다.',
    strengths: ['주도적이고 솔직한 표현', '갈등을 미루지 않는 추진력', '분명한 방향 제시'],
    cautions: ['속도가 상대에게 빠르지 않은지 살피기', '냉각시간이 필요한 상대 존중하기'],
    matchKeys: ['fox', 'rabbit'],
    clashKeys: ['panda', 'hedgehog'],
  },
  panda: {
    key: 'panda',
    nameKo: '공감가',
    nameEn: 'THE EMPATH',
    monogram: 'E',
    gradient: ['#66BB6A', '#2E7D32'],
    tagline: '말보다 먼저 마음을 읽는 사람',
    essence:
      '상대의 감정을 섬세하게 관찰하고, 부딪히기보다 이해로 다가갑니다. 조용하지만 깊은 공감이 관계의 힘이 됩니다.',
    strengths: ['깊은 공감과 관찰력', '상대를 편하게 하는 배려', '차분한 안정감'],
    cautions: ['참기만 하다 감정이 쌓이지 않게 표현하기', '내 needs 도 말로 꺼내기'],
    matchKeys: ['dog', 'swan'],
    clashKeys: ['tiger', 'fox'],
  },
  swan: {
    key: 'swan',
    nameKo: '헌신가',
    nameEn: 'THE DEVOTED',
    monogram: 'D',
    gradient: ['#EC407A', '#AD1457'],
    tagline: '한번 정하면 끝까지 가는 사람',
    essence:
      '깊이 사랑하고 오래 함께하려는 마음이 큽니다. 헌신과 안정, 미래에 대한 그림을 중요하게 여깁니다.',
    strengths: ['깊은 헌신과 안정 지향', '관계 회복 의지', '미래를 함께 그리는 힘'],
    cautions: ['헌신이 일방적이 되지 않게 균형 잡기', '나를 위한 여백도 남기기'],
    matchKeys: ['rabbit', 'dog'],
    clashKeys: ['cat', 'dolphin'],
  },
  dolphin: {
    key: 'dolphin',
    nameKo: '자유가',
    nameEn: 'THE FREE SPIRIT',
    monogram: 'F',
    gradient: ['#29B6F6', '#0277BD'],
    tagline: '구속 없이 나답게 사랑하는 사람',
    essence:
      '자유와 사생활을 사랑하고, 정해진 틀보다 지금의 자연스러움을 택합니다. 가볍고 산뜻한 관계 안에서 나답게 존재합니다.',
    strengths: ['자유롭고 산뜻한 태도', '상대에게 여유를 주는 힘', '지금을 즐기는 감각'],
    cautions: ['자유가 거리감으로 읽히지 않게 신호 주기', '안정이 필요한 상대 배려하기'],
    matchKeys: ['cat', 'otter'],
    clashKeys: ['rabbit', 'swan'],
  },
  owl: {
    key: 'owl',
    nameKo: '설계가',
    nameEn: 'THE ARCHITECT',
    monogram: 'A',
    gradient: ['#5C6BC0', '#283593'],
    tagline: '관계의 미래를 그리는 사람',
    essence:
      '지금의 감정만이 아니라 관계가 어디로 갈지를 함께 봅니다. 안정과 계획을 바탕으로 신뢰를 쌓아가는 데 강합니다.',
    strengths: ['미래 설계와 안정 지향', '신중한 판단력', '관계를 장기적으로 보는 시야'],
    cautions: ['계획이 상대를 압박하지 않게 여유 두기', '즉흥적 설렘도 가끔 허용하기'],
    matchKeys: ['hedgehog', 'fox'],
    clashKeys: ['dolphin', 'tiger'],
  },
};
