// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 7 节“API 设计”中的统一错误响应。
export class HttpError extends Error {
  constructor({ statusCode, code, message, details }) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const createNotFoundError = ({ message = '资源不存在。' } = {}) =>
  new HttpError({
    statusCode: 404,
    code: 'NOT_FOUND',
    message
  });

export const createValidationError = ({ message, details } = {}) =>
  new HttpError({
    statusCode: 400,
    code: 'VALIDATION_ERROR',
    message,
    details
  });
