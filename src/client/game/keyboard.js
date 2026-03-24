// 备注：对应培训阶段 3（核心功能编码），关联设计文档第 3 节“核心功能点”中的键盘控制。
import { DIRECTIONS } from './constants.js';

const KEY_TO_DIRECTION = new Map([
  ['ArrowUp', DIRECTIONS.up],
  ['ArrowDown', DIRECTIONS.down],
  ['ArrowLeft', DIRECTIONS.left],
  ['ArrowRight', DIRECTIONS.right],
  ['w', DIRECTIONS.up],
  ['s', DIRECTIONS.down],
  ['a', DIRECTIONS.left],
  ['d', DIRECTIONS.right]
]);

export const bindKeyboardControls = ({
  target,
  onDirection,
  onTogglePause,
  onRestart
}) => {
  const listener = (event) => {
    const direction = KEY_TO_DIRECTION.get(event.key);

    if (direction) {
      event.preventDefault();
      onDirection(direction);
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();
      onTogglePause();
      return;
    }

    if (event.key.toLowerCase() === 'r') {
      event.preventDefault();
      onRestart();
    }
  };

  target.addEventListener('keydown', listener);
  return () => target.removeEventListener('keydown', listener);
};
