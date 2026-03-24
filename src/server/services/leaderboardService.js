// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 5 节“架构设计”和第 8 节“关键规则”。
import { compareScoreRecords } from '../domain/scoreRecord.js';
import { createNotFoundError } from '../shared/httpError.js';
import {
  validateCreateScoreInput,
  validateLimit,
  validateUpdateScoreInput
} from '../shared/validation.js';

const withRank = ({ record, rank }) =>
  Object.freeze({
    ...record,
    rank
  });

export class LeaderboardService {
  constructor({ repository }) {
    this.repository = repository;
  }

  async listScores({ limit } = {}) {
    const normalizedLimit = validateLimit({ value: limit });
    const records = await this.repository.list();

    return records
      .toSorted(compareScoreRecords)
      .slice(0, normalizedLimit)
      .map((record, index) => withRank({ record, rank: index + 1 }));
  }

  async getScore({ id }) {
    const record = await this.repository.getById({ id });

    if (!record) {
      throw createNotFoundError({
        message: '成绩记录不存在。'
      });
    }

    return record;
  }

  async createScore({ input }) {
    const payload = validateCreateScoreInput({ input });
    return this.repository.create({ input: payload });
  }

  async updateScore({ id, input }) {
    const patch = validateUpdateScoreInput({ input });
    const record = await this.repository.update({ id, patch });

    if (!record) {
      throw createNotFoundError({
        message: '成绩记录不存在。'
      });
    }

    return record;
  }

  async deleteScore({ id }) {
    const record = await this.repository.delete({ id });

    if (!record) {
      throw createNotFoundError({
        message: '成绩记录不存在。'
      });
    }

    return record;
  }
}
