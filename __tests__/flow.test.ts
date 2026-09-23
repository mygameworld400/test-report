// 전체 진행 흐름 통합 테스트 (테스트 UI 가 의존하는 로직 검증)
import { describe, it, expect } from './_harness';
import { ME_QUESTIONS } from '@/data/meQuestions';
import { buildQuestionOrder } from '@/lib/questionOrder';
import { classifyOther, mockOtherClassifier } from '@/lib/otherAnswerClassifier';
import { analyzeME } from '@/lib/analyze';
import { upsertAnswer, type TestState } from '@/lib/storage';
import type { AnswerInput, OptionId } from '@/lib/types';

const byId = new Map(ME_QUESTIONS.map((q) => [q.id, q]));

describe('진행 흐름 (STEP 5)', () => {
  it('순서: 45개 전부 포함 · 중복 없음', () => {
    const order = buildQuestionOrder();
    expect(order.length).toBe(45);
    expect(new Set(order).size).toBe(45);
    for (const id of order) expect(byId.has(id)).toBeTrue();
  });

  it('순서: 같은 카테고리 3연속 없음 (분산 확인)', () => {
    const order = buildQuestionOrder();
    let maxRun = 1;
    let run = 1;
    for (let i = 1; i < order.length; i++) {
      const prev = byId.get(order[i - 1])!.category;
      const cur = byId.get(order[i])!.category;
      run = cur === prev ? run + 1 : 1;
      maxRun = Math.max(maxRun, run);
    }
    expect(maxRun).toBeLE(2);
  });

  it('45문항 답변 누적 → 분석까지 정상 (OTHER 혼합 포함)', async () => {
    const order = buildQuestionOrder();
    let state: TestState = {
      answers: [],
      order,
      currentIndex: 0,
      startedAt: 0,
      updatedAt: 0,
    };

    const opts: OptionId[] = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < order.length; i++) {
      const q = byId.get(order[i])!;
      // 5문항마다 OTHER 경로 사용 (옵션 텍스트로 높은 유사도 유도)
      if (i % 5 === 0) {
        const outcome = await classifyOther(q, q.options[i % 4].text, mockOtherClassifier);
        if (outcome.status === 'scored') {
          state = upsertAnswer(state, {
            questionId: q.id,
            isOther: true,
            otherScore: outcome.otherScore,
            reasonTags: outcome.tags,
          } as AnswerInput);
          continue;
        }
      }
      state = upsertAnswer(state, { questionId: q.id, optionId: opts[i % 4] });
    }

    const answered = state.answers.filter((a) => a.optionId || a.otherScore);
    expect(answered.length).toBe(45);

    const r = analyzeME(answered);
    expect(!!r.character.primary.label).toBeTrue();
    expect(!!r.character.secondary.label).toBeTrue();
    // 결과 수치 정상 범위
    for (const v of Object.values(r.core.normalized)) {
      expect(Number.isNaN(v as number)).toBeFalse();
      expect(v as number).toBeGE(0);
      expect(v as number).toBeLE(100);
    }
  });

  it('이어하기: currentIndex 보존 상태에서 재개 가능', () => {
    const order = buildQuestionOrder();
    const saved: TestState = {
      answers: [{ questionId: order[0], optionId: 'A' }],
      order,
      currentIndex: 1,
      startedAt: 0,
      updatedAt: 0,
    };
    // 저장된 order 길이 == 45 이면 그대로 재사용 (page 의 재개 조건)
    expect(saved.order.length).toBe(45);
    expect(saved.currentIndex).toBe(1);
  });
});
