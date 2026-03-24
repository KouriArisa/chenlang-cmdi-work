// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 6 节“数据模型”和第 8 节“关键规则”。
const assertScoreRecord = ({ record }) => {
  if (typeof record.id !== 'string' || !record.id) {
    throw new Error('成绩记录缺少有效的 id。');
  }

  if (typeof record.playerName !== 'string' || !record.playerName) {
    throw new Error('成绩记录缺少有效的 playerName。');
  }

  if (!Number.isInteger(record.score) || record.score < 0) {
    throw new Error('成绩记录缺少有效的 score。');
  }

  if (!Number.isInteger(record.durationMs) || record.durationMs < 0) {
    throw new Error('成绩记录缺少有效的 durationMs。');
  }

  if (typeof record.createdAt !== 'string' || !record.createdAt) {
    throw new Error('成绩记录缺少有效的 createdAt。');
  }
};

export const createScoreRecord = ({ record }) => {
  assertScoreRecord({ record });

  return Object.freeze({
    id: record.id,
    playerName: record.playerName,
    score: record.score,
    durationMs: record.durationMs,
    createdAt: record.createdAt
  });
};

export const compareScoreRecords = (leftRecord, rightRecord) => {
  if (leftRecord.score !== rightRecord.score) {
    return rightRecord.score - leftRecord.score;
  }

  if (leftRecord.durationMs !== rightRecord.durationMs) {
    return leftRecord.durationMs - rightRecord.durationMs;
  }

  return leftRecord.createdAt.localeCompare(rightRecord.createdAt);
};
