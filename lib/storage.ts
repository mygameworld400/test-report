// 상태 저장 계층 — adapter 분리
//  - MVP: localStorage
//  - 나중에 Supabase 로 교체 시 SupabaseStorageAdapter 만 구현해 storage 를 바꾸면 됨.
//  - 모든 접근은 try/catch (프라이빗 모드/SSR/차단 환경에서도 앱이 깨지지 않게).

import type { AnswerInput } from '@/lib/types';

export interface TestState {
  answers: AnswerInput[]; // questionId → 답변
  order: string[]; // 실제 노출 순서 (questionId 배열)
  currentIndex: number; // 현재 보고 있는 문항 index
  startedAt: number;
  updatedAt: number;
}

export interface StorageAdapter {
  load(): TestState | null;
  save(state: TestState): void;
  clear(): void;
}

const STORAGE_KEY = 'me:test:v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const localStorageAdapter: StorageAdapter = {
  load() {
    if (!isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as TestState;
    } catch {
      return null;
    }
  },
  save(state) {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* 저장 실패해도 앱 흐름은 유지 */
    }
  },
  clear() {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  },
};

// 나중에 여기만 교체: export const storage = supabaseStorageAdapter;
export const storage: StorageAdapter = localStorageAdapter;

// ---- 헬퍼 ----
export function upsertAnswer(state: TestState, answer: AnswerInput): TestState {
  const answers = state.answers.filter((a) => a.questionId !== answer.questionId);
  answers.push(answer);
  return { ...state, answers, updatedAt: Date.now() };
}

export function getAnswer(state: TestState, questionId: string): AnswerInput | undefined {
  return state.answers.find((a) => a.questionId === questionId);
}
