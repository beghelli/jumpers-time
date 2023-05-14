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
		const text = new BlinkText(this, centerX, 450, 'Click / Tap here to start!', 250);
		text.setInteractive();
		text.on('pointerdown', () => { this.startSelectStageScene(); }, this);
		this.input.keyboard.on('keydown-ENTER', () => {	this.startSelectStageScene(); }, this);
	}

	startSelectStageScene()
	{
		this.scene.start('showStageSelection');
	}

}
