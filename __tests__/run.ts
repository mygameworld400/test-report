// 테스트 러너: 모든 스위트 import 후 실행. 실패 시 exit code 1.
// 실행: npm run test  (tsx __tests__/run.ts)
import './dataIntegrity.test';
import './scoring.test';
import './character.test';
import './other.test';
import './storage.test';
import './flow.test';
import './insights.test';
import { runAll } from './_harness';

runAll().then((fail) => process.exit(fail === 0 ? 0 : 1));
