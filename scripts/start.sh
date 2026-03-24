#!/bin/sh
# 备注：对应培训阶段 9（容器化与部署），关联设计文档第 9 节“非功能要求”中的启动脚本要求。
set -eu

PROJECT_ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
PORT="${PORT:-3000}"
HOST="${HOST:-127.0.0.1}"
NODE_ENV="${NODE_ENV:-production}"
DATA_DIR="${DATA_DIR:-$PROJECT_ROOT/data}"
DATA_FILE="${DATA_FILE:-$DATA_DIR/leaderboard.json}"

mkdir -p "$DATA_DIR"

if [ ! -f "$DATA_FILE" ]; then
  printf '{\n  "scores": []\n}\n' > "$DATA_FILE"
fi

export PORT
export HOST
export NODE_ENV
export DATA_FILE

exec node "$PROJECT_ROOT/dist/server/index.js"
