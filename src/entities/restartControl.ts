import * as Phaser from 'phaser';

export default class RestartControl extends Phaser.GameObjects.Image
{

	constructor(scene: Phaser.Scene)
	{
		super(scene, 60, 25, 'textRestart');
		this.setName('restartControl');
		this.setInteractive();
		this.setDepth(100);
		this.setScrollFactor(0);
		this.on('pointerdown', () => {
			if (scene.scene.get('showStageResult'))
			{
				scene.scene.get('showStageResult').scene.stop();
			}
			scene.scene.get('roll').scene.restart();
		}, this);
		scene.add.existing(this);
	}

}
