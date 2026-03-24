// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 6 节“数据模型”和第 7 节“API 设计”。
import { HttpError, createValidationError } from './httpError.js';

const PLAYER_NAME_MAX_LENGTH = 24;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 20;

const ensureObjectPayload = ({ value }) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new HttpError({
      statusCode: 400,
      code: 'BAD_REQUEST',
      message: '请求体必须是 JSON 对象。'
    });
  }

  return value;
};

const parseNonNegativeInteger = ({ label, value }) => {
  if (!Number.isInteger(value) || value < 0) {
    throw createValidationError({
      message: `${label} 必须是非负整数。`
    });
  }

  return value;
};

export const normalizePlayerName = ({ value }) => {
  if (typeof value !== 'string') {
    throw createValidationError({
      message: 'playerName 必须是字符串。'
    });
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw createValidationError({
      message: 'playerName 不能为空。'
    });
  }

  if (trimmedValue.length > PLAYER_NAME_MAX_LENGTH) {
    throw createValidationError({
      message: `playerName 不能超过 ${PLAYER_NAME_MAX_LENGTH} 个字符。`
    });
  }

  return trimmedValue;
};

export const validateCreateScoreInput = ({ input }) => {
  const payload = ensureObjectPayload({ value: input });

  return Object.freeze({
    playerName: normalizePlayerName({ value: payload.playerName }),
    score: parseNonNegativeInteger({ label: 'score', value: payload.score }),
    durationMs: parseNonNegativeInteger({
      label: 'durationMs',
      value: payload.durationMs
    })
  });
};

export const validateUpdateScoreInput = ({ input }) => {
  const payload = ensureObjectPayload({ value: input });

  return Object.freeze({
    playerName: normalizePlayerName({ value: payload.playerName })
  });
};

export const validateLimit = ({ value }) => {
  if (value === undefined) {
    return DEFAULT_LIMIT;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1 || parsedValue > MAX_LIMIT) {
    throw createValidationError({
      message: `limit 必须是 1 到 ${MAX_LIMIT} 之间的整数。`
    });
  }

  return parsedValue;
};
