# 备注：对应培训阶段 9（容器化与部署），关联设计文档第 9 节“非功能要求”。
FROM node:25-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY scripts ./scripts
COPY src ./src

RUN node ./scripts/build.mjs

FROM node:25-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV DATA_DIR=/app/data
ENV DATA_FILE=/app/data/leaderboard.json

COPY package.json ./
COPY scripts ./scripts
COPY --from=builder /app/dist ./dist

RUN chmod +x ./scripts/start.sh && mkdir -p /app/data

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/api/health').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1))"

CMD ["./scripts/start.sh"]
