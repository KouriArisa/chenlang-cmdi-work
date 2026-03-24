// 备注：对应培训阶段 2（项目初始化与环境配置），关联设计文档第 4 节“技术选型”和第 9 节“非功能要求”。
import path from 'node:path';

const DEFAULT_PORT = 3000;

const parsePort = ({ value }) => {
  const port = Number(value ?? DEFAULT_PORT);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT 必须是 1 到 65535 之间的整数。');
  }

  return port;
};

export const readRuntimeConfig = ({ projectRoot }) =>
  Object.freeze({
    host: process.env.HOST ?? '127.0.0.1',
    port: parsePort({ value: process.env.PORT }),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    dataFile:
      process.env.DATA_FILE ??
      path.join(process.env.DATA_DIR ?? path.join(projectRoot, 'data'), 'leaderboard.json')
  });
