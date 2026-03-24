// 备注：对应培训阶段 5（编译验证与问题修复），关联设计文档第 4 节“技术选型”和第 9 节“非功能要求”。
import { existsSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDependencies } from './app/createDependencies.js';
import { readRuntimeConfig } from './config/env.js';
import { createApp } from './http/createApp.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '../..');

const resolveStaticDir = () => {
  const distClientPath = path.join(projectRoot, 'dist', 'client');

  if (existsSync(distClientPath)) {
    return distClientPath;
  }

  return path.join(projectRoot, 'src', 'client');
};

const runtimeConfig = readRuntimeConfig({ projectRoot });
const dependencies = createDependencies({
  dataFile: runtimeConfig.dataFile
});

const app = createApp({
  ...dependencies,
  staticDir: resolveStaticDir()
});

const server = http.createServer(app);

server.listen(runtimeConfig.port, runtimeConfig.host, () => {
  console.log(
    `Snake Sprint server listening on http://${runtimeConfig.host}:${runtimeConfig.port}`
  );
});
