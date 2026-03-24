<!-- 备注：对应培训阶段 8（文档完善），关联设计文档第 4 节“技术选型”和第 9 节“非功能要求”。 -->

# Snake Sprint

Snake Sprint 是一个用于 26AI 培训作业的完整示例项目。它包含一个基于 Canvas 的贪吃蛇小游戏，以及一个支持排行榜 CRUD 的后端 API，覆盖设计、编码、测试、构建、部署与容器化交付物。

## 技术栈

- Node.js 25+
- 原生 ES Modules
- HTML5 Canvas
- Node HTTP Server
- 文件持久化排行榜
- `node:test`

## 快速开始

```bash
npm run build
npm test
./scripts/start.sh
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

## 目录结构

```text
.
├── docs
├── schema
├── scripts
├── src
│   ├── client
│   └── server
├── tests
└── Dockerfile
```

## 主要命令

```bash
npm run dev
npm run build
npm test
./scripts/start.sh
docker compose up --build
```

## 文档索引

- 设计文档：[docs/DESIGN.md](/Users/kouriarisa/code_space/26ai-demo-project/docs/DESIGN.md)
- 环境文档：[docs/ENVIRONMENT.md](/Users/kouriarisa/code_space/26ai-demo-project/docs/ENVIRONMENT.md)
- API 文档：[docs/API.md](/Users/kouriarisa/code_space/26ai-demo-project/docs/API.md)
- 测试报告：[docs/TEST-REPORT.md](/Users/kouriarisa/code_space/26ai-demo-project/docs/TEST-REPORT.md)
- 重构说明：[docs/REFACTOR.md](/Users/kouriarisa/code_space/26ai-demo-project/docs/REFACTOR.md)
- 优化说明：[docs/OPTIMIZATION.md](/Users/kouriarisa/code_space/26ai-demo-project/docs/OPTIMIZATION.md)
- 部署文档：[docs/DEPLOY.md](/Users/kouriarisa/code_space/26ai-demo-project/docs/DEPLOY.md)
- 排障文档：[docs/TROUBLESHOOTING.md](/Users/kouriarisa/code_space/26ai-demo-project/docs/TROUBLESHOOTING.md)
