// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 4 节“技术选型”中的静态页面交付。
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { HttpError } from '../shared/httpError.js';

const CONTENT_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png']
]);

const resolveContentType = ({ filePath }) =>
  CONTENT_TYPES.get(path.extname(filePath)) ?? 'application/octet-stream';

const resolveFilePath = ({ staticDir, pathname }) => {
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.resolve(staticDir, path.normalize(relativePath));
  const rootPath = path.resolve(staticDir);

  if (!filePath.startsWith(rootPath)) {
    throw new HttpError({
      statusCode: 400,
      code: 'BAD_REQUEST',
      message: '静态资源路径非法。'
    });
  }

  return filePath;
};

const shouldFallbackToIndex = ({ pathname }) => path.extname(pathname) === '';

const sendFile = async ({ res, filePath, cacheControl }) => {
  const buffer = await readFile(filePath);

  res.writeHead(200, {
    'Content-Type': resolveContentType({ filePath }),
    'Cache-Control': cacheControl
  });

  res.end(buffer);
};

const getCacheControl = () => 'no-cache, no-store, must-revalidate';

export const serveStaticAsset = async ({ pathname, staticDir, res }) => {
  const filePath = resolveFilePath({ staticDir, pathname });

  try {
    const fileStats = await stat(filePath);

    if (fileStats.isDirectory()) {
      await sendFile({
        res,
        filePath: resolveFilePath({ staticDir, pathname: '/index.html' }),
        cacheControl: 'no-cache'
      });
      return;
    }

    await sendFile({
      res,
      filePath,
      cacheControl: getCacheControl()
    });
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }

    if (!shouldFallbackToIndex({ pathname })) {
      throw new HttpError({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: '静态资源不存在。'
      });
    }

    await sendFile({
      res,
      filePath: resolveFilePath({ staticDir, pathname: '/index.html' }),
      cacheControl: 'no-cache'
    });
  }
};
