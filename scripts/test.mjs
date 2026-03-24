// 备注：对应培训阶段 4（测试与质量保障），关联设计文档第 3 节“核心功能点”中的测试要求。
import { spawn } from 'node:child_process';

const steps = [
  ['node', ['--test', 'tests/unit/leaderboardService.test.js']],
  ['node', ['tests/integration/app.test.js']]
];

const runStep = ({ command, args }) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit'
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });

const run = async () => {
  for (const [command, args] of steps) {
    await runStep({ command, args });
  }
};

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
