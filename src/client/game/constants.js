// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 8 节“关键规则”中的棋盘、分数与速度规则。
export const BOARD_SIZE = 20;
export const CELL_SIZE = 24;
export const INITIAL_SPEED_MS = 180;
export const MIN_SPEED_MS = 80;
export const SPEED_STEP_MS = 15;
export const SCORE_PER_FOOD = 10;
export const FOODS_PER_LEVEL = 5;

export const DIRECTIONS = Object.freeze({
  up: Object.freeze({ x: 0, y: -1, name: 'up' }),
  down: Object.freeze({ x: 0, y: 1, name: 'down' }),
  left: Object.freeze({ x: -1, y: 0, name: 'left' }),
  right: Object.freeze({ x: 1, y: 0, name: 'right' })
});

export const GAME_STATUS = Object.freeze({
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
});

export const INITIAL_SNAKE = Object.freeze([
  Object.freeze({ x: 8, y: 10 }),
  Object.freeze({ x: 7, y: 10 }),
  Object.freeze({ x: 6, y: 10 })
]);
