// STEP 2 데이터 무결성 검증 (§15 중 데이터 계층 항목)
// 실행: npm run validate:data  (tsx scripts/validateData.ts)

import { ME_QUESTIONS } from '@/data/meQuestions';
import { CORE_KEYS } from '@/data/coreDimensions';
import { LOVE_KEYS } from '@/data/loveDimensions';
import { CHARACTER_CENTROIDS } from '@/data/characterCentroids';
import { isDimensionKey, ALL_DIMENSION_KEYS, type OptionId } from '@/lib/types';

type Check = { name: string; pass: boolean; detail?: string };
const checks: Check[] = [];
const add = (name: string, pass: boolean, detail?: string) => checks.push({ name, pass, detail });

const REQUIRED_OPTIONS: OptionId[] = ['A', 'B', 'C', 'D'];
const SCORE_MIN = -3;
const SCORE_MAX = 3;

// 1) 질문 45개
add('질문 개수 == 45', ME_QUESTIONS.length === 45, `count=${ME_QUESTIONS.length}`);

// 2) 질문 id 중복 없음
const ids = ME_QUESTIONS.map((q) => q.id);
const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
add('질문 id 중복 없음', dupIds.length === 0, dupIds.length ? `dup=${[...new Set(dupIds)].join(',')}` : undefined);

// 3) 모든 질문에 A/B/C/D 정확히 존재
{
  const bad: string[] = [];
  for (const q of ME_QUESTIONS) {
    const optIds = q.options.map((o) => o.id).sort().join('');
    if (optIds !== 'ABCD') bad.push(`${q.id}:[${optIds}]`);
  }
  add('모든 질문 A/B/C/D 4지선다', bad.length === 0, bad.join(' '));
}

// 4) 모든 옵션 text 비어있지 않음
{
  const bad: string[] = [];
  for (const q of ME_QUESTIONS)
    for (const o of q.options) if (!o.text || !o.text.trim()) bad.push(`${q.id}.${o.id}`);
  add('옵션 text 비어있지 않음', bad.length === 0, bad.join(' '));
}

// 5) 모든 score key 가 유효한 dimension (CORE 또는 LOVE)
{
  const bad: string[] = [];
  for (const q of ME_QUESTIONS)
    for (const o of q.options)
      for (const k of Object.keys(o.score))
        if (!isDimensionKey(k)) bad.push(`${q.id}.${o.id}:${k}`);
  add('score key 전부 유효 dimension', bad.length === 0, bad.join(' '));
}

// 6) score 값이 -3~+3 정수
{
  const bad: string[] = [];
  for (const q of ME_QUESTIONS)
    for (const o of q.options)
      for (const [k, v] of Object.entries(o.score)) {
        if (typeof v !== 'number' || Number.isNaN(v)) bad.push(`${q.id}.${o.id}.${k}=NaN`);
        else if (v < SCORE_MIN || v > SCORE_MAX) bad.push(`${q.id}.${o.id}.${k}=${v}`);
        else if (!Number.isInteger(v)) bad.push(`${q.id}.${o.id}.${k}=${v}(비정수)`);
      }
  add('score 값 -3~+3 정수', bad.length === 0, bad.join(' '));
}

// 7) OTHER allowedDimensions 유효 + enabled
{
  const badKey: string[] = [];
  const notEnabled: string[] = [];
  const empty: string[] = [];
  for (const q of ME_QUESTIONS) {
    if (!q.other?.enabled) notEnabled.push(q.id);
    if (!q.other?.allowedDimensions?.length) empty.push(q.id);
    for (const k of q.other?.allowedDimensions ?? [])
      if (!isDimensionKey(k)) badKey.push(`${q.id}:${k}`);
  }
  add('OTHER allowedDimensions 전부 유효 키', badKey.length === 0, badKey.join(' '));
  add('OTHER 모두 enabled', notEnabled.length === 0, notEnabled.join(' '));
  add('OTHER allowedDimensions 비어있지 않음', empty.length === 0, empty.join(' '));
}

// 8) 모든 CORE 18개가 실제로 최소 1문항에서 측정됨
{
  const measured = new Set<string>();
  for (const q of ME_QUESTIONS)
    for (const o of q.options)
      for (const k of Object.keys(o.score)) measured.add(k);
  const missingCore = CORE_KEYS.filter((k) => !measured.has(k));
  add('CORE 18개 모두 측정됨', missingCore.length === 0, missingCore.join(','));
  const missingLove = LOVE_KEYS.filter((k) => !measured.has(k));
  add('LOVE 10개 모두 측정됨', missingLove.length === 0, missingLove.join(','));
}

// 9) 각 dimension 의 minPossible < maxPossible (측정되는 축 기준)
{
  const minRaw: Record<string, number> = {};
  const maxRaw: Record<string, number> = {};
  for (const k of ALL_DIMENSION_KEYS) {
    minRaw[k] = 0;
    maxRaw[k] = 0;
  }
  for (const q of ME_QUESTIONS)
    for (const k of ALL_DIMENSION_KEYS) {
      const vals = q.options.map((o) => Number((o.score as Record<string, number>)[k] ?? 0));
      minRaw[k] += Math.min(...vals);
      maxRaw[k] += Math.max(...vals);
    }
  const notSeparable = ALL_DIMENSION_KEYS.filter((k) => !(minRaw[k] < maxRaw[k]));
  add('모든 dimension minPossible < maxPossible', notSeparable.length === 0, notSeparable.join(','));
}

// 10) centroid 12개 + 각 벡터 길이 18 + CORE 순서 대응
{
  const entries = Object.entries(CHARACTER_CENTROIDS);
  add('centroid 12종', entries.length === 12, `count=${entries.length}`);
  const badLen = entries.filter(([, c]) => c.vector.length !== 18).map(([k]) => k);
  add('centroid 벡터 길이 18 (CORE 대응)', badLen.length === 0, badLen.join(','));
  const badVal = entries
    .filter(([, c]) => c.vector.some((v) => typeof v !== 'number' || Number.isNaN(v) || v < 0 || v > 100))
    .map(([k]) => k);
  add('centroid 값 0~100', badVal.length === 0, badVal.join(','));
}

// ---- 출력 ----
let failed = 0;
console.log('\n================ STEP 2 DATA VALIDATION ================\n');
for (const c of checks) {
  const mark = c.pass ? '✅ PASS' : '❌ FAIL';
  if (!c.pass) failed++;
  console.log(`${mark}  ${c.name}${!c.pass && c.detail ? `  →  ${c.detail}` : ''}`);
}
console.log(`\n-------------------------------------------------------`);
console.log(`총 ${checks.length}개 검사 / 통과 ${checks.length - failed} / 실패 ${failed}`);
console.log(`=======================================================\n`);
process.exit(failed === 0 ? 0 : 1);
