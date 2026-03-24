-- 备注：对应培训阶段 1（需求理解与方案设计），关联设计文档第 6 节“数据模型”。
CREATE TABLE IF NOT EXISTS score_records (
  id TEXT PRIMARY KEY,
  player_name VARCHAR(24) NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0),
  duration_ms INTEGER NOT NULL CHECK (duration_ms >= 0),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_score_records_rank
  ON score_records (score DESC, duration_ms ASC, created_at ASC);
