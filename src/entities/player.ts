import * as Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite
{

	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	accelerationConstant: number = 600;
	bounceValue: number = 0.25;
	jumpMaxChargeDuration: number = 300;
	jumpMaxVelocity: number = 650;
	jumpIgnoreCharge: boolean = false;

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
			yoyo: true,
			repeat: 0
		});

	}

	update()
	{
		this.setBounce(this.bounceValue);
		let isAcceleratingX: boolean = false;
		let jumped: boolean = false;
		if (this.cursors.up.isUp)
		{
			this.jumpIgnoreCharge = false;
		}

		if (this.cursors.up.isDown && ! this.jumpIgnoreCharge)
		{
			this.anims.play('jumpCharge', true);
		}

		let isChargingJump: boolean = this.anims.isPlaying && this.anims.currentAnim.key === "jumpCharge";
		let reachedMaximumJumpVelocity: boolean = isChargingJump && this.anims.currentFrame.index === this.anims.currentAnim.getLastFrame().index;

		if (isChargingJump && (this.cursors.up.isUp || reachedMaximumJumpVelocity))
		{
			if (reachedMaximumJumpVelocity)
			{
				this.jumpIgnoreCharge = true; // Stops charging jump again until user releases the up key.
			}

			if (this.body.blocked.down)
			{
				let jumpVelocity: number = Math.round((this.jumpMaxVelocity / this.anims.currentAnim.getTotalFrames()) * this.anims.currentFrame.index);
				this.setVelocityY(jumpVelocity * -1);
				jumped = true;
				isChargingJump = false;
				console.log(jumpVelocity);
			}
		}

		if (this.cursors.left.isDown)
		{
			this.setAccelerationX(this.accelerationConstant * -1);
			if (! isChargingJump)
			{
				this.anims.play('left', true);
			}
			isAcceleratingX = true;
		}
		else if (this.cursors.right.isDown)
		{
			this.setAccelerationX(this.accelerationConstant);
			if (! isChargingJump)
			{
				this.anims.play('right', true);
			}
			isAcceleratingX = true;
		}

		if (jumped && this.cursors.up.isDown)
		{
			this.jumpIgnoreCharge = true;
		}

		if (! isAcceleratingX)
		{
			this.setAccelerationX(0);
		}

		if (! isAcceleratingX && ! isChargingJump)
		{
			this.anims.play('turn');
		}

		if (isChargingJump)
		{
			this.setBounce(0);
		}
	}

	moved(): boolean
	{
		return this.cursors.up.isDown || this.cursors.left.isDown || this.cursors.right.isDown;
	}

}
