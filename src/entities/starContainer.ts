import * as Phaser from 'phaser';

export default class StarContainer extends Phaser.GameObjects.Container
{

	constructor(scene: Phaser.Scene, x: number, y: number, starsCount: number)
	{

		let stars = [];

		let starsIndex = 0;
		while (starsIndex < starsCount)
		{
			let star = new Phaser.GameObjects.Star(scene, starsIndex * 25, 0, 5, 5, 12, 0xFFFF00);
			star.setOrigin(0,0);
			stars.push(star);
			starsIndex++;
		}

		super(scene, x, y, stars);
		this.setScrollFactor(0, 0);

		scene.add.existing(this);
	}

}
