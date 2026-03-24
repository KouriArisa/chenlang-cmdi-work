// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 7 节“API 设计”中的请求约束。
import { HttpError } from '../shared/httpError.js';

const BODY_LIMIT_BYTES = 1024 * 1024;
const JSON_METHODS = new Set(['POST', 'PUT', 'PATCH']);

export const requestNeedsJsonBody = ({ method }) => JSON_METHODS.has(method);

export const readJsonBody = async ({ req }) => {
  const contentType = req.headers['content-type'] ?? '';

  if (!contentType.includes('application/json')) {
    throw new HttpError({
      statusCode: 415,
      code: 'UNSUPPORTED_MEDIA_TYPE',
      message: '请求体必须使用 application/json。'
    });
  }

  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    totalBytes += chunk.length;

    if (totalBytes > BODY_LIMIT_BYTES) {
      throw new HttpError({
        statusCode: 413,
        code: 'PAYLOAD_TOO_LARGE',
        message: '请求体超过 1MB 限制。'
      });
    }

    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');

  if (!raw.trim()) {
    throw new HttpError({
      statusCode: 400,
      code: 'BAD_REQUEST',
      message: '请求体不能为空。'
    });
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new HttpError({
      statusCode: 400,
      code: 'BAD_REQUEST',
      message: '请求体不是合法 JSON。'
    });
  }
};
