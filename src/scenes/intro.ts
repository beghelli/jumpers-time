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

    	this.add.image(400, 300, 'logo');
		new BlinkText(this, this.sys.game.canvas.width / 2, 450, 'Press ENTER to start!', 250);

		this.input.keyboard.on('keydown-ENTER', function()
		{
			this.scene.start('showStageSelection');
		}, this);
    }

}
