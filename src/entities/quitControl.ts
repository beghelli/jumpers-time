import * as Phaser from 'phaser';

export default class QuitControl extends Phaser.GameObjects.Image
{

	constructor(scene: Phaser.Scene)
	{
		super(scene, scene.sys.canvas.width - 40, 25, 'textQuit');
		this.setName('quitControl');
		this.setInteractive();
		this.setDepth(100);
		this.setScrollFactor(0);
		this.on('pointerdown', () => {
			if (scene.scene.get('showStageResult'))
			{
				scene.scene.get('showStageResult').scene.stop();
			}
			scene.scene.get('roll').scene.stop();
			scene.scene.launch('showStageSelection');
		}, this);
		scene.add.existing(this);
	}

}
