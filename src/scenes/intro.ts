import * as Phaser from 'phaser';

export default class Intro extends Phaser.Scene
{
    constructor()
    {
        super('intro');
    }

    preload()
    {
        this.load.image('logo', 'assets/logo.png');
    }

    create()
    {
    	this.add.image(400, 300, 'logo');
		let text = this.add.text(300, 450, 'Press ENTER to start!');
		text.alpha = 0;

		this.tweens.add({
			targets: text,
			duration: 250,
			hold: 750,
			yoyo: true,
			repeat: -1,
			props: {
				alpha: 1
			}
		});

		this.input.keyboard.on('keydown-ENTER', function(event)
		{
			this.scene.start('roll');
		}, this);
    }

}
