// 备注：对应培训阶段 6（代码重构），关联设计文档第 5 节“架构设计”中的依赖注入与分层。
import { createHealthController } from '../controllers/healthController.js';
import { createLeaderboardController } from '../controllers/leaderboardController.js';
import { FileLeaderboardRepository } from '../repositories/fileLeaderboardRepository.js';
import { LeaderboardService } from '../services/leaderboardService.js';

export const createDependencies = ({
  dataFile,
  createId,
  recordNow,
  healthNow
}) => {
  const repository = new FileLeaderboardRepository({
    filePath: dataFile,
    createId,
    now: recordNow
  });

  const leaderboardService = new LeaderboardService({
    repository
  });

  return Object.freeze({
    leaderboardController: createLeaderboardController({
      service: leaderboardService
    }),
    healthController: createHealthController({
      now: healthNow ?? (() => new Date().toISOString())
    })
  });
};
