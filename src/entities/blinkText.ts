import * as Phaser from 'phaser';
import { defaultPrimaryShadowStyle } from '../fontStyles';

export default class BlinkText extends Phaser.GameObjects.Text
{

	constructor(scene: Phaser.Scene, x: number, y: number, text: string, duration: number)
	{
		super(scene, x, y, text, defaultPrimaryShadowStyle);
		this.alpha = 0;
		this.setOrigin(0.5, 0.5);

		scene.tweens.add({
			targets: this,
			duration: duration,
			hold: 750,
			yoyo: true,
			repeat: -1,
			props: {
				alpha: 1
			}
		});

		scene.add.existing(this);
	}
}
