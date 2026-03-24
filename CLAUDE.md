<!-- 备注：对应培训阶段 2（项目初始化与环境配置），关联设计文档第 4 节“技术选型”和第 9 节“非功能要求”。 -->

# Snake Sprint Workspace Guide

## Stack

- Node.js 25+
- Native ESM
- HTML5 Canvas frontend
- File-based leaderboard persistence

## Development Rules

- Keep controller, service, and repository responsibilities separate.
- Use explicit errors instead of fallback branches.
- Prefer small functions, named constants, and immutable return values.
- Verify every meaningful change with `npm run build` and `npm test`.

## Delivery Files

- Design: `docs/DESIGN.md`
- API: `docs/API.md`
- Deployment: `docs/DEPLOY.md`
- Troubleshooting: `docs/TROUBLESHOOTING.md`
