import * as Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite
{

	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	accelerationConstant: integer = 600;
	jumpMaxChargeDuration: number = 250;
	jumpMaxVelocity: number = 400;
	currentJumpVelocity: number = 0;

	constructor(scene, x, y, cursors)
	{
		super(scene, x, y, null);
		this.cursors = cursors;
	}

	preload()
	{
		this.scene.load.spritesheet('player', 'assets/player.png', {frameWidth: 33, frameHeight: 33});
		this.setTexture('player');
	}

	create()
	{
		this.setCollideWorldBounds(true);
		this.setBounce(0.15);
		this.setMaxVelocity(300, 10000);
		this.setDragX(this.accelerationConstant * 2);

		 //  Our player animations, turning, walking left and walking right.
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [ { key: 'player', frame: 5 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('player', { start: 5, end: 10 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'jumpCharge',
			frames: this.anims.generateFrameNumbers('player', { start: 10, end: 23 }),
			duration: this.jumpMaxChargeDuration,
			repeat: 0
		});

	}

	update()
	{
		let performingAction: boolean = false;
		if (this.cursors.left.isDown)
		{
			this.setAccelerationX(this.accelerationConstant * -1);
			if (! this.anims.currentAnim || this.anims.currentAnim.key !== 'jumpCharge')
			{
				this.anims.play('left', true);
			}
			performingAction = true;
		}
		else if (this.cursors.right.isDown)
		{
			this.setAccelerationX(this.accelerationConstant);
			if (! this.anims.currentAnim || this.anims.currentAnim.key !== 'jumpCharge')
			{
				this.anims.play('right', true);
			}
			performingAction = true;
		}

		if (this.cursors.up.isDown && this.body.touching.down)
		{
			this.anims.play('jumpCharge', true);
			this.currentJumpVelocity += Math.round((this.jumpMaxVelocity / this.jumpMaxChargeDuration) * this.scene.game.loop.delta);
			performingAction = true;
		}

		let reachedMaximumJumpVelocity: boolean = this.currentJumpVelocity >= this.jumpMaxVelocity;

		if (this.currentJumpVelocity && (
			this.cursors.up.isUp || reachedMaximumJumpVelocity))
		{
			if (reachedMaximumJumpVelocity)
			{
				this.currentJumpVelocity = this.jumpMaxVelocity;
			}

			if (this.body.touching.down)
			{
				this.setVelocityY(this.currentJumpVelocity * -1);
				console.log(this.currentJumpVelocity);
			}
			this.currentJumpVelocity = 0;
			performingAction = false;
		}

		if (! performingAction || (! this.body.touching.down && this.anims.currentAnim.key == 'jumpCharge'))
		{
			this.anims.play('turn');
			this.setAccelerationX(0);
			this.currentJumpVelocity = 0;
		}
	}

}
