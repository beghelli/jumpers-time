import * as Phaser from 'phaser';
import Intro from './scenes/intro';
import StageSelection from './scenes/stageSelection';
import Roll from './scenes/roll';
import Paused from './scenes/paused';

const intro = new Intro();
const stageSelection = new StageSelection();
const roll = new Roll();
const paused = new Paused();

const config = {
    type: Phaser.CANVAS,
    backgroundColor: '#d8d700',
    width: 800,
    height: 600,
	physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 800 },
              debug: false
          }
      },
    scene: [
		intro, stageSelection, roll, paused
	]
};

new Phaser.Game(config);
