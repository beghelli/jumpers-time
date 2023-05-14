import * as Phaser from 'phaser';
import Player from '../entities/player';
import Timer from '../entities/timer';
import { RollSceneData, StageData } from '../types';
import { getStageDataById } from '../stagesData';
import {defaultPrimaryShadowStyle} from '../fontStyles';
import StageCompletionTimeRecord from '../models/StageCompletionTimeRecord';

export default class Roll extends Phaser.Scene
{
	player: Player;
	timer: Timer;
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	startTime: number;
	completionTime: number;
	playerFinished: boolean;
	playerStarted: boolean;
	stageData: StageData;

	constructor()
    {
        super('roll');
    }

	init (currentStageData: RollSceneData)
	{
		this.stageData = getStageDataById(currentStageData.stageId);
	}

    preload()
    {
		this.cursors = this.input.keyboard.createCursorKeys();
		this.player = new Player(this, 0, 0, this.cursors);
		this.player.preload();
		this.player.depth = 200;

		this.load.image('tiles', 'assets/mapTiles.png');
		this.load.image('mobileControlLeft', 'assets/mobile-control-left.png');
		this.load.image('mobileControlRight', 'assets/mobile-control-right.png');
		this.load.image('mobileControlUp', 'assets/mobile-control-up.png');
  		this.load.tilemapTiledJSON(this.stageData.id, 'assets/tilemaps/' + this.stageData.tilemapJson);
    }

    create()
    {
		this.createMobileControls();
		this.sound.stopAll();
		this.playerFinished = false;
		this.playerStarted = false;

		this.cameras.main.setBackgroundColor('#000000');
		this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);

		this.add.existing(this.player);
		this.physics.add.existing(this.player);
		this.player.create();

		const map = this.make.tilemap({ key: this.stageData.id });
		this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.physics.world.setBoundsCollision(true, true, false, false);
		this.player.setCollideWorldBounds(true);

		const tileset = map.addTilesetImage("forest", "tiles");
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

		const worldLayer = map.createLayer("World", tileset, 0, 0);
		worldLayer.setCollisionByProperty({ collides: true });
		worldLayer.setTileIndexCallback([5,6], this.touchesFinalFlags, this);
		worldLayer.setTileIndexCallback([36], this.touchesSpeedBoost, this);
		worldLayer.depth = 2;
		this.physics.add.collider(this.player, worldLayer);

		map.createLayer("Clouds", tileset, 0, 0);
		const treesBackLayer = map.createLayer("TreesBack", tileset, 0, 0);
		treesBackLayer.setDepth(1);
		map.createLayer("TreesFront", tileset, 0, 0);

		const frontLayer = map.createLayer("Front", tileset, 0, 0);
		frontLayer.depth = 100;

		const backLayer = map.createLayer("Back", tileset, 0, 0);
		backLayer.depth = 1;

		const playerSpawnPoint = map.findObject("Entities", obj => obj.name === "Player");
		this.player.x = playerSpawnPoint.x;
		this.player.y = playerSpawnPoint.y;

		const centerX = this.sys.game.canvas.width / 2;
		this.timer = new Timer(this, centerX, this.sys.game.canvas.height - 45, 0);
		const restartText = new Phaser.GameObjects.Text(this, centerX, this.timer.y + 20, 'Press SHIFT to restart stage!', defaultPrimaryShadowStyle);
		restartText.setOrigin(0.5);
		restartText.setScrollFactor(0);
		restartText.depth = 1001;
		restartText.setName('restartText');
		this.add.existing(restartText);

		const pauseGameCallback = () =>
		{
			this.scene.pause(this.scene.key);
			this.scene.launch('paused');
			this.scene.bringToTop('paused');
		};

		this.input.keyboard.on('keydown-ESC', pauseGameCallback);
		this.input.keyboard.on('keydown-P', pauseGameCallback);
	}

	update(gameTime: number, delta: number)
	{
		if (this.cursors.shift.isDown)
		{
			this.scene.restart();
		}

		this.player.update(gameTime, delta);

		let completionTime: number = this.calculateCompletionTime(gameTime);
		this.timer.update(completionTime);
	}

	calculateCompletionTime(time: number): number
	{
		if (! this.playerStarted && this.player.moved())
		{
			this.playerStarted = true;
		}

		if (! this.playerStarted)
		{
			this.startTime = time;
		}
		else
		{
			if (! this.playerFinished)
			{
				this.completionTime = time - this.startTime;
			}
		}

		return this.completionTime;
	}

	touchesFinalFlags()
	{
		this.playerFinished = true;

		this.timer.destroy();
		this.children.getByName('restartText').destroy();

		this.scene.pause(this.scene.key);

		const completionTimeRecord = StageCompletionTimeRecord.build(this.stageData.id);
		completionTimeRecord.data.time = this.completionTime;
		this.scene.launch('showStageResult', {completionTimeRecord: completionTimeRecord});
	}

	touchesSpeedBoost(player: Player, tile: Phaser.Tilemaps.Tile)
	{
		const body = this.player.body as Phaser.Physics.Arcade.Body;
		this.player.setMaxVelocity(this.player.maxVelocityReference.x * 3, this.player.maxVelocityReference.y);
		this.player.setVelocityX(body.maxVelocity.x);
	}

	createMobileControls()
	{
		if (! this.sys.game.device.os.desktop)
		{
			const controlLeft = this.add.image(50, this.sys.game.canvas.height - 50, 'mobileControlLeft');
			controlLeft.setDepth(1000);
			controlLeft.setScrollFactor(0);
			const controlRight = this.add.image(controlLeft.x + 75, controlLeft.y, 'mobileControlRight');
			controlRight.setDepth(1000);
			controlRight.setScrollFactor(0);
			const controlUp = this.add.image(this.sys.game.canvas.width - 50, controlLeft.y, 'mobileControlUp');
			controlUp.setDepth(1000);
			controlUp.setScrollFactor(0);

			controlLeft.setInteractive();
			controlRight.setInteractive();
			controlUp.setInteractive();

			controlLeft.on('pointerover', () => {this.cursors.left.isDown = true; }, this);
			controlLeft.on('pointerout', () => {this.cursors.left.isDown = false; }, this);

			controlRight.on('pointerover', () => {this.cursors.right.isDown = true; }, this);
			controlRight.on('pointerout', () => {this.cursors.right.isDown = false; }, this);

			controlUp.on('pointerover', () => {this.cursors.up.isDown = true; this.cursors.up.isUp = false;}, this);
			controlUp.on('pointerout', () => {this.cursors.up.isDown = false; this.cursors.up.isUp = true;}, this);
		}
	}

}
