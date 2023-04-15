import * as Phaser from 'phaser';
import Player from '../entities/player';

export default class Roll extends Phaser.Scene
{
	platforms: Phaser.Physics.Arcade.Group;
	player: Player;
	lastPlatformAddedTime: number;

	constructor()
    {
        super('roll');
    }

    preload()
    {
		this.load.image('platform1', 'assets/platform1.png');
		const cursors = this.input.keyboard.createCursorKeys();
		this.player = new Player(this, 100, -50, cursors);
		this.player.preload();
    }

    create()
    {
		this.cameras.main.setBackgroundColor('#000000');

		this.add.existing(this.player);
		this.physics.add.existing(this.player);
		this.player.create();

		let platform = this.add.tileSprite(100, 500, 200, 36, 'platform1');
		this.lastPlatformAddedTime = this.sys.game.loop.time - 1000;

		this.platforms = this.physics.add.group();
		this.platforms.add(platform);

		// @ts-ignore
		platform.body.setAllowGravity(false);

		// @ts-ignore
		platform.body.setImmovable(true);

		// @ts-ignore
		//platform.body.setVelocity(0,35);
		this.physics.add.collider(this.player, this.platforms);
    }

	update()
	{
		this.player.update();

		this.managePlatforms();
	}

	managePlatforms()
	{
		const addPlatformInterval: number = 3000;

		if (this.sys.game.loop.time >= this.lastPlatformAddedTime + addPlatformInterval)
		{
			this.lastPlatformAddedTime = this.sys.game.loop.time;
			this.addNewPlatform();
		}
	}

	addNewPlatform()
	{
		const platformWidth = 200;
		const platformHeight = 36;
		const x: number = Phaser.Math.Between(platformWidth / 2, this.sys.game.canvas.width - platformWidth / 2);
		const y: number = -1 * platformHeight;

		let platform = this.add.tileSprite(x, y, platformWidth, platformHeight, 'platform1');
		this.platforms.add(platform);
		// @ts-ignore
		platform.body.setAllowGravity(false);

		// @ts-ignore
		platform.body.setImmovable(true);

		// @ts-ignore
		platform.body.setVelocity(0,35);
	}

}
