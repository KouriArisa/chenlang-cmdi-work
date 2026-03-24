// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 3 节“核心功能点”和第 5 节“前端模块”。
import { createScore, listScores } from './api/leaderboardApi.js';
import { BOARD_SIZE, CELL_SIZE, GAME_STATUS } from './game/constants.js';
import { bindKeyboardControls } from './game/keyboard.js';
import { SnakeGame } from './game/snakeGame.js';

const BEST_SCORE_KEY = 'snake-sprint-best-score';
const LEADERBOARD_LIMIT = 8;

const canvas = document.querySelector('#game-board');
const context = canvas.getContext('2d');

const statusElement = document.querySelector('#game-status');
const scoreElement = document.querySelector('#game-score');
const levelElement = document.querySelector('#game-level');
const bestScoreElement = document.querySelector('#best-score');
const durationElement = document.querySelector('#game-duration');
const speedElement = document.querySelector('#game-speed');
const messageBox = document.querySelector('#message-box');

const startButton = document.querySelector('#start-button');
const pauseButton = document.querySelector('#pause-button');
const restartButton = document.querySelector('#restart-button');
const submitButton = document.querySelector('#submit-score');
const scoreForm = document.querySelector('#score-form');
const nameInput = document.querySelector('#player-name');

const leaderboardList = document.querySelector('#leaderboard-list');
const leaderboardEmpty = document.querySelector('#leaderboard-empty');

let isSubmitting = false;

const readBestScore = () => Number(localStorage.getItem(BEST_SCORE_KEY) ?? 0) || 0;

const writeBestScore = ({ value }) => {
  localStorage.setItem(BEST_SCORE_KEY, String(value));
};

const formatDuration = ({ value }) => `${(value / 1000).toFixed(1)}s`;

const getStatusLabel = ({ status }) => {
  if (status === GAME_STATUS.RUNNING) {
    return '进行中';
  }

  if (status === GAME_STATUS.PAUSED) {
    return '已暂停';
  }

  if (status === GAME_STATUS.GAME_OVER) {
    return '已结束';
  }

  return '待机';
};

const drawCell = ({ x, y, fillStyle, radius = 6 }) => {
  const pixelX = x * CELL_SIZE;
  const pixelY = y * CELL_SIZE;

  context.fillStyle = fillStyle;
  context.beginPath();
  context.roundRect(pixelX + 1, pixelY + 1, CELL_SIZE - 2, CELL_SIZE - 2, radius);
  context.fill();
};

const drawBackground = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#172629';
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      context.fillStyle = (x + y) % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)';
      context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
};

const drawOverlay = ({ text }) => {
  context.fillStyle = 'rgba(10, 15, 16, 0.48)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#fff';
  context.font = '700 32px "Avenir Next", "Trebuchet MS", sans-serif';
  context.textAlign = 'center';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
};

const renderBoard = ({ state }) => {
  drawBackground();
  drawCell({ x: state.food.x, y: state.food.y, fillStyle: '#ff8057', radius: 10 });

  state.snake.forEach((segment, index) => {
    drawCell({
      x: segment.x,
      y: segment.y,
      fillStyle: index === 0 ? '#9cf29a' : '#48b77a',
      radius: index === 0 ? 10 : 6
    });
  });

  if (state.status === GAME_STATUS.IDLE) {
    drawOverlay({ text: '按开始键启动' });
  }

  if (state.status === GAME_STATUS.PAUSED) {
    drawOverlay({ text: '已暂停' });
  }

  if (state.status === GAME_STATUS.GAME_OVER) {
    drawOverlay({ text: '游戏结束' });
  }
};

const renderHud = ({ state }) => {
  statusElement.textContent = getStatusLabel({ status: state.status });
  scoreElement.textContent = String(state.score);
  levelElement.textContent = String(state.level);
  bestScoreElement.textContent = String(state.bestScore);
  durationElement.textContent = formatDuration({ value: state.durationMs });
  speedElement.textContent = `${state.speedMs}ms`;
};

const renderLeaderboard = ({ scores }) => {
  leaderboardList.textContent = '';
  leaderboardEmpty.hidden = scores.length > 0;

  const fragment = document.createDocumentFragment();

  scores.forEach((record) => {
    const item = document.createElement('li');
    item.className = 'leaderboard-item';
    item.innerHTML = `
      <span class="leaderboard-rank">#${record.rank}</span>
      <div>
        <div class="leaderboard-name">${record.playerName}</div>
        <div class="leaderboard-meta">${formatDuration({ value: record.durationMs })} · ${new Date(record.createdAt).toLocaleString()}</div>
      </div>
      <span class="leaderboard-score">${record.score}</span>
    `;
    fragment.append(item);
  });

  leaderboardList.append(fragment);
};

const showMessage = ({ text, tone }) => {
  messageBox.textContent = text;
  messageBox.dataset.tone = tone;
};

const updatePauseButton = ({ status }) => {
  pauseButton.textContent = status === GAME_STATUS.PAUSED ? '继续' : '暂停';
};

const updateSubmitButton = ({ state }) => {
  submitButton.disabled =
    isSubmitting || state.status !== GAME_STATUS.GAME_OVER || state.score === 0;
};

const loadLeaderboard = async () => {
  try {
    const scores = await listScores({ limit: LEADERBOARD_LIMIT });
    renderLeaderboard({ scores });
  } catch (error) {
    showMessage({ text: error.message, tone: 'error' });
  }
};

const persistBestScore = ({ bestScore }) => {
  if (bestScore > readBestScore()) {
    writeBestScore({ value: bestScore });
  }
};

const handleStateChange = ({ state }) => {
  persistBestScore({ bestScore: state.bestScore });
  renderBoard({ state });
  renderHud({ state });
  updatePauseButton({ status: state.status });
  updateSubmitButton({ state });
};

const handleGameOver = ({ state }) => {
  persistBestScore({ bestScore: state.score });
  showMessage({
    text: '游戏结束，输入昵称后可以提交本局成绩。',
    tone: 'warning'
  });
  updateSubmitButton({ state });
};

const game = new SnakeGame({
  boardSize: BOARD_SIZE,
  initialBestScore: readBestScore(),
  onStateChange: (state) => handleStateChange({ state }),
  onGameOver: (state) => handleGameOver({ state })
});

const submitScore = async (event) => {
  event.preventDefault();

  const state = game.getState();

  if (state.status !== GAME_STATUS.GAME_OVER || state.score === 0) {
    showMessage({
      text: '只有在游戏结束且得分大于 0 时才能提交成绩。',
      tone: 'warning'
    });
    return;
  }

  isSubmitting = true;
  updateSubmitButton({ state });

  try {
    await createScore({
      input: {
        playerName: nameInput.value,
        score: state.score,
        durationMs: Math.round(state.durationMs)
      }
    });

    nameInput.value = '';
    showMessage({ text: '成绩提交成功，排行榜已刷新。', tone: 'success' });
    await loadLeaderboard();
  } catch (error) {
    showMessage({ text: error.message, tone: 'error' });
  } finally {
    isSubmitting = false;
    updateSubmitButton({ state: game.getState() });
  }
};

startButton.addEventListener('click', () => {
  showMessage({ text: '游戏进行中，祝你好运。', tone: 'info' });
  game.start();
});

pauseButton.addEventListener('click', () => {
  game.togglePause();
  const state = game.getState();
  const message = state.status === GAME_STATUS.PAUSED ? '游戏已暂停。' : '游戏已恢复。';
  showMessage({ text: message, tone: 'info' });
});

restartButton.addEventListener('click', () => {
  showMessage({ text: '已重新开始，刷新你的纪录吧。', tone: 'info' });
  game.restart();
});

scoreForm.addEventListener('submit', submitScore);

bindKeyboardControls({
  target: window,
  onDirection: (direction) => {
    game.setDirection(direction);

    if (game.getState().status === GAME_STATUS.IDLE) {
      game.start();
    }
  },
  onTogglePause: () => {
    game.togglePause();
    updatePauseButton({ status: game.getState().status });
  },
  onRestart: () => game.restart()
});

loadLeaderboard();
handleStateChange({ state: game.getState() });
