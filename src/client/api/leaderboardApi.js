// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 5 节“前端模块”和第 7 节“API 设计”。
const parseResponse = async ({ response }) => {
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload?.error?.message ?? '请求失败。');
  }

  return payload.data;
};

export const listScores = async ({ limit = 8 } = {}) => {
  const response = await fetch(`/api/scores?limit=${encodeURIComponent(limit)}`);
  return parseResponse({ response });
};

export const createScore = async ({ input }) => {
  const response = await fetch('/api/scores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  return parseResponse({ response });
};
