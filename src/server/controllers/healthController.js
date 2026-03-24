// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 7 节“API 设计”中的健康检查接口。
import { sendSuccess } from '../shared/response.js';

export const createHealthController = ({ now }) =>
  Object.freeze({
    get: async ({ res }) => {
      sendSuccess({
        res,
        data: {
          status: 'ok',
          time: now()
        }
      });
    }
  });
