import * as Phaser from 'phaser';
import BlinkText from '../entities/blinkText';

export default class Intro extends Phaser.Scene
{
	constructor()
	{
		super('intro');
	}

	preload()
	{
		this.load.image('logo', 'assets/logo.png');
		this.load.audio('introMusic', ['assets/intro.mp3']);
	}

	create()
	{
		const music = this.sound.add('introMusic', { loop: true });
		music.play();

		const centerX = this.sys.game.canvas.width / 2;

		this.add.image(centerX, 300, 'logo');
		new BlinkText(this, centerX, 450, 'Press ENTER to start!', 250);

		this.input.keyboard.on('keydown-ENTER', function()
		{
			this.scene.start('showStageSelection');
		}, this);
	}

}
