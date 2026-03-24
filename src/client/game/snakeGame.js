// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 3 节“核心功能点”和第 8 节“关键规则”。
import {
  DIRECTIONS,
  FOODS_PER_LEVEL,
  GAME_STATUS,
  INITIAL_SNAKE,
  INITIAL_SPEED_MS,
  MIN_SPEED_MS,
  SCORE_PER_FOOD,
  SPEED_STEP_MS
} from './constants.js';

const clonePoint = ({ point }) => ({ x: point.x, y: point.y });
const cloneSnake = ({ snake }) => snake.map((point) => clonePoint({ point }));
const isSamePoint = ({ left, right }) => left.x === right.x && left.y === right.y;

const isOppositeDirection = ({ current, next }) =>
  current.x + next.x === 0 && current.y + next.y === 0;

const isOutsideBoard = ({ point, boardSize }) =>
  point.x < 0 || point.y < 0 || point.x >= boardSize || point.y >= boardSize;

const getLevel = ({ foodsEaten }) => Math.floor(foodsEaten / FOODS_PER_LEVEL) + 1;

const getSpeed = ({ foodsEaten }) =>
  Math.max(MIN_SPEED_MS, INITIAL_SPEED_MS - Math.floor(foodsEaten / FOODS_PER_LEVEL) * SPEED_STEP_MS);

const createFood = ({ boardSize, snake, random }) => {
  const occupiedKeys = new Set(snake.map((point) => `${point.x}:${point.y}`));

  for (let attempt = 0; attempt < boardSize * boardSize; attempt += 1) {
    const candidate = {
      x: Math.floor(random() * boardSize),
      y: Math.floor(random() * boardSize)
    };

    if (!occupiedKeys.has(`${candidate.x}:${candidate.y}`)) {
      return candidate;
    }
  }

  throw new Error('无法在棋盘上生成新的食物。');
};

const createInitialState = ({ boardSize, random, bestScore }) => {
  const snake = cloneSnake({ snake: INITIAL_SNAKE });

  return {
    boardSize,
    snake,
    food: createFood({ boardSize, snake, random }),
    direction: DIRECTIONS.right,
    queuedDirection: DIRECTIONS.right,
    score: 0,
    foodsEaten: 0,
    level: 1,
    speedMs: INITIAL_SPEED_MS,
    status: GAME_STATUS.IDLE,
    durationMs: 0,
    startedAt: 0,
    bestScore
  };
};

const snapshotState = ({ state }) => ({
  ...state,
  snake: cloneSnake({ snake: state.snake }),
  food: clonePoint({ point: state.food })
});

const advanceState = ({ state, random, now }) => {
  const nextHead = {
    x: state.snake[0].x + state.queuedDirection.x,
    y: state.snake[0].y + state.queuedDirection.y
  };

  const ateFood = isSamePoint({ left: nextHead, right: state.food });
  const nextSnake = ateFood
    ? [nextHead, ...state.snake]
    : [nextHead, ...state.snake.slice(0, -1)];

  const hitSelf = nextSnake.slice(1).some((point) => isSamePoint({ left: point, right: nextHead }));

  if (isOutsideBoard({ point: nextHead, boardSize: state.boardSize }) || hitSelf) {
    return {
      ...state,
      snake: nextSnake,
      direction: state.queuedDirection,
      queuedDirection: state.queuedDirection,
      status: GAME_STATUS.GAME_OVER,
      durationMs: now - state.startedAt
    };
  }

  const foodsEaten = state.foodsEaten + (ateFood ? 1 : 0);

  return {
    ...state,
    snake: nextSnake,
    direction: state.queuedDirection,
    queuedDirection: state.queuedDirection,
    food: ateFood
      ? createFood({ boardSize: state.boardSize, snake: nextSnake, random })
      : state.food,
    foodsEaten,
    level: getLevel({ foodsEaten }),
    score: state.score + (ateFood ? SCORE_PER_FOOD : 0),
    speedMs: getSpeed({ foodsEaten }),
    durationMs: now - state.startedAt
  };
};

export class SnakeGame {
  constructor({
    boardSize,
    random = Math.random,
    now = () => Date.now(),
    onStateChange = () => {},
    onGameOver = () => {},
    initialBestScore = 0
  }) {
    this.boardSize = boardSize;
    this.random = random;
    this.now = now;
    this.onStateChange = onStateChange;
    this.onGameOver = onGameOver;
    this.bestScore = initialBestScore;
    this.timer = undefined;
    this.state = createInitialState({
      boardSize: this.boardSize,
      random: this.random,
      bestScore: this.bestScore
    });
    this._emitState();
  }

  start() {
    if (this.state.status === GAME_STATUS.RUNNING) {
      return;
    }

    if (this.state.status === GAME_STATUS.PAUSED) {
      this.resume();
      return;
    }

    if (this.state.status === GAME_STATUS.GAME_OVER) {
      this.restart();
      return;
    }

    this.state = {
      ...this.state,
      status: GAME_STATUS.RUNNING,
      startedAt: this.now(),
      durationMs: 0
    };

    this._emitState();
    this._scheduleNextTick();
  }

  pause() {
    if (this.state.status !== GAME_STATUS.RUNNING) {
      return;
    }

    this._clearTimer();
    this.state = {
      ...this.state,
      status: GAME_STATUS.PAUSED,
      durationMs: this.now() - this.state.startedAt
    };
    this._emitState();
  }

  resume() {
    if (this.state.status !== GAME_STATUS.PAUSED) {
      return;
    }

    this.state = {
      ...this.state,
      status: GAME_STATUS.RUNNING,
      startedAt: this.now() - this.state.durationMs
    };

    this._emitState();
    this._scheduleNextTick();
  }

  togglePause() {
    if (this.state.status === GAME_STATUS.RUNNING) {
      this.pause();
      return;
    }

    if (this.state.status === GAME_STATUS.PAUSED) {
      this.resume();
    }
  }

  restart() {
    this._clearTimer();
    this.bestScore = Math.max(this.bestScore, this.state.score);
    this.state = {
      ...createInitialState({
        boardSize: this.boardSize,
        random: this.random,
        bestScore: this.bestScore
      }),
      status: GAME_STATUS.RUNNING,
      startedAt: this.now()
    };

    this._emitState();
    this._scheduleNextTick();
  }

  setDirection(nextDirection) {
    if (!nextDirection || this.state.status === GAME_STATUS.GAME_OVER) {
      return;
    }

    if (isOppositeDirection({ current: this.state.queuedDirection, next: nextDirection })) {
      return;
    }

    this.state = {
      ...this.state,
      queuedDirection: nextDirection
    };
  }

  getState() {
    return snapshotState({
      state: {
        ...this.state,
        bestScore: this.bestScore
      }
    });
  }

  _tick() {
    if (this.state.status !== GAME_STATUS.RUNNING) {
      return;
    }

    this.state = advanceState({
      state: this.state,
      random: this.random,
      now: this.now()
    });

    this.bestScore = Math.max(this.bestScore, this.state.score);
    this.state = {
      ...this.state,
      bestScore: this.bestScore
    };

    this._emitState();

    if (this.state.status === GAME_STATUS.GAME_OVER) {
      this._clearTimer();
      this.onGameOver(this.getState());
      return;
    }

    this._scheduleNextTick();
  }

  _scheduleNextTick() {
    this._clearTimer();
    this.timer = setTimeout(() => this._tick(), this.state.speedMs);
  }

  _clearTimer() {
    if (!this.timer) {
      return;
    }

    clearTimeout(this.timer);
    this.timer = undefined;
  }

  _emitState() {
    this.onStateChange(this.getState());
  }
}
