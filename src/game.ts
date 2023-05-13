import * as Phaser from 'phaser';
import Intro from './scenes/intro';
import ShowStageSelection from './scenes/showStageSelection';
import Roll from './scenes/roll';
import Paused from './scenes/paused';
import ShowStageResult from './scenes/showStageResult';

const intro = new Intro();
const stageSelection = new ShowStageSelection();
const roll = new Roll();
const paused = new Paused();
const showStageResult = new ShowStageResult();

const config = {
    type: Phaser.WEBGL,
    backgroundColor: '#d8d700',
	physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 800 },
              debug: false
          }
      },
    scene: [
		intro, stageSelection, roll, paused, showStageResult
	],
	scale             : {
		mode            : Phaser.Scale.FIT,
		autoCenter      : Phaser.Scale.CENTER_BOTH,
		width           : 800,
		height          : 600,
	},
};

new Phaser.Game(config);
