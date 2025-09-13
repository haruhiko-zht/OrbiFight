import Phaser from 'phaser';
import { ReplayScene } from './scenes/ReplayScene';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: '#1e1e1e',
  parent: 'phaser-root',
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
  scene: [ReplayScene],
});

export default game;
