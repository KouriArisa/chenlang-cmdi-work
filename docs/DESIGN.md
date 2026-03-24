<!-- 备注：对应培训阶段 1（需求理解与方案设计），本文件即设计文档总览。 -->

# Snake Sprint 设计文档

## 1. 项目目标

构建一个可直接运行的贪吃蛇小游戏，并补齐培训作业要求的工程化交付物。项目分为两个子域：

- 游戏子域：负责渲染棋盘、处理键盘输入、推进蛇移动、判定得分与失败。
- 排行榜子域：负责保存成绩记录，并提供标准 CRUD API。

## 2. 业务场景

玩家在浏览器中启动贪吃蛇，使用方向键或 `W/A/S/D` 控制蛇移动。游戏结束后，玩家可录入昵称并提交成绩，系统保存排行榜记录，支持查询、查看单条、修改昵称、删除成绩。

## 3. 核心功能点

- 开始、暂停、重新开始游戏
- 棋盘渲染、食物生成、碰撞检测、速度升级
- 展示当前分数、等级、最佳成绩、运行状态
- 提交成绩到后端排行榜
- 排行榜 CRUD API
- 统一返回结构与全局错误处理
- 文件持久化成绩记录
- 单元测试与应用级接口验证

## 4. 技术选型

### 前端

- HTML5 Canvas：绘制蛇、食物和棋盘
- 原生 JavaScript：降低依赖，方便在当前环境中直接构建和运行
- CSS：实现单页游戏界面

### 后端

- Node.js 原生 HTTP Server：满足 API 与静态资源服务
- ES Modules：模块边界清晰，便于分层
- 文件仓储：使用 `data/leaderboard.json` 保存成绩

## 5. 架构设计

### 分层结构

- Controller：处理 HTTP 请求与响应
- Service：承载排行榜业务规则、排序规则、参数校验入口
- Repository：负责成绩记录读写

### 前端模块

- `main.js`：UI 绑定、画布绘制、表单交互
- `game/snakeGame.js`：核心游戏循环与状态机
- `api/leaderboardApi.js`：封装排行榜请求

## 6. 数据模型

当前运行时采用 JSON 文件存储，逻辑模型如下：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 成绩记录唯一标识 |
| `playerName` | `string` | 玩家昵称，1-24 个字符 |
| `score` | `number` | 得分，非负整数 |
| `durationMs` | `number` | 本局耗时，毫秒 |
| `createdAt` | `string` | ISO 8601 时间 |

关系型映射脚本见 [schema/leaderboard.sql](/Users/kouriarisa/code_space/26ai-demo-project/schema/leaderboard.sql)。

## 7. API 设计

- `GET /api/health`：健康检查
- `GET /api/scores?limit=10`：获取排行榜
- `GET /api/scores/:id`：查询单条成绩
- `POST /api/scores`：新增成绩
- `PATCH /api/scores/:id`：更新玩家昵称
- `DELETE /api/scores/:id`：删除成绩

统一成功响应：

```json
{
  "success": true,
  "data": {}
}
```

统一失败响应：

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "playerName 不能为空。"
  }
}
```

## 8. 关键规则

- 撞墙或咬到自己即失败
- 每吃到 5 个食物提升 1 级
- 分数按每个食物 `10` 分计算
- 排行榜排序：分数降序，耗时升序，创建时间升序

## 9. 非功能要求

- 无额外第三方依赖即可运行构建与测试
- 错误必须显式返回，不做静默兜底
- Docker 镜像使用多阶段构建
- 启动脚本自动准备运行环境变量与数据目录
