// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 7 节“API 设计”中的统一返回格式。
import { HttpError } from './httpError.js';

const JSON_HEADERS = Object.freeze({
  'Content-Type': 'application/json; charset=utf-8'
});

const buildErrorPayload = ({ error }) => {
  if (error instanceof HttpError) {
    return {
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {})
    };
  }

  return {
    code: 'INTERNAL_SERVER_ERROR',
    message: '服务器内部错误。'
  };
};

export const sendJson = ({ res, statusCode, payload }) => {
  res.writeHead(statusCode, JSON_HEADERS);
  res.end(JSON.stringify(payload));
};

export const sendSuccess = ({ res, statusCode = 200, data }) => {
  sendJson({
    res,
    statusCode,
    payload: {
      success: true,
      data
    }
  });
};

export const sendError = ({ res, error }) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  sendJson({
    res,
    statusCode,
    payload: {
      success: false,
      error: buildErrorPayload({ error })
    }
  });
};
