import * as Phaser from 'phaser';
import { defaultPrimaryShadowStyle } from '../fontStyles';

export default class Timer extends Phaser.GameObjects.Text
{

	constructor(scene: Phaser.Scene, x: number, y: number, time: number | null)
	{
		super(scene, x, y, "", defaultPrimaryShadowStyle);
		this.setOrigin(0.5);
		this.setScrollFactor(0);
		this.setDepth(1000);
		scene.add.existing(this);

		if (time)
		{
			this.setTime(time);
		}
	}

	update(time: number)
	{
		this.setTime(time);
	}

	setTime(time: number)
	{
		let seconds: number = Math.floor(time/1000);
		let minutes: number = Math.floor(seconds / 60);
		let miliseconds: number = Math.floor((time - (seconds * 1000)) / 10);
		// @ts-ignore
		this.setText(`${String(minutes).padStart(2,0)}:${String(seconds % 60).padStart(2,0)}:${String(miliseconds).padStart(2,0)}`);
	}

}
