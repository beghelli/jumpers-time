import * as Phaser from 'phaser';
import Player from '../entities/player';
import Timer from '../entities/timer';
import { RollSceneData, StageData } from '../types';
import { stagesData } from '../stagesData';

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
  		this.load.tilemapTiledJSON("map", "assets/tilemaps/" + this.stageData.tilemapJson);
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

		const map = this.make.tilemap({ key: "map" });
		this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.physics.world.setBoundsCollision(true, true, false, false);
		this.player.setCollideWorldBounds(true);

		const tileset = map.addTilesetImage("mapTiles", "tiles");
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

		const worldLayer = map.createLayer("World", tileset, 0, 0);
		worldLayer.setCollisionByProperty({ collides: true });
		worldLayer.setTileIndexCallback([5,6], this.touchesFinalFlags, this);
		this.physics.add.collider(this.player, worldLayer);

		map.createLayer("Clouds", tileset, 0, 0);
		const treesBackLayer = map.createLayer("TreesBack", tileset, 0, 0);
		treesBackLayer.setDepth(1);
		map.createLayer("TreesFront", tileset, 0, 0);
		map.createLayer("Borders", tileset, 0, 0);

		const frontLayer = map.createLayer("Front", tileset, 0, 0);
		frontLayer.depth = 100;

		const playerSpawnPoint = map.findObject("Entities", obj => obj.name === "Player");
		this.player.x = playerSpawnPoint.x;
		this.player.y = playerSpawnPoint.y;

		this.timer = new Timer(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height - 30, 0);
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
