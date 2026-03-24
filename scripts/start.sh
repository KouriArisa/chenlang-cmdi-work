#!/bin/sh
# 备注：对应培训阶段 9（容器化与部署），关联设计文档第 9 节“非功能要求”中的启动脚本要求。
set -eu

# 解析项目根目录，确保无论从哪个工作目录执行脚本都能定位到 dist 与 data。
PROJECT_ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)

# 允许通过环境变量覆盖运行参数，未提供时使用项目默认值。
PORT="${PORT:-3000}"
HOST="${HOST:-127.0.0.1}"
NODE_ENV="${NODE_ENV:-production}"
DATA_DIR="${DATA_DIR:-$PROJECT_ROOT/data}"
DATA_FILE="${DATA_FILE:-$DATA_DIR/leaderboard.json}"

# 启动前确保数据目录存在，避免后续文件写入失败。
mkdir -p "$DATA_DIR"

# 首次启动时初始化排行榜数据文件，保持服务依赖的数据结构完整。
if [ ! -f "$DATA_FILE" ]; then
  printf '{\n  "scores": []\n}\n' > "$DATA_FILE"
fi

# 导出给 Node 服务进程读取的运行环境变量。
export PORT
export HOST
export NODE_ENV
export DATA_FILE

# 使用 exec 替换当前 shell 进程，让 Node 成为容器或进程管理器跟踪的主进程。
exec node "$PROJECT_ROOT/dist/server/index.js"
