// 备注：对应培训阶段 5（编译验证与问题修复），关联设计文档第 9 节“非功能要求”。
import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '..');

const copyTargets = [
  ['src/client', 'dist/client'],
  ['src/server', 'dist/server']
];

const copyDirectory = async ({ source, target }) => {
  await cp(path.join(projectRoot, source), path.join(projectRoot, target), {
    recursive: true,
    force: true
  });
};

const build = async () => {
  await mkdir(path.join(projectRoot, 'dist'), { recursive: true });

  for (const [source, target] of copyTargets) {
    await copyDirectory({ source, target });
  }

  console.log('Build completed successfully.');
};

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
