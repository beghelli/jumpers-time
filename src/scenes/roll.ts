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
		const cursors = this.input.keyboard.createCursorKeys();
		this.player = new Player(this, 0, 0, cursors);
		this.player.preload();
		this.player.depth = 99;

		this.load.image("tiles", "assets/mapTiles.png");
  		this.load.tilemapTiledJSON("map", "assets/tilemaps/level1.json");
    }

    create()
    {
		this.cameras.main.setBackgroundColor('#000000');
		this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);

		this.add.existing(this.player);
		this.physics.add.existing(this.player);
		this.player.create();

		const map = this.make.tilemap({ key: "map" });
		const tileset = map.addTilesetImage("jumpersTime", "tiles");
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

		const worldLayer = map.createLayer("World", tileset, 0, 0);
		worldLayer.setCollisionByProperty({ collides: true });
		this.physics.add.collider(this.player, worldLayer);

		const playerSpawnPoint = map.findObject("Entities", obj => obj.name === "Player");
		this.player.x = playerSpawnPoint.x;
		this.player.y = playerSpawnPoint.y;
	}

	update()
	{
		this.player.update();
	}

}
