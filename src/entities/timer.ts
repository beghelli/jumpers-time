import * as Phaser from 'phaser';

export default class Timer extends Phaser.GameObjects.Text
{

	constructor(scene: Phaser.Scene, x: number, y: number)
	{
		const defaultStyle: Phaser.Types.GameObjects.Text.TextStyle = {strokeThickness: 0.5, fontSize: 20, shadow: { offsetX: 1, offsetY: 1, blur: 1, color: '#000', fill: true }};
		super(scene, x, y, "", defaultStyle);
		this.setOrigin(0.5);
		this.setScrollFactor(0);
		this.setDepth(1000);
		scene.add.existing(this);
	}

	update(time: number)
	{
		let seconds: number = Math.floor(time/1000);
		let minutes: number = Math.floor(seconds / 60);
		let miliseconds: number = Math.floor((time - (seconds * 1000)) / 10);
		// @ts-ignore
		this.setText(`${String(minutes).padStart(2,0)}:${String(seconds % 60).padStart(2,0)}:${String(miliseconds).padStart(2,0)}`);
	}

}
