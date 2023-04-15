import * as Phaser from 'phaser';
import Intro from './scenes/intro';
import Roll from './scenes/roll';

const intro = new Intro();
const roll = new Roll();

const config = {
    type: Phaser.CANVAS,
    backgroundColor: '#d8d700',
    width: 800,
    height: 600,
	physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 600 },
              debug: false
          }
      },
    scene: [
		intro, roll
	]
};

new Phaser.Game(config);
