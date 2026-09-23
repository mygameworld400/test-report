// storage adapter 검증 (SSR/노드 환경 안전성 + 순수 헬퍼)
import { describe, it, expect } from './_harness';
import { localStorageAdapter, upsertAnswer, getAnswer, type TestState } from '@/lib/storage';
import type { AnswerInput } from '@/lib/types';

const emptyState = (): TestState => ({
  answers: [],
  order: [],
  currentIndex: 0,
  startedAt: 0,
  updatedAt: 0,
});

describe('storage adapter', () => {
  it('노드/SSR 환경에서 load 는 null 반환 (크래시 없음)', () => {
    expect(localStorageAdapter.load()).toBe(null);
  });

  it('노드/SSR 환경에서 save/clear 는 예외 없이 무시', () => {
    // throw 하지 않으면 통과
    localStorageAdapter.save(emptyState());
    localStorageAdapter.clear();
  });

  it('upsertAnswer: 같은 questionId 는 교체(중복 없음)', () => {
    let s = emptyState();
    const a1: AnswerInput = { questionId: 'ME_Q01', optionId: 'A' };
    const a2: AnswerInput = { questionId: 'ME_Q01', optionId: 'C' };
    s = upsertAnswer(s, a1);
    s = upsertAnswer(s, a2);
    expect(s.answers.length).toBe(1);
    expect(getAnswer(s, 'ME_Q01')?.optionId).toBe('C');
  });

  it('upsertAnswer: 서로 다른 questionId 는 누적', () => {
    let s = emptyState();
    s = upsertAnswer(s, { questionId: 'ME_Q01', optionId: 'A' });
    s = upsertAnswer(s, { questionId: 'ME_Q02', optionId: 'B' });
    expect(s.answers.length).toBe(2);
  });
});
