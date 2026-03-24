// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 5 节“架构设计”和第 6 节“数据模型”。
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createScoreRecord } from '../domain/scoreRecord.js';
import { LeaderboardRepository } from './leaderboardRepository.js';

const EMPTY_STORE = Object.freeze({ scores: [] });

const parseStore = ({ raw }) => {
  if (!raw.trim()) {
    return EMPTY_STORE;
  }

  const parsedValue = JSON.parse(raw);

  if (!parsedValue || typeof parsedValue !== 'object' || !Array.isArray(parsedValue.scores)) {
    throw new Error('排行榜数据文件格式无效。');
  }

  return {
    scores: parsedValue.scores.map((record) => createScoreRecord({ record }))
  };
};

const serializeStore = ({ scores }) =>
  `${JSON.stringify({ scores }, null, 2)}\n`;

export class FileLeaderboardRepository extends LeaderboardRepository {
  constructor({ filePath, createId = randomUUID, now = () => new Date().toISOString() }) {
    super();
    this.filePath = filePath;
    this.createId = createId;
    this.now = now;
  }

  async list() {
    const store = await this.#readStore();
    return store.scores.map((record) => createScoreRecord({ record }));
  }

  async getById({ id }) {
    const scores = await this.list();
    return scores.find((record) => record.id === id) ?? null;
  }

  async create({ input }) {
    const scores = await this.list();
    const record = createScoreRecord({
      record: {
        id: this.createId(),
        createdAt: this.now(),
        ...input
      }
    });

    await this.#writeScores({ scores: [...scores, record] });
    return record;
  }

  async update({ id, patch }) {
    const scores = await this.list();
    const index = scores.findIndex((record) => record.id === id);

    if (index === -1) {
      return null;
    }

    const updatedRecord = createScoreRecord({
      record: {
        ...scores[index],
        ...patch
      }
    });

    const nextScores = scores.with(index, updatedRecord);
    await this.#writeScores({ scores: nextScores });
    return updatedRecord;
  }

  async delete({ id }) {
    const scores = await this.list();
    const targetRecord = scores.find((record) => record.id === id);

    if (!targetRecord) {
      return null;
    }

    const nextScores = scores.filter((record) => record.id !== id);
    await this.#writeScores({ scores: nextScores });
    return targetRecord;
  }

  async #readStore() {
    await this.#ensureStoreFile();
    const raw = await readFile(this.filePath, 'utf8');
    return parseStore({ raw });
  }

  async #writeScores({ scores }) {
    await this.#ensureStoreFile();
    await writeFile(this.filePath, serializeStore({ scores }), 'utf8');
  }

  async #ensureStoreFile() {
    await mkdir(path.dirname(this.filePath), { recursive: true });

    try {
      await readFile(this.filePath, 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }

      await writeFile(this.filePath, serializeStore({ scores: [] }), 'utf8');
    }
  }
}
