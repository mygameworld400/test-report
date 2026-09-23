'use client';

// 개발용 디버그 페이지 — 계산 전 과정을 그대로 노출한다.
// 실서비스에서는 라우트 자체를 노출하지 않거나 NEXT_PUBLIC_ENABLE_DEV 로 게이트할 수 있다.
import { useEffect, useMemo, useState } from 'react';
import { ME_QUESTIONS } from '@/data/meQuestions';
import { CORE_KEYS, CORE_DIMENSIONS } from '@/data/coreDimensions';
import { LOVE_KEYS, LOVE_DIMENSIONS } from '@/data/loveDimensions';
import { buildQuestionOrder } from '@/lib/questionOrder';
import { buildDimensionRanges, calculateAllScores, accumulateRaw } from '@/lib/scoring';
import { classifyCharacter } from '@/lib/characterClassifier';
import { classifyOther, mockOtherClassifier } from '@/lib/otherAnswerClassifier';
import { storage, type TestState } from '@/lib/storage';
import type { AnswerInput, OptionId } from '@/lib/types';

const OPTS: OptionId[] = ['A', 'B', 'C', 'D'];

export default function MeDebugPage() {
  const [answers, setAnswers] = useState<AnswerInput[] | null>(null);
  const [otherText, setOtherText] = useState('일단 통화로는 위로만 하고, 만나서 얼굴 보고 상황을 들은 뒤 필요하면 같이 방법을 찾는 편이에요.');
  const [otherQid, setOtherQid] = useState('ME_Q22');
  const [otherOut, setOtherOut] = useState<string>('');

  useEffect(() => {
    const s = storage.load();
    const a = (s?.answers ?? []).filter((x) => x.optionId || x.otherScore);
    setAnswers(a.length ? a : null);
  }, []);

  const fill = (mode: 'A' | 'random') => {
    let seed = 7;
    const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    const a: AnswerInput[] = ME_QUESTIONS.map((q) => ({
      questionId: q.id,
      optionId: mode === 'A' ? 'A' : OPTS[Math.floor(rnd() * 4)],
    }));
    const state: TestState = {
      answers: a,
      order: buildQuestionOrder(),
      currentIndex: 44,
      startedAt: Date.now(),
      updatedAt: Date.now(),
    };
    storage.save(state);
    setAnswers(a);
  };

  const analysis = useMemo(() => {
    if (!answers || answers.length !== 45) return null;
    const scores = calculateAllScores(answers);
    const character = classifyCharacter(scores.core.normalized);
    const coreRanges = buildDimensionRanges(CORE_KEYS);
    const loveRanges = buildDimensionRanges(LOVE_KEYS);
    const coreRaw = accumulateRaw(CORE_KEYS, answers);
    const loveRaw = accumulateRaw(LOVE_KEYS, answers);
    return { scores, character, coreRanges, loveRanges, coreRaw, loveRaw };
  }, [answers]);

  const runOther = async () => {
    const q = ME_QUESTIONS.find((x) => x.id === otherQid)!;
    try {
      const out = await classifyOther(q, otherText, mockOtherClassifier);
      setOtherOut(JSON.stringify(out, null, 2));
    } catch (e: any) {
      setOtherOut('ERROR: ' + e.message);
    }
  };

  return (
    <main style={S.page}>
      <div style={S.head}>
        <b>/dev/me-debug</b> · ME 계산 디버그 <span style={S.warn}>실서비스 비노출</span>
      </div>

      <div style={S.row}>
        <button style={S.btn} onClick={() => fill('A')}>샘플 채움 (전부 A)</button>
        <button style={S.btn} onClick={() => fill('random')}>랜덤 채움</button>
        <button style={S.btn} onClick={() => { storage.clear(); setAnswers(null); }}>초기화</button>
        <span style={{ color: '#888' }}>답변: {answers?.length ?? 0} / 45</span>
      </div>

      {!analysis && <p style={{ color: '#a00' }}>45문항 답변이 없습니다. 위 버튼으로 채우거나 /test 를 완료하세요.</p>}

      {analysis && (
        <>
          <Section title={`주 캐릭터 / 보조 / blend`}>
            <div style={S.kv}>
              <span>primary</span><b>{analysis.character.primary.label} ({analysis.character.primary.key}) · sim {analysis.character.primary.similarity.toFixed(1)} · dist {analysis.character.primary.distance.toFixed(2)}</b>
              <span>secondary</span><b>{analysis.character.secondary.label} ({analysis.character.secondary.key}) · dist {analysis.character.secondary.distance.toFixed(2)}</b>
              <span>blendStrength</span><b>{analysis.character.blendStrength}</b>
            </div>
          </Section>

          <Section title="12 캐릭터 distance / similarity ranking">
            <table style={S.table}>
              <thead><tr><th>#</th><th>key</th><th>label</th><th>distance</th><th>similarity</th></tr></thead>
              <tbody>
                {analysis.character.ranking.map((r, i) => (
                  <tr key={r.key} style={i < 2 ? { background: '#fff3f6' } : undefined}>
                    <td>{i + 1}</td><td>{r.key}</td><td>{r.label}</td>
                    <td style={S.num}>{r.distance.toFixed(2)}</td><td style={S.num}>{r.similarity.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="CORE 18 — raw / min / max / normalized">
            <table style={S.table}>
              <thead><tr><th>key</th><th>이름</th><th>raw</th><th>min</th><th>max</th><th>normalized</th></tr></thead>
              <tbody>
                {CORE_KEYS.map((k) => (
                  <tr key={k}>
                    <td>{k}</td><td>{CORE_DIMENSIONS[k]}</td>
                    <td style={S.num}>{analysis.coreRaw[k]}</td>
                    <td style={S.num}>{analysis.coreRanges.minRaw[k]}</td>
                    <td style={S.num}>{analysis.coreRanges.maxRaw[k]}</td>
                    <td style={{ ...S.num, fontWeight: 700 }}>{analysis.scores.core.normalized[k].toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="LOVE 10 — raw / min / max / normalized">
            <table style={S.table}>
              <thead><tr><th>key</th><th>이름</th><th>raw</th><th>min</th><th>max</th><th>normalized</th></tr></thead>
              <tbody>
                {LOVE_KEYS.map((k) => (
                  <tr key={k}>
                    <td>{k}</td><td>{LOVE_DIMENSIONS[k]}</td>
                    <td style={S.num}>{analysis.loveRaw[k]}</td>
                    <td style={S.num}>{analysis.loveRanges.minRaw[k]}</td>
                    <td style={S.num}>{analysis.loveRanges.maxRaw[k]}</td>
                    <td style={{ ...S.num, fontWeight: 700 }}>{analysis.scores.love.normalized[k].toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="45 답변">
            <table style={S.table}>
              <thead><tr><th>#</th><th>questionId</th><th>option</th><th>OTHER</th><th>tags</th></tr></thead>
              <tbody>
                {answers!.map((a, i) => (
                  <tr key={a.questionId}>
                    <td>{i + 1}</td><td>{a.questionId}</td>
                    <td>{a.optionId ?? '—'}</td>
                    <td>{a.otherScore ? JSON.stringify(a.otherScore) : '—'}</td>
                    <td>{(a.reasonTags ?? []).join(', ') || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </>
      )}

      <Section title="OTHER classifier 테스터 (mock)">
        <div style={S.row}>
          <select value={otherQid} onChange={(e) => setOtherQid(e.target.value)} style={S.input}>
            {ME_QUESTIONS.map((q) => <option key={q.id} value={q.id}>{q.id}</option>)}
          </select>
          <button style={S.btn} onClick={runOther}>분석</button>
        </div>
        <textarea value={otherText} onChange={(e) => setOtherText(e.target.value)} style={S.ta} rows={3} />
        <div style={{ fontSize: 11, color: '#888', margin: '4px 0' }}>
          allowedDimensions: {ME_QUESTIONS.find((q) => q.id === otherQid)?.other.allowedDimensions.join(', ')}
        </div>
        {otherOut && <pre style={S.pre}>{otherOut}</pre>}
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 22 }}>
      <h3 style={S.h3}>{title}</h3>
      {children}
    </section>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: { maxWidth: 720, margin: '0 auto', padding: '20px 16px 60px', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: 12.5, color: '#222', background: '#fafafa' },
  head: { fontSize: 14, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #ddd' },
  warn: { background: '#ffe0e0', color: '#a00', padding: '2px 6px', borderRadius: 4, marginLeft: 6, fontSize: 11 },
  row: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 },
  btn: { border: '1px solid #bbb', background: '#fff', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 },
  input: { border: '1px solid #bbb', borderRadius: 6, padding: '6px 8px', fontFamily: 'inherit' },
  ta: { width: '100%', border: '1px solid #bbb', borderRadius: 6, padding: 8, fontFamily: 'inherit', fontSize: 12 },
  h3: { fontSize: 13, margin: '0 0 8px', color: '#a44863' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 11.5 },
  num: { textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  kv: { display: 'grid', gridTemplateColumns: '120px 1fr', gap: '4px 10px' },
  pre: { background: '#1e1e1e', color: '#d4d4d4', padding: 12, borderRadius: 8, overflow: 'auto', fontSize: 11.5 },
};
