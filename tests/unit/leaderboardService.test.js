// 备注：对应培训阶段 4（测试与质量保障），关联设计文档第 3 节“核心功能点”中的单元测试要求。
import assert from 'node:assert/strict';
import test from 'node:test';
import { LeaderboardService } from '../../src/server/services/leaderboardService.js';
import { HttpError } from '../../src/server/shared/httpError.js';

const createRepositoryDouble = ({
  listResult = [],
  getByIdResult = null,
  createResult,
  updateResult = null,
  deleteResult = null
} = {}) => {
  const calls = {
    create: [],
    update: [],
    delete: []
  };

  return {
    calls,
    repository: {
      async list() {
        return listResult;
      },
      async getById() {
        return getByIdResult;
      },
      async create({ input }) {
        calls.create.push(input);
        return createResult ?? {
          id: 'generated-id',
          createdAt: '2026-03-24T00:00:00.000Z',
          ...input
        };
      },
      async update({ id, patch }) {
        calls.update.push({ id, patch });
        return updateResult;
      },
      async delete({ id }) {
        calls.delete.push(id);
        return deleteResult;
      }
    }
  };
};

test('LeaderboardService.listScores 会按业务规则排序并附加 rank', async () => {
  const { repository } = createRepositoryDouble({
    listResult: [
      {
        id: '2',
        playerName: 'Bravo',
        score: 90,
        durationMs: 6000,
        createdAt: '2026-03-24T10:00:02.000Z'
      },
      {
        id: '1',
        playerName: 'Alpha',
        score: 120,
        durationMs: 8000,
        createdAt: '2026-03-24T10:00:01.000Z'
      },
      {
        id: '3',
        playerName: 'Charlie',
        score: 120,
        durationMs: 7500,
        createdAt: '2026-03-24T10:00:03.000Z'
      }
    ]
  });

  const service = new LeaderboardService({ repository });
  const scores = await service.listScores({ limit: 2 });

  assert.equal(scores.length, 2);
  assert.equal(scores[0].playerName, 'Charlie');
  assert.equal(scores[0].rank, 1);
  assert.equal(scores[1].playerName, 'Alpha');
  assert.equal(scores[1].rank, 2);
});

test('LeaderboardService.createScore 会校验并保存成绩', async () => {
  const { repository, calls } = createRepositoryDouble();
  const service = new LeaderboardService({ repository });

  const createdRecord = await service.createScore({
    input: {
      playerName: '  Arisa  ',
      score: 50,
      durationMs: 12345
    }
  });

  assert.equal(createdRecord.playerName, 'Arisa');
  assert.deepEqual(calls.create[0], {
    playerName: 'Arisa',
    score: 50,
    durationMs: 12345
  });
});

test('LeaderboardService.createScore 在非法参数下会抛出校验错误', async () => {
  const { repository } = createRepositoryDouble();
  const service = new LeaderboardService({ repository });

  await assert.rejects(
    () =>
      service.createScore({
        input: {
          playerName: 'Arisa',
          score: -1,
          durationMs: 1000
        }
      }),
    (error) => {
      assert.ok(error instanceof HttpError);
      assert.equal(error.code, 'VALIDATION_ERROR');
      return true;
    }
  );
});

test('LeaderboardService.updateScore 在记录不存在时会抛出 NOT_FOUND', async () => {
  const { repository } = createRepositoryDouble();
  const service = new LeaderboardService({ repository });

  await assert.rejects(
    () =>
      service.updateScore({
        id: 'missing-id',
        input: {
          playerName: 'NewName'
        }
      }),
    (error) => {
      assert.ok(error instanceof HttpError);
      assert.equal(error.code, 'NOT_FOUND');
      return true;
    }
  );
});
