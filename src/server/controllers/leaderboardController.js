// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 5 节“架构设计”和第 7 节“API 设计”。
import { sendSuccess } from '../shared/response.js';

export const createLeaderboardController = ({ service }) =>
  Object.freeze({
    list: async ({ res, query }) => {
      const scores = await service.listScores({ limit: query.limit });
      sendSuccess({ res, data: scores });
    },

    get: async ({ res, params }) => {
      const score = await service.getScore({ id: params.id });
      sendSuccess({ res, data: score });
    },

    create: async ({ res, body }) => {
      const score = await service.createScore({ input: body });
      sendSuccess({ res, statusCode: 201, data: score });
    },

    update: async ({ res, params, body }) => {
      const score = await service.updateScore({
        id: params.id,
        input: body
      });

      sendSuccess({ res, data: score });
    },

    remove: async ({ res, params }) => {
      const score = await service.deleteScore({ id: params.id });
      sendSuccess({ res, data: score });
    }
  });
