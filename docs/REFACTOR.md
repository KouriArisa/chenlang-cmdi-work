<!-- 备注：对应培训阶段 6（代码重构），关联设计文档第 5 节“架构设计”。 -->

# 重构说明

## 本次重构点

- 将后端拆分为 `Controller-Service-Repository` 三层
- 将文件持久化实现封装在 `FileLeaderboardRepository`
- 将业务排序规则下沉到 `LeaderboardService`
- 将统一响应与异常类型抽离到 `shared/`
- 将前端输入、渲染、游戏循环拆分为 `main.js`、`keyboard.js`、`snakeGame.js`

## 面向接口与依赖注入

- `LeaderboardService` 依赖仓储抽象能力，不直接依赖文件系统
- `FileLeaderboardRepository` 通过构造函数注入 `createId` 与 `now`
- `HealthController` 通过注入时钟函数获得当前时间

## 重构收益

- 便于替换持久化实现，例如未来改成 SQLite 或 PostgreSQL
- 单元测试可以直接 Mock Repository，减少外部依赖
- 业务规则、HTTP 细节、存储细节边界更清晰
