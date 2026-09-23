// 질문 노출 순서 생성
//  - 같은 카테고리가 연속으로 몰리지 않게 분산 (인접 카테고리 중복 최소화).
//  - 결정론적(고정) — 새로고침/이어하기 시 순서가 바뀌지 않도록 저장해 사용.
//
// 알고리즘(탐욕): 매 단계에서 "남은 개수가 가장 많은 카테고리 중 직전과 다른 것"을 고른다.
//  → 어떤 카테고리도 전체의 과반(ceil(n/2))을 넘지 않으면 인접 중복 0 을 보장.

import { ME_QUESTIONS } from '@/data/meQuestions';

export function buildQuestionOrder(): string[] {
  // 카테고리 첫 등장 순서 유지 (결정론적 tie-break)
  const catOrder: string[] = [];
  const buckets = new Map<string, string[]>();
  for (const q of ME_QUESTIONS) {
    if (!buckets.has(q.category)) {
      buckets.set(q.category, []);
      catOrder.push(q.category);
    }
    buckets.get(q.category)!.push(q.id);
  }

  const cursor = new Map<string, number>(catOrder.map((c) => [c, 0]));
  const remaining = () =>
    catOrder.map((c) => ({ c, left: buckets.get(c)!.length - cursor.get(c)! }));

  const order: string[] = [];
  let prev: string | null = null;

  for (let step = 0; step < ME_QUESTIONS.length; step++) {
    const rem = remaining().filter((r) => r.left > 0);
    // 직전과 다른 카테고리 우선
    const pool = rem.filter((r) => r.c !== prev);
    const candidates = pool.length > 0 ? pool : rem; // 없으면 어쩔 수 없이 prev
    // 남은 개수 최대 → 동률이면 첫 등장 순서(catOrder) 우선
    candidates.sort((a, b) => {
      if (b.left !== a.left) return b.left - a.left;
      return catOrder.indexOf(a.c) - catOrder.indexOf(b.c);
    });
    const pick = candidates[0].c;
    const idx = cursor.get(pick)!;
    order.push(buckets.get(pick)![idx]);
    cursor.set(pick, idx + 1);
    prev = pick;
  }

  return order;
}
