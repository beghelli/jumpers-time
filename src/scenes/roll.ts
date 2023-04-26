import * as Phaser from 'phaser';
import Player from '../entities/player';
import Timer from '../entities/timer';
import { RollSceneData, StageData } from '../types';
import { stagesData } from '../stagesData';
import {defaultPrimaryShadowStyle} from '../fontStyles';

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
		this.stageData = stagesData.filter((data) => { return data.id == currentStageData.stageId })[0];
	}

    preload()
    {
		this.cursors = this.input.keyboard.createCursorKeys();
		this.player = new Player(this, 0, 0, this.cursors);
		this.player.preload();
		this.player.depth = 99;

		this.load.image("tiles", "assets/mapTiles.png");
  		this.load.tilemapTiledJSON(this.stageData.id, "assets/tilemaps/" + this.stageData.tilemapJson);
    }

    create()
    {
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
		this.physics.add.collider(this.player, worldLayer);

		map.createLayer("Clouds", tileset, 0, 0);
		const treesBackLayer = map.createLayer("TreesBack", tileset, 0, 0);
		treesBackLayer.setDepth(1);
		map.createLayer("TreesFront", tileset, 0, 0);

		const frontLayer = map.createLayer("Front", tileset, 0, 0);
		frontLayer.depth = 100;

		const playerSpawnPoint = map.findObject("Entities", obj => obj.name === "Player");
		this.player.x = playerSpawnPoint.x;
		this.player.y = playerSpawnPoint.y;

		const centerX = this.sys.game.canvas.width / 2;
		this.timer = new Timer(this, centerX, this.sys.game.canvas.height - 45, 0);
		const restartText = new Phaser.GameObjects.Text(this, centerX, this.timer.y + 20, 'Press SHIFT to restart stage!', defaultPrimaryShadowStyle);
		restartText.setOrigin(0.5);
		restartText.setScrollFactor(0);
		restartText.depth = 10001;
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

	update(gameTime: number)
	{
		if (this.cursors.shift.isDown)
		{
			this.scene.restart();
		}

		this.player.update();

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
	}

}
