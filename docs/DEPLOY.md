<!-- 备注：对应培训阶段 9（容器化与部署），关联设计文档第 9 节“非功能要求”。 -->

# 部署文档

## 1. 本地启动

```bash
npm run build
./scripts/start.sh
```

默认端口为 `3000`，页面地址为 [http://localhost:3000](http://localhost:3000)。

## 2. 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `HOST` | `127.0.0.1` | 本地监听地址，容器内应设置为 `0.0.0.0` |
| `PORT` | `3000` | HTTP 监听端口 |
| `NODE_ENV` | `production` | 运行环境 |
| `DATA_DIR` | `./data` | 成绩数据目录 |
| `DATA_FILE` | `./data/leaderboard.json` | 成绩数据文件 |

## 3. Docker 构建

```bash
docker build -t snake-sprint:latest .
docker run --rm -p 3000:3000 snake-sprint:latest
```

## 4. Docker Compose 启动

```bash
docker compose up --build
```

启动后通过 [http://localhost:8080](http://localhost:8080) 访问。

## 5. 健康检查

- 应用健康检查地址：`/api/health`
- Dockerfile 内置健康检查
- `docker-compose.yml` 中的 `proxy` 服务会等待 `app` 健康后再启动
