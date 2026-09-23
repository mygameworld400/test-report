// 최상위 조합기: 답변 → CORE/LOVE 점수 → 캐릭터 판정
// (엔진 파일 analyzeME 의 확장판 — LOVE 포함, 캐릭터엔 CORE 만 사용)

import { calculateAllScores } from '@/lib/scoring';
import { classifyCharacter } from '@/lib/characterClassifier';
import { ME_QUESTIONS } from '@/data/meQuestions';
import type { AnswerInput, MeQuestion } from '@/lib/types';

export function analyzeME(
  answers: readonly AnswerInput[],
  questions: readonly MeQuestion[] = ME_QUESTIONS,
) {
  const scores = calculateAllScores(answers, questions);
  const character = classifyCharacter(scores.core.normalized); // CORE 만
  return {
    core: scores.core, // { raw, normalized } 18개
    love: scores.love, // { raw, normalized } 10개 (캐릭터 미사용)
    character, // primary/secondary/blend/ranking
  };
}
