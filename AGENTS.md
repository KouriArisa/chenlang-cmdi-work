<!-- 备注：对应培训阶段 2（项目初始化与环境配置），关联设计文档第 4 节“技术选型”和第 9 节“非功能要求”。 -->

# 项目代理约定

## 技术栈

- Node.js 25+
- 原生 ES Modules
- 前端：HTML5 Canvas + 原生 JavaScript + CSS
- 后端：Node HTTP Server
- 持久化：本地 JSON 文件
- 测试：`node:test`

## 编码规范

- 遵循 Controller-Service-Repository 分层
- 统一返回结构：`{ success, data }` 或 `{ success, error }`
- 函数保持单一职责，超过 50 行立即拆分
- 禁止静默降级，错误必须显式暴露
- 默认使用不可变返回值，不直接修改函数参数

## 输出约定

- 设计文档放在 `docs/` 与 `schema/`
- 部署与排障文档放在 `docs/`
- 运行产物输出到 `dist/`
- 本地排行榜数据存储在 `data/leaderboard.json`
