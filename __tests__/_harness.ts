// 초경량 테스트 하니스 (외부 의존성 없이 tsx 로 실행)
type Fn = () => void | Promise<void>;
interface Case { name: string; fn: Fn }
interface Suite { name: string; cases: Case[] }

const suites: Suite[] = [];
let current: Suite | null = null;

export function describe(name: string, body: () => void) {
  current = { name, cases: [] };
  body();
  suites.push(current);
  current = null;
}
export function it(name: string, fn: Fn) {
  if (!current) throw new Error('it() must be inside describe()');
  current.cases.push({ name, fn });
}

export function expect(actual: any) {
  return {
    toBe(exp: any) {
      if (actual !== exp) throw new Error(`expected ${fmt(exp)} but got ${fmt(actual)}`);
    },
    toEqual(exp: any) {
      if (JSON.stringify(actual) !== JSON.stringify(exp))
        throw new Error(`expected ${fmt(exp)} but got ${fmt(actual)}`);
    },
    toBeCloseTo(exp: number, eps = 1e-9) {
      if (Math.abs(actual - exp) > eps)
        throw new Error(`expected ~${exp} but got ${actual}`);
    },
    toBeTrue() {
      if (actual !== true) throw new Error(`expected true but got ${fmt(actual)}`);
    },
    toBeFalse() {
      if (actual !== false) throw new Error(`expected false but got ${fmt(actual)}`);
    },
    toBeGE(n: number) {
      if (!(actual >= n)) throw new Error(`expected >= ${n} but got ${actual}`);
    },
    toBeLE(n: number) {
      if (!(actual <= n)) throw new Error(`expected <= ${n} but got ${actual}`);
    },
    toThrow(type?: new (...a: any[]) => Error) {
      let threw = false;
      let err: any;
      try {
        actual();
      } catch (e) {
        threw = true;
        err = e;
      }
      if (!threw) throw new Error('expected function to throw');
      if (type && !(err instanceof type))
        throw new Error(`expected throw ${type.name} but got ${err?.constructor?.name}`);
    },
    async toRejectValidation(type: new (...a: any[]) => Error) {
      let threw = false;
      let err: any;
      try {
        await actual();
      } catch (e) {
        threw = true;
        err = e;
      }
      if (!threw) throw new Error('expected promise to reject');
      if (!(err instanceof type))
        throw new Error(`expected reject ${type.name} but got ${err?.constructor?.name}`);
    },
  };
}

function fmt(v: any) {
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  return s.length > 120 ? s.slice(0, 120) + '…' : s;
}

export async function runAll(): Promise<number> {
  let pass = 0;
  let fail = 0;
  const failures: string[] = [];
  for (const s of suites) {
    console.log(`\n▶ ${s.name}`);
    for (const c of s.cases) {
      try {
        await c.fn();
        console.log(`  ✅ ${c.name}`);
        pass++;
      } catch (e: any) {
        console.log(`  ❌ ${c.name}\n       ${e.message}`);
        failures.push(`${s.name} › ${c.name}: ${e.message}`);
        fail++;
      }
    }
  }
  console.log(`\n${'='.repeat(55)}`);
  console.log(`총 ${pass + fail}개 / 통과 ${pass} / 실패 ${fail}`);
  console.log('='.repeat(55));
  if (fail) {
    console.log('\n실패 목록:');
    failures.forEach((f) => console.log('  - ' + f));
  }
  return fail;
}
