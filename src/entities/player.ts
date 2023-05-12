import * as Phaser from 'phaser';
import {JumpSoundConfig} from '../types';

export default class Player extends Phaser.Physics.Arcade.Sprite
{

	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	accelerationConstant: number = 600;
	maxVelocityReference: Phaser.Math.Vector2 = new Phaser.Math.Vector2(300, 10000);
	bounceValue: number = 0.25;
	jumpMaxChargeDuration: number = 300;
	jumpMaxVelocity: number = 650;
	jumpIgnoreCharge: boolean = false;
	jumpSoundsConfig: JumpSoundConfig[]= [
		{ key: 'jump1', file: 'jump1.mp3', jumpVelocityPercentageLimit: 50 },
		{ key: 'jump2', file: 'jump2.mp3', jumpVelocityPercentageLimit: 65 },
		{ key: 'jump3', file: 'jump3.mp3', jumpVelocityPercentageLimit: 85 },
		{ key: 'jump4', file: 'jump4.mp3', jumpVelocityPercentageLimit: 100 },
	];

	constructor(scene: Phaser.Scene, x: number, y: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys)
	{
		super(scene, x, y, null);
		this.cursors = cursors;
	}

	preload()
	{
		this.scene.load.spritesheet('player', 'assets/player.png', {frameWidth: 33, frameHeight: 33});
		this.loadJumpSounds();
		this.setTexture('player');
	}

	create()
	{
		this.addJumpSounds();
		this.setMaxVelocity(this.maxVelocityReference.x, this.maxVelocityReference.y);
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

	update(gameTime: number, delta: number)
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
				this.playJumpSound(jumpVelocity);
				jumped = true;
				isChargingJump = false;
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

		const body = this.body as Phaser.Physics.Arcade.Body;
		if (body.maxVelocity.x > this.maxVelocityReference.x)
		{
			body.setMaxVelocity(body.maxVelocity.x - (delta / 3), this.maxVelocityReference.y);
		}
		else
		{
			this.setMaxVelocity(this.maxVelocityReference.x, this.maxVelocityReference.y);
		}
	}

	moved(): boolean
	{
		return this.cursors.up.isDown || this.cursors.left.isDown || this.cursors.right.isDown;
	}

	private loadJumpSounds()
	{
		for (const jumpConfig of this.jumpSoundsConfig)
		{
			this.scene.load.audio(jumpConfig.key, 'assets/' + jumpConfig.file);
		}
	}

	private addJumpSounds()
	{
		for (const jumpConfig of this.jumpSoundsConfig)
		{
			this.scene.sound.add(jumpConfig.key, {loop: false});
		}
	}

	private playJumpSound(jumpVelocity: number)
	{
		const jumpMaxVelocityPercentage: number = jumpVelocity * 100 / this.jumpMaxVelocity;
		let jumpSoundKey = '';

		for (const jumpConfig of this.jumpSoundsConfig)
		{
			if (jumpMaxVelocityPercentage <= jumpConfig.jumpVelocityPercentageLimit)
			{
				jumpSoundKey = jumpConfig.key;
				break;
			}
		}

		this.scene.sound.play(jumpSoundKey);
	}

}
