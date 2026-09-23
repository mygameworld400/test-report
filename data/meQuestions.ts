// ME 연애스타일 분석 질문은행 v1.0
// 45개 상황형 문항 / 각 문항 A/B/C/D 4지선다 + OTHER 자유입력
// 첨부 원본(01_ME_QUESTIONS_V1)을 그대로 사용한다 (문항/선택지/점수 임의 변경 금지).
//
// SCORING 원칙
// - score 는 선택지가 각 dimension 에 주는 상대 가중치(-3 ~ +3).
// - 한 선택지가 여러 dimension(CORE+LOVE 혼합)에 동시에 영향을 줄 수 있다.
// - 최종 0~100 정규화는 lib/scoring.ts 가 담당한다 (STEP 3).

import type { MeQuestion } from '@/lib/types';

export const ME_QUESTIONS: readonly MeQuestion[] = [
  {
    id: 'ME_Q01', category: '연애초기',
    prompt: '썸을 타는 사람이 주말 이틀을 전부 같이 보내자고 한다. 가장 가까운 반응은?',
    options: [
      { id: 'A', text: '좋다. 이틀 내내 같이 있어도 즐거울 것 같다.', score: { intimacy: 3, personalSpace: -2, giveTime: 1 } },
      { id: 'B', text: '하루는 같이 보내고 하루는 각자 보내자고 한다.', score: { intimacy: 1, personalSpace: 2, flexibility: 2 } },
      { id: 'C', text: '좋아해도 주말 전체를 같이 보내는 건 부담스럽다.', score: { intimacy: -2, personalSpace: 3 } },
      { id: 'D', text: '그때그때 컨디션과 일정 보고 정하고 싶다.', score: { flexibility: 3, stability: -1 } },
    ],
    other: { enabled: true, allowedDimensions: ['intimacy', 'personalSpace', 'flexibility', 'stability', 'giveTime'] },
  },
  {
    id: 'ME_Q02', category: '연애초기',
    prompt: '좋아하는 사람이 생겼는데 상대가 먼저 관계를 정의하려 하지 않는다. 나는?',
    options: [
      { id: 'A', text: '내가 먼저 “우리 지금 무슨 사이야?”라고 묻는다.', score: { conflictDirect: 2, leadership: 3, reassurance: 1, emotionExpression: 1 } },
      { id: 'B', text: '조금 더 지켜보다가 상대 행동이 분명해지면 묻는다.', score: { cooldown: 1, stability: 1, trustOpen: 1 } },
      { id: 'C', text: '상대가 먼저 말할 때까지 기다린다.', score: { leadership: -2, emotionExpression: -1, reassurance: 1 } },
      { id: 'D', text: '정의하지 않아도 지금 즐거우면 괜찮다.', score: { reassurance: -3, stability: -2, flexibility: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['conflictDirect', 'leadership', 'reassurance', 'emotionExpression', 'cooldown', 'stability', 'trustOpen', 'flexibility'] },
  },
  {
    id: 'ME_Q03', category: '연애초기',
    prompt: '상대가 첫 데이트에서 자신의 과거 연애 이야기를 꽤 솔직하게 한다. 나는?',
    options: [
      { id: 'A', text: '솔직하게 말해줘서 오히려 신뢰가 간다.', score: { trustOpen: 3, boundary: -1 } },
      { id: 'B', text: '듣긴 하지만 판단은 더 만나보고 한다.', score: { trustOpen: 1, stability: 1 } },
      { id: 'C', text: '굳이 첫 데이트에 왜 말하지 싶어 경계된다.', score: { trustOpen: -2, boundary: 2 } },
      { id: 'D', text: '나도 비슷한 수준으로 솔직하게 내 이야기를 한다.', score: { emotionExpression: 2, trustOpen: 2, intimacy: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['trustOpen', 'boundary', 'stability', 'emotionExpression', 'intimacy'] },
  },
  {
    id: 'ME_Q04', category: '연애초기',
    prompt: '상대가 데이트 계획을 거의 전부 나에게 맡긴다. 나는?',
    options: [
      { id: 'A', text: '내가 정하는 게 편해서 오히려 좋다.', score: { leadership: 3 } },
      { id: 'B', text: '이번엔 내가 정하고 다음엔 상대가 정하자고 한다.', score: { leadership: 1, flexibility: 3 } },
      { id: 'C', text: '상대도 의견을 내야 한다고 느껴 답답하다.', score: { leadership: 2, accountability: 1, boundary: 1 } },
      { id: 'D', text: '아무 계획 없이 그날 느낌대로 움직여도 괜찮다.', score: { stability: -2, flexibility: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['leadership', 'flexibility', 'accountability', 'boundary', 'stability'] },
  },
  {
    id: 'ME_Q05', category: '연애초기',
    prompt: '좋아하는 사람과 중요한 가치관 하나가 크게 다르다는 걸 초반에 알게 됐다. 나는?',
    options: [
      { id: 'A', text: '중요한 가치관이면 좋아해도 관계를 다시 본다.', score: { boundary: 3, future: 2, stability: 2 } },
      { id: 'B', text: '서로 어디까지 맞출 수 있는지 먼저 이야기해본다.', score: { flexibility: 3, conflictDirect: 2, repair: 1 } },
      { id: 'C', text: '지금 잘 맞으면 일단 만나본다.', score: { future: -2, stability: -1, trustOpen: 1 } },
      { id: 'D', text: '내가 중요하게 보는 부분이면 상대가 어느 정도 맞춰줬으면 한다.', score: { leadership: 2, flexibility: -2, boundary: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['boundary', 'future', 'stability', 'flexibility', 'conflictDirect', 'repair', 'trustOpen', 'leadership'] },
  },
  {
    id: 'ME_Q06', category: '연락·거리',
    prompt: '연인이 친구들과 놀러 갔는데 6시간 동안 연락이 없다. 나는?',
    options: [
      { id: 'A', text: '재밌게 노나 보다 하고 내 할 일을 한다.', score: { contact: -3, reassurance: -2, personalSpace: 2, trustOpen: 1 } },
      { id: 'B', text: '별일 없는지만 한 번 확인하고 다시 내 일 한다.', score: { contact: 1, reassurance: 1, trustOpen: 1 } },
      { id: 'C', text: '왜 연락이 없는지 신경 쓰여 계속 휴대폰을 확인한다.', score: { contact: 3, reassurance: 3 } },
      { id: 'D', text: '나도 일부러 연락하지 않고 상대가 먼저 연락할 때까지 기다린다.', score: { contact: 2, reassurance: 2, conflictDirect: -1, emotionExpression: -1, boundary: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['contact', 'reassurance', 'personalSpace', 'trustOpen', 'conflictDirect', 'emotionExpression', 'boundary'] },
  },
  {
    id: 'ME_Q07', category: '연락·거리',
    prompt: '연인이 “이번 주는 너무 지쳐서 혼자 있고 싶어”라고 한다. 나는?',
    options: [
      { id: 'A', text: '편히 쉬라고 하고 먼저 연락 올 때까지 기다린다.', score: { personalSpace: 2, privacy: 3, reassurance: -1 } },
      { id: 'B', text: '이유를 한 번 확인한 뒤 시간을 준다.', score: { privacy: 2, reassurance: 1, conflictDirect: 1 } },
      { id: 'C', text: '내가 뭘 잘못했는지 계속 신경 쓰인다.', score: { reassurance: 3, intimacy: 2 } },
      { id: 'D', text: '연애 중인데 왜 혼자 있어야 하는지 이해하기 어렵다.', score: { intimacy: 3, personalSpace: -2, privacy: -2 } },
    ],
    other: { enabled: true, allowedDimensions: ['personalSpace', 'privacy', 'reassurance', 'conflictDirect', 'intimacy'] },
  },
  {
    id: 'ME_Q08', category: '연락·거리',
    prompt: '평소 매일 연락하던 연인이 갑자기 답장이 느려졌다. 가장 먼저 하는 행동은?',
    options: [
      { id: 'A', text: '바쁜가 보다 하고 며칠 지켜본다.', score: { trustOpen: 2, reassurance: -2, cooldown: 1 } },
      { id: 'B', text: '무슨 일 있는지 가볍게 물어본다.', score: { conflictDirect: 2, contact: 1 } },
      { id: 'C', text: '나에 대한 마음이 식었는지 직접 묻는다.', score: { reassurance: 3, conflictDirect: 3, emotionExpression: 2 } },
      { id: 'D', text: '나도 답장을 늦추며 반응을 본다.', score: { reassurance: 2, emotionExpression: -2, boundary: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['trustOpen', 'reassurance', 'cooldown', 'conflictDirect', 'contact', 'emotionExpression', 'boundary'] },
  },
  {
    id: 'ME_Q09', category: '연락·거리',
    prompt: '연인이 하루 종일 있었던 일을 밤마다 자세히 이야기하고 싶어 한다. 나는?',
    options: [
      { id: 'A', text: '좋다. 사소한 일도 서로 많이 아는 게 좋다.', score: { intimacy: 3, contact: 3, receiveTime: 1 } },
      { id: 'B', text: '중요한 일 중심으로 공유하면 좋겠다.', score: { intimacy: 1, personalSpace: 1, flexibility: 1 } },
      { id: 'C', text: '매일 그렇게 공유하는 건 피곤하다.', score: { personalSpace: 3, contact: -2 } },
      { id: 'D', text: '내가 말할 기분일 때만 이야기하고 싶다.', score: { personalSpace: 2, emotionExpression: -1, privacy: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['intimacy', 'contact', 'receiveTime', 'personalSpace', 'flexibility', 'emotionExpression', 'privacy'] },
  },
  {
    id: 'ME_Q10', category: '연락·거리',
    prompt: '연인이 내 일정과 위치를 자주 궁금해한다. 처음엔 관심 같았지만 점점 잦아진다. 나는?',
    options: [
      { id: 'A', text: '숨길 게 없으니 알려주는 편이다.', score: { privacy: -2, reassurance: 1 } },
      { id: 'B', text: '필요한 정도는 알려주되 매번 확인하는 건 선을 정한다.', score: { privacy: 3, boundary: 2, flexibility: 2 } },
      { id: 'C', text: '왜 그렇게 확인하는지 이유부터 물어본다.', score: { conflictDirect: 2, solution: 1, boundary: 1 } },
      { id: 'D', text: '내 사생활을 통제하려는 느낌이 들어 바로 거리를 둔다.', score: { privacy: 3, boundary: 3, repair: -1 } },
    ],
    other: { enabled: true, allowedDimensions: ['privacy', 'reassurance', 'boundary', 'flexibility', 'conflictDirect', 'solution', 'repair'] },
  },
  {
    id: 'ME_Q11', category: '연락·거리',
    prompt: '연인이 매일 자기 전 통화를 꼭 하고 싶어 한다. 나는?',
    options: [
      { id: 'A', text: '나도 좋아서 웬만하면 맞춘다.', score: { contact: 3, intimacy: 2, giveTime: 2 } },
      { id: 'B', text: '좋지만 매일은 부담스러워 횟수를 조율한다.', score: { contact: 1, personalSpace: 2, flexibility: 3 } },
      { id: 'C', text: '통화보다 메시지가 편하다.', score: { personalSpace: 1, emotionExpression: -1 } },
      { id: 'D', text: '정해진 연락 루틴 자체가 답답하다.', score: { stability: -2, personalSpace: 3, contact: -2 } },
    ],
    other: { enabled: true, allowedDimensions: ['contact', 'intimacy', 'giveTime', 'personalSpace', 'flexibility', 'emotionExpression', 'stability'] },
  },
  {
    id: 'ME_Q12', category: '연락·거리',
    prompt: '연인이 여행을 가서 사진과 상황을 실시간으로 계속 보내준다. 나는?',
    options: [
      { id: 'A', text: '좋다. 같이 여행하는 기분이라 반갑다.', score: { contact: 3, intimacy: 2, receiveTime: 1 } },
      { id: 'B', text: '중간중간 몇 장이면 충분하다.', score: { contact: 1, personalSpace: 1 } },
      { id: 'C', text: '여행 중엔 여행에 집중하고 나중에 이야기해도 된다.', score: { contact: -2, privacy: 2, personalSpace: 2 } },
      { id: 'D', text: '나도 비슷하게 실시간 공유하는 편이다.', score: { giveTime: 1, contact: 2, emotionExpression: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['contact', 'intimacy', 'receiveTime', 'personalSpace', 'privacy', 'giveTime', 'emotionExpression'] },
  },
  {
    id: 'ME_Q13', category: '신뢰·경계',
    prompt: '연인이 이성 친구와 단둘이 술을 마신 사실을 다음 날 알게 됐다. 아무 일은 없었다. 나는?',
    options: [
      { id: 'A', text: '아무 일 없었다면 크게 문제 삼지 않는다.', score: { trustOpen: 3, boundary: -2, privacy: 2 } },
      { id: 'B', text: '만난 건 괜찮지만 미리 말하지 않은 이유는 묻는다.', score: { boundary: 2, conflictDirect: 2, accountability: 1 } },
      { id: 'C', text: '단둘이 술을 마신 것 자체가 내 기준에선 선을 넘었다.', score: { boundary: 3, trustOpen: -1 } },
      { id: 'D', text: '앞으로 서로의 기준을 정확히 정하자고 한다.', score: { solution: 2, flexibility: 2, boundary: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['trustOpen', 'boundary', 'privacy', 'conflictDirect', 'accountability', 'solution', 'flexibility'] },
  },
  {
    id: 'ME_Q14', category: '신뢰·경계',
    prompt: '연인이 내 휴대폰을 보여달라고 한다. 특별히 숨길 것은 없다. 나는?',
    options: [
      { id: 'A', text: '보여준다. 연인 사이에 그 정도는 가능하다고 본다.', score: { privacy: -2, reassurance: 1 } },
      { id: 'B', text: '이번엔 보여주지만 왜 보고 싶은지는 묻는다.', score: { privacy: 1, conflictDirect: 2, flexibility: 1 } },
      { id: 'C', text: '숨길 게 없어도 휴대폰은 개인 영역이라 거절한다.', score: { privacy: 3, boundary: 2 } },
      { id: 'D', text: '나도 상대 휴대폰을 볼 수 있다면 서로 공개할 수 있다.', score: { privacy: -1, boundary: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['privacy', 'reassurance', 'conflictDirect', 'flexibility', 'boundary'] },
  },
  {
    id: 'ME_Q15', category: '신뢰·경계',
    prompt: '연인이 작은 거짓말을 했고, 들킨 뒤 “괜히 싸울까 봐 그랬다”고 한다. 나는?',
    options: [
      { id: 'A', text: '내용이 작으면 이유를 듣고 넘어갈 수 있다.', score: { trustOpen: 1, boundary: -1, repair: 1 } },
      { id: 'B', text: '거짓말한 이유와 다음에 어떻게 할지 이야기한다.', score: { solution: 2, accountability: 2, repair: 2 } },
      { id: 'C', text: '작은 거짓말이어도 신뢰 문제라 꽤 오래 본다.', score: { boundary: 3, trustOpen: -2 } },
      { id: 'D', text: '사과보다 이후 행동이 바뀌는지 지켜본다.', score: { solution: 2, trustOpen: -1, stability: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['trustOpen', 'boundary', 'repair', 'solution', 'accountability', 'stability'] },
  },
  {
    id: 'ME_Q16', category: '신뢰·경계',
    prompt: '연인이 전 연인과 가끔 안부를 주고받는다고 솔직히 말한다. 나는?',
    options: [
      { id: 'A', text: '현재 관계가 확실하면 신경 쓰지 않는다.', score: { trustOpen: 3, boundary: -2, reassurance: -1 } },
      { id: 'B', text: '어떤 관계인지 듣고 내 기준을 말한다.', score: { conflictDirect: 2, boundary: 1, flexibility: 1 } },
      { id: 'C', text: '굳이 연락을 이어갈 이유가 없다고 생각한다.', score: { boundary: 3, trustOpen: -1 } },
      { id: 'D', text: '그 연락이 계속된다면 나도 관계를 다시 생각한다.', score: { boundary: 3, repair: -1, stability: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['trustOpen', 'boundary', 'reassurance', 'conflictDirect', 'flexibility', 'repair', 'stability'] },
  },
  {
    id: 'ME_Q17', category: '신뢰·경계',
    prompt: '연인이 술자리에서 실수로 다른 사람에게 과하게 친밀하게 행동했다. 본인은 기억이 흐릿하다. 나는?',
    options: [
      { id: 'A', text: '실수였고 다시 안 하면 넘어갈 수 있다.', score: { repair: 2, boundary: -1 } },
      { id: 'B', text: '당시 상황과 행동을 정확히 확인하고 이야기한다.', score: { conflictDirect: 2, accountability: 2, solution: 1 } },
      { id: 'C', text: '술 때문이어도 행동 자체는 책임져야 한다고 본다.', score: { accountability: 3, boundary: 2 } },
      { id: 'D', text: '내 기준에 따라서는 한 번으로도 관계를 끝낼 수 있다.', score: { boundary: 3, repair: -3 } },
    ],
    other: { enabled: true, allowedDimensions: ['repair', 'boundary', 'conflictDirect', 'accountability', 'solution'] },
  },
  {
    id: 'ME_Q18', category: '신뢰·경계',
    prompt: '연인이 “난 원래 사람을 잘 못 믿어. 네가 계속 증명해줬으면 좋겠어”라고 한다. 나는?',
    options: [
      { id: 'A', text: '시간이 걸리더라도 행동으로 신뢰를 보여준다.', score: { repair: 2, stability: 2, giveHelp: 1 } },
      { id: 'B', text: '어느 정도는 이해하지만 내가 계속 증명해야 하는 관계는 부담스럽다.', score: { privacy: 2, boundary: 2, personalSpace: 1 } },
      { id: 'C', text: '신뢰는 기본적으로 서로 주고 시작해야 한다고 생각한다.', score: { trustOpen: 3, reassurance: -1 } },
      { id: 'D', text: '왜 그렇게 못 믿는지 함께 원인을 풀어본다.', score: { empathy: 2, solution: 2, repair: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['repair', 'stability', 'giveHelp', 'privacy', 'boundary', 'personalSpace', 'trustOpen', 'reassurance', 'empathy', 'solution'] },
  },
  {
    id: 'ME_Q19', category: '신뢰·경계',
    prompt: '연인이 중요한 약속을 두 번 연속 어겼다. 세 번째 약속 전에 나는?',
    options: [
      { id: 'A', text: '이번엔 지켜보자고 한 번 더 믿는다.', score: { trustOpen: 2, repair: 2 } },
      { id: 'B', text: '왜 반복되는지와 현실적인 대안을 이야기한다.', score: { solution: 3, conflictDirect: 2, flexibility: 1 } },
      { id: 'C', text: '다음부터는 말보다 행동을 보고 판단한다.', score: { trustOpen: -1, stability: 2, boundary: 2 } },
      { id: 'D', text: '두 번이면 충분하다. 이 관계의 신뢰를 다시 생각한다.', score: { boundary: 3, repair: -2 } },
    ],
    other: { enabled: true, allowedDimensions: ['trustOpen', 'repair', 'solution', 'conflictDirect', 'flexibility', 'stability', 'boundary'] },
  },
  {
    id: 'ME_Q20', category: '갈등',
    prompt: '큰 싸움 직후 상대가 “지금 바로 끝까지 이야기하자”고 한다. 나는?',
    options: [
      { id: 'A', text: '좋다. 오늘 안에 해결해야 마음이 편하다.', score: { conflictDirect: 3, cooldown: -3 } },
      { id: 'B', text: '30분~몇 시간만 진정하고 다시 이야기하자고 한다.', score: { conflictDirect: 2, cooldown: 2, flexibility: 2 } },
      { id: 'C', text: '오늘은 말하면 더 망칠 것 같아 다음 날 이야기한다.', score: { cooldown: 3, conflictDirect: 1 } },
      { id: 'D', text: '상대가 먼저 진정될 때까지 아예 말을 줄인다.', score: { cooldown: 3, emotionExpression: -2, conflictDirect: -2 } },
    ],
    other: { enabled: true, allowedDimensions: ['conflictDirect', 'cooldown', 'flexibility', 'emotionExpression'] },
  },
  {
    id: 'ME_Q21', category: '갈등',
    prompt: '연인이 화가 나서 “됐어, 말하기 싫어”라고 한다. 나는?',
    options: [
      { id: 'A', text: '그래도 지금 무슨 문제인지 말해달라고 한다.', score: { conflictDirect: 3, cooldown: -1, reassurance: 1 } },
      { id: 'B', text: '언제 다시 이야기할지만 정하고 시간을 준다.', score: { conflictDirect: 2, cooldown: 2, stability: 1 } },
      { id: 'C', text: '알겠다고 하고 상대가 먼저 올 때까지 기다린다.', score: { cooldown: 2, conflictDirect: -1 } },
      { id: 'D', text: '나도 기분 상해서 대화를 끊는다.', score: { emotionExpression: -1, repair: -2, boundary: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['conflictDirect', 'cooldown', 'reassurance', 'stability', 'emotionExpression', 'repair', 'boundary'] },
  },
  {
    id: 'ME_Q22', category: '갈등',
    prompt: '연인이 직장에서 크게 화난 채 전화를 걸어왔다. 가장 먼저 하는 반응은?',
    options: [
      { id: 'A', text: '“진짜 힘들었겠다” 하며 충분히 들어준다.', score: { empathy: 3, giveTime: 1, giveWords: 1 } },
      { id: 'B', text: '누가 뭘 잘못했는지 상황부터 정리해본다.', score: { solution: 2, accountability: 1 } },
      { id: 'C', text: '당장 할 수 있는 해결방법을 같이 찾는다.', score: { solution: 3, giveHelp: 2 } },
      { id: 'D', text: '원하는 게 위로인지 해결책인지 먼저 묻는다.', score: { empathy: 2, solution: 2, flexibility: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['empathy', 'solution', 'accountability', 'flexibility', 'giveTime', 'giveWords', 'giveHelp'] },
  },
  {
    id: 'ME_Q23', category: '갈등',
    prompt: '연인이 내게 상처되는 말을 하고 나중에 “화나서 한 말이야”라고 한다. 나는?',
    options: [
      { id: 'A', text: '진심이 아니었다면 사과 받고 넘어갈 수 있다.', score: { repair: 2, accountability: 2 } },
      { id: 'B', text: '왜 그런 말이 나왔는지까지 이야기해야 풀린다.', score: { conflictDirect: 2, solution: 1, accountability: 2 } },
      { id: 'C', text: '화났다고 해도 해서는 안 되는 말은 있다고 본다.', score: { boundary: 3, accountability: 2 } },
      { id: 'D', text: '말은 오래 남아서 당분간 거리를 둔다.', score: { boundary: 2, cooldown: 2, repair: -1 } },
    ],
    other: { enabled: true, allowedDimensions: ['repair', 'accountability', 'conflictDirect', 'solution', 'boundary', 'cooldown'] },
  },
  {
    id: 'ME_Q24', category: '갈등',
    prompt: '같은 문제로 세 번째 싸웠다. 나는?',
    options: [
      { id: 'A', text: '이번엔 규칙이나 방법을 구체적으로 바꾼다.', score: { solution: 3, repair: 2, stability: 1 } },
      { id: 'B', text: '왜 계속 반복되는지 둘의 감정을 충분히 이야기한다.', score: { empathy: 2, conflictDirect: 2, repair: 2 } },
      { id: 'C', text: '세 번이면 서로 안 맞는 부분일 수 있다고 본다.', score: { repair: -1, future: 2, boundary: 1 } },
      { id: 'D', text: '중요한 문제가 아니면 서로 포기할 부분을 정한다.', score: { flexibility: 3, repair: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['solution', 'repair', 'stability', 'empathy', 'conflictDirect', 'future', 'boundary', 'flexibility'] },
  },
  {
    id: 'ME_Q25', category: '갈등',
    prompt: '내가 잘못한 건 맞지만 상대도 잘못이 있다고 느낀다. 사과해야 한다면?',
    options: [
      { id: 'A', text: '내 잘못부터 깔끔하게 사과한다.', score: { accountability: 3, repair: 2 } },
      { id: 'B', text: '내 잘못을 사과한 뒤 상대 잘못도 이야기한다.', score: { accountability: 2, conflictDirect: 2 } },
      { id: 'C', text: '서로 잘못한 부분을 같이 정리한 뒤 사과하고 싶다.', score: { solution: 2, accountability: 2, flexibility: 2 } },
      { id: 'D', text: '상대가 자기 잘못을 인정하지 않으면 나만 먼저 사과하긴 싫다.', score: { accountability: 1, repair: -1, boundary: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['accountability', 'repair', 'conflictDirect', 'solution', 'flexibility', 'boundary'] },
  },
  {
    id: 'ME_Q26', category: '갈등',
    prompt: '연인이 내가 화난 이유를 전혀 이해하지 못한다. 나는?',
    options: [
      { id: 'A', text: '구체적인 상황과 이유를 차근차근 설명한다.', score: { emotionExpression: 2, conflictDirect: 2, solution: 1 } },
      { id: 'B', text: '먼저 내 감정이 어떤지 알아줬으면 좋겠다고 말한다.', score: { emotionExpression: 2, empathy: 3 } },
      { id: 'C', text: '한두 번 설명했는데도 모르겠으면 말하기 싫어진다.', score: { cooldown: 2, repair: -1, emotionExpression: -1 } },
      { id: 'D', text: '상대 입장에서는 왜 그렇게 생각하는지 먼저 들어본다.', score: { empathy: 2, flexibility: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['emotionExpression', 'conflictDirect', 'solution', 'empathy', 'cooldown', 'repair', 'flexibility'] },
  },
  {
    id: 'ME_Q27', category: '갈등',
    prompt: '싸움 중 상대가 울기 시작했다. 내 주장이 여전히 맞다고 생각한다. 나는?',
    options: [
      { id: 'A', text: '일단 싸움을 멈추고 상대 감정부터 달랜다.', score: { empathy: 3, repair: 2 } },
      { id: 'B', text: '진정시킨 뒤 문제 이야기는 반드시 다시 한다.', score: { empathy: 2, conflictDirect: 2, repair: 2 } },
      { id: 'C', text: '우는 것과 문제의 옳고 그름은 별개라 이야기를 계속한다.', score: { solution: 2, empathy: -2, conflictDirect: 2 } },
      { id: 'D', text: '그날은 대화를 끝내고 나중에 다시 꺼낸다.', score: { cooldown: 3, conflictDirect: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['empathy', 'repair', 'conflictDirect', 'solution', 'cooldown'] },
  },
  {
    id: 'ME_Q28', category: '갈등',
    prompt: '싸운 뒤 화해는 했지만 마음이 완전히 풀리지 않았다. 나는?',
    options: [
      { id: 'A', text: '남은 감정을 다시 솔직히 이야기한다.', score: { emotionExpression: 3, conflictDirect: 2 } },
      { id: 'B', text: '상대 행동이 달라지는지 지켜보며 자연스럽게 풀린다.', score: { trustOpen: -1, stability: 1, cooldown: 1 } },
      { id: 'C', text: '이미 화해했으니 더 꺼내지 않으려고 한다.', score: { emotionExpression: -2, repair: 1 } },
      { id: 'D', text: '시간이 지나도 남으면 그때 다시 이야기한다.', score: { cooldown: 2, conflictDirect: 1, flexibility: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['emotionExpression', 'conflictDirect', 'trustOpen', 'stability', 'cooldown', 'repair', 'flexibility'] },
  },
  {
    id: 'ME_Q29', category: '사랑표현',
    prompt: '연인이 힘든 하루를 보냈다고 한다. 내가 가장 자연스럽게 해줄 행동은?',
    options: [
      { id: 'A', text: '“오늘 진짜 고생했어” 같은 말을 많이 해준다.', score: { giveWords: 3, empathy: 1 } },
      { id: 'B', text: '시간을 내서 만나거나 오래 통화해준다.', score: { giveTime: 3, intimacy: 1 } },
      { id: 'C', text: '안아주거나 손을 잡아준다.', score: { giveTouch: 3 } },
      { id: 'D', text: '필요한 일을 대신 해주거나 해결해준다.', score: { giveHelp: 3, solution: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['giveWords', 'giveTime', 'giveTouch', 'giveHelp', 'empathy', 'intimacy', 'solution'] },
  },
  {
    id: 'ME_Q30', category: '사랑표현',
    prompt: '별일 없는 평범한 날, 연인에게 애정을 표현하고 싶다. 가장 가까운 방식은?',
    options: [
      { id: 'A', text: '보고 싶다, 사랑한다 같은 메시지를 보낸다.', score: { giveWords: 3, emotionExpression: 1 } },
      { id: 'B', text: '같이 밥 먹거나 산책할 시간을 만든다.', score: { giveTime: 3 } },
      { id: 'C', text: '작은 간식이나 선물을 사간다.', score: { giveGift: 3 } },
      { id: 'D', text: '상대가 귀찮아하던 일을 대신 처리해준다.', score: { giveHelp: 3 } },
    ],
    other: { enabled: true, allowedDimensions: ['giveWords', 'giveTime', 'giveGift', 'giveHelp', 'emotionExpression'] },
  },
  {
    id: 'ME_Q31', category: '사랑표현',
    prompt: '기념일을 챙길 때 내 스타일과 가장 가까운 것은?',
    options: [
      { id: 'A', text: '마음이 담긴 편지나 말을 준비한다.', score: { giveWords: 3 } },
      { id: 'B', text: '둘이 오래 기억할 경험이나 시간을 만든다.', score: { giveTime: 3 } },
      { id: 'C', text: '상대 취향에 맞는 선물을 고른다.', score: { giveGift: 3 } },
      { id: 'D', text: '기념일 자체보다 평소 행동이 더 중요하다고 생각한다.', score: { giveGift: -2, giveHelp: 1, stability: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['giveWords', 'giveTime', 'giveGift', 'giveHelp', 'stability'] },
  },
  {
    id: 'ME_Q32', category: '사랑표현',
    prompt: '연인이 아파서 집에서 쉬고 있다. 내가 가장 먼저 하고 싶은 것은?',
    options: [
      { id: 'A', text: '걱정된다고 계속 연락하며 상태를 묻는다.', score: { giveWords: 2, contact: 1 } },
      { id: 'B', text: '직접 가서 곁에 있어준다.', score: { giveTime: 3, giveTouch: 1 } },
      { id: 'C', text: '죽이나 약, 필요한 물건을 챙겨준다.', score: { giveHelp: 3, giveGift: 2 } },
      { id: 'D', text: '쉬는 게 중요하니 필요한 게 있으면 말하라고 하고 시간을 준다.', score: { privacy: 2, giveHelp: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['giveWords', 'contact', 'giveTime', 'giveTouch', 'giveHelp', 'giveGift', 'privacy'] },
  },
  {
    id: 'ME_Q33', category: '사랑표현',
    prompt: '내가 가장 사랑받는다고 느끼는 순간은?',
    options: [
      { id: 'A', text: '상대가 좋아한다고 분명하게 말해줄 때.', score: { receiveWords: 3, reassurance: 1 } },
      { id: 'B', text: '바쁜데도 나를 위해 시간을 내줄 때.', score: { receiveTime: 3, intimacy: 1 } },
      { id: 'C', text: '자연스럽게 안아주거나 손을 잡아줄 때.', score: { receiveTouch: 3 } },
      { id: 'D', text: '내가 힘들 때 실제로 나서서 도와줄 때.', score: { receiveHelp: 3, solution: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['receiveWords', 'reassurance', 'receiveTime', 'intimacy', 'receiveTouch', 'receiveHelp', 'solution'] },
  },
  {
    id: 'ME_Q34', category: '사랑표현',
    prompt: '연인이 내 생일에 다음 중 하나만 해줄 수 있다면 무엇이 가장 좋을까?',
    options: [
      { id: 'A', text: '진심이 담긴 긴 편지.', score: { receiveWords: 3 } },
      { id: 'B', text: '하루를 통째로 비워 나와 함께 보내기.', score: { receiveTime: 3 } },
      { id: 'C', text: '내가 오래 갖고 싶었던 선물.', score: { receiveGift: 3 } },
      { id: 'D', text: '내가 요즘 가장 힘들어하던 문제 하나를 해결해주기.', score: { receiveHelp: 3 } },
    ],
    other: { enabled: true, allowedDimensions: ['receiveWords', 'receiveTime', 'receiveGift', 'receiveHelp'] },
  },
  {
    id: 'ME_Q35', category: '관계운영',
    prompt: '둘이 가고 싶은 여행지가 완전히 다르다. 나는?',
    options: [
      { id: 'A', text: '각자 이유를 말하고 중간 지점을 찾는다.', score: { flexibility: 3, empathy: 1 } },
      { id: 'B', text: '이번엔 상대가 원하는 곳, 다음엔 내가 원하는 곳으로 간다.', score: { flexibility: 3, stability: 1 } },
      { id: 'C', text: '더 좋은 선택이라고 생각하는 쪽으로 설득한다.', score: { leadership: 2, solution: 2, flexibility: -1 } },
      { id: 'D', text: '나는 크게 상관없으니 상대가 정하게 한다.', score: { leadership: -3, flexibility: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['flexibility', 'empathy', 'stability', 'leadership', 'solution'] },
  },
  {
    id: 'ME_Q36', category: '관계운영',
    prompt: '연인이 중요한 결정을 계속 미룬다. 나는?',
    options: [
      { id: 'A', text: '선택지를 정리해서 내가 결론을 제안한다.', score: { leadership: 3, solution: 2 } },
      { id: 'B', text: '왜 결정하기 어려운지부터 같이 이야기한다.', score: { empathy: 2, solution: 1, flexibility: 1 } },
      { id: 'C', text: '충분히 생각할 시간을 주고 기다린다.', score: { cooldown: 1, privacy: 2, leadership: -1 } },
      { id: 'D', text: '내가 대신 정하는 건 싫고 상대가 책임지고 결정해야 한다고 본다.', score: { accountability: 2, boundary: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['leadership', 'solution', 'empathy', 'flexibility', 'cooldown', 'privacy', 'accountability', 'boundary'] },
  },
  {
    id: 'ME_Q37', category: '관계운영',
    prompt: '둘이 함께 쓰는 돈에서 상대가 예상보다 큰 소비를 했다. 나는?',
    options: [
      { id: 'A', text: '왜 썼는지 듣고 앞으로 기준을 다시 맞춘다.', score: { flexibility: 2, solution: 2, future: 1 } },
      { id: 'B', text: '공동 돈이면 사전에 상의했어야 한다고 분명히 말한다.', score: { boundary: 2, accountability: 2, future: 1 } },
      { id: 'C', text: '한 번 정도는 괜찮고 반복되지만 않으면 된다.', score: { repair: 1, boundary: -1 } },
      { id: 'D', text: '재정관이 안 맞으면 장기적으로 관계를 다시 본다.', score: { future: 3, stability: 2, boundary: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['flexibility', 'solution', 'future', 'boundary', 'accountability', 'repair', 'stability'] },
  },
  {
    id: 'ME_Q38', category: '관계운영',
    prompt: '연인이 갑자기 새로운 취미에 빠져 나와 보내는 시간이 줄었다. 나는?',
    options: [
      { id: 'A', text: '좋은 취미면 응원하고 내 생활도 즐긴다.', score: { personalSpace: 2, privacy: 2, trustOpen: 1 } },
      { id: 'B', text: '좋지만 우리 시간도 일정하게 확보하자고 한다.', score: { intimacy: 2, stability: 2, flexibility: 2 } },
      { id: 'C', text: '전보다 나를 덜 중요하게 생각하는 것 같아 서운하다.', score: { reassurance: 3, intimacy: 2 } },
      { id: 'D', text: '나도 새로운 일정을 만들며 관계 균형을 맞춘다.', score: { personalSpace: 2, flexibility: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['personalSpace', 'privacy', 'trustOpen', 'intimacy', 'stability', 'flexibility', 'reassurance'] },
  },
  {
    id: 'ME_Q39', category: '관계운영',
    prompt: '연인이 내 친구 중 한 명을 불편해하며 덜 만나달라고 한다. 나는?',
    options: [
      { id: 'A', text: '왜 불편한지 듣고 합리적이면 어느 정도 조정한다.', score: { flexibility: 3, empathy: 1, boundary: 1 } },
      { id: 'B', text: '친구 관계는 내 영역이라 상대가 정할 문제는 아니라고 한다.', score: { privacy: 3, boundary: 2 } },
      { id: 'C', text: '연인이 정말 힘들어하면 친구와의 거리를 줄일 수 있다.', score: { repair: 2, intimacy: 1, privacy: -1 } },
      { id: 'D', text: '셋이 같이 만나보거나 오해를 풀 방법을 찾는다.', score: { solution: 2, repair: 2, flexibility: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['flexibility', 'empathy', 'boundary', 'privacy', 'repair', 'intimacy', 'solution'] },
  },
  {
    id: 'ME_Q40', category: '미래·위기',
    prompt: '좋아하는 연인이 큰 커리어 기회 때문에 1년간 해외에 가야 한다. 나는?',
    options: [
      { id: 'A', text: '장거리여도 관계를 유지할 방법을 구체적으로 짠다.', score: { repair: 3, future: 3, stability: 2, solution: 2 } },
      { id: 'B', text: '서로 미래에 이 관계가 중요한지 먼저 깊게 이야기한다.', score: { future: 3, conflictDirect: 2, empathy: 1 } },
      { id: 'C', text: '서로에게 좋은 기회라면 잠시 떨어져도 괜찮다.', score: { personalSpace: 2, trustOpen: 2, reassurance: -1 } },
      { id: 'D', text: '장거리 연애가 너무 힘들 것 같으면 좋아해도 정리할 수 있다.', score: { stability: 2, repair: -2, future: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['repair', 'future', 'stability', 'solution', 'conflictDirect', 'empathy', 'personalSpace', 'trustOpen', 'reassurance'] },
  },
  {
    id: 'ME_Q41', category: '미래·위기',
    prompt: '연인이 갑자기 일을 그만두고 1년간 꿈을 준비하고 싶다고 한다. 나는?',
    options: [
      { id: 'A', text: '구체적인 계획과 생활비 대책이 있으면 응원한다.', score: { future: 3, stability: 2, solution: 2, flexibility: 1 } },
      { id: 'B', text: '일단 꿈을 지지하고 같이 방법을 찾아본다.', score: { repair: 2, empathy: 2, solution: 1 } },
      { id: 'C', text: '안정적인 수입 없이 그 결정을 하는 건 걱정된다.', score: { stability: 3, future: 2 } },
      { id: 'D', text: '상대 인생이니 내가 판단할 문제는 아니라고 본다.', score: { privacy: 2, personalSpace: 2, leadership: -1 } },
    ],
    other: { enabled: true, allowedDimensions: ['future', 'stability', 'solution', 'flexibility', 'repair', 'empathy', 'privacy', 'personalSpace', 'leadership'] },
  },
  {
    id: 'ME_Q42', category: '미래·위기',
    prompt: '연인은 결혼을 원하지만 나는 아직 확신이 없다. 상대가 1년 안에 결정을 원한다. 나는?',
    options: [
      { id: 'A', text: '내 생각을 솔직히 말하고 결론을 내기 위한 시간을 정한다.', score: { future: 3, conflictDirect: 2, emotionExpression: 2, stability: 1 } },
      { id: 'B', text: '상대를 놓치고 싶지 않아 일단 결혼 방향으로 맞춰본다.', score: { repair: 2, intimacy: 2, flexibility: 2 } },
      { id: 'C', text: '확신이 없으면 상대를 위해서라도 애매하게 잡지 않는다.', score: { boundary: 2, future: 2, repair: -1 } },
      { id: 'D', text: '왜 꼭 1년 안이어야 하는지부터 함께 다시 논의한다.', score: { solution: 2, flexibility: 2, conflictDirect: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['future', 'conflictDirect', 'emotionExpression', 'stability', 'repair', 'intimacy', 'flexibility', 'boundary', 'solution'] },
  },
  {
    id: 'ME_Q43', category: '미래·위기',
    prompt: '관계가 안정적이지만 예전 같은 설렘은 줄었다. 나는?',
    options: [
      { id: 'A', text: '안정감도 사랑의 중요한 형태라고 생각한다.', score: { stability: 3, repair: 2 } },
      { id: 'B', text: '둘이 새로운 경험을 만들어 설렘을 다시 만들려고 한다.', score: { repair: 2, solution: 2, flexibility: 1 } },
      { id: 'C', text: '설렘이 너무 줄면 관계 자체를 다시 생각한다.', score: { stability: -2, repair: -2 } },
      { id: 'D', text: '내 감정이 왜 변했는지 먼저 혼자 생각해본다.', score: { cooldown: 2, emotionExpression: -1, future: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['stability', 'repair', 'solution', 'flexibility', 'cooldown', 'emotionExpression', 'future'] },
  },
  {
    id: 'ME_Q44', category: '미래·위기',
    prompt: '연인과 5년 뒤 살고 싶은 도시와 삶의 방식이 완전히 다르다는 걸 알았다. 나는?',
    options: [
      { id: 'A', text: '누가 무엇을 포기할 수 있는지 현실적으로 협상한다.', score: { future: 3, solution: 2, flexibility: 2 } },
      { id: 'B', text: '사랑이 중요하니 그때 가서 상황에 맞춰보자고 한다.', score: { future: -2, repair: 2, flexibility: 1 } },
      { id: 'C', text: '핵심 인생 방향이 다르면 지금부터 진지하게 생각한다.', score: { future: 3, stability: 3, boundary: 2 } },
      { id: 'D', text: '둘 다 원하는 삶을 최대한 유지할 제3의 방법을 찾는다.', score: { solution: 3, flexibility: 3, future: 2 } },
    ],
    other: { enabled: true, allowedDimensions: ['future', 'solution', 'flexibility', 'repair', 'stability', 'boundary'] },
  },
  {
    id: 'ME_Q45', category: '미래·위기',
    prompt: '연인이 큰 실수를 했고, 사과도 했고, 다시는 반복하지 않기 위한 행동도 시작했다. 하지만 나는 아직 상처가 남아 있다. 나는?',
    options: [
      { id: 'A', text: '시간이 걸려도 행동이 달라지는 걸 보며 관계를 회복해본다.', score: { repair: 3, trustOpen: 1, stability: 1 } },
      { id: 'B', text: '내가 아직 상처받아 있다는 걸 솔직하게 말하고 함께 회복한다.', score: { emotionExpression: 3, repair: 3, empathy: 1 } },
      { id: 'C', text: '사과와 변화는 인정하지만 신뢰가 돌아오지 않으면 끝낼 수 있다.', score: { boundary: 3, repair: 1, trustOpen: -1 } },
      { id: 'D', text: '이미 충분히 바뀌려 한다면 과거 감정은 내가 정리하려고 한다.', score: { repair: 2, cooldown: 1, accountability: 1 } },
    ],
    other: { enabled: true, allowedDimensions: ['repair', 'trustOpen', 'stability', 'emotionExpression', 'empathy', 'boundary', 'cooldown', 'accountability'] },
  },
];

// 구현 메모 (원본 유지)
// 1) OTHER 클릭 시 textarea 노출.
// 2) OTHER 자유서술은 allowedDimensions 밖 키 생성 불가하도록 validation.
// 3) 각 dimension 최종점수는 min/max 정규화 (lib/scoring.ts).
// 4) 캐릭터는 CORE 18차원 벡터 ↔ 12 centroid 거리로 계산 (LOVE 미포함).
// 5) love 10개는 캐릭터 산출에 미사용, 별도 리포트.
// 6) UI 노출 시 카테고리가 몰리지 않게 섞는 것 권장.
