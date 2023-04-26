import * as Phaser from 'phaser';
import {defaultPrimaryShadowStyle} from '../fontStyles';

export default class Roll extends Phaser.Scene
{

	constructor()
	{
		super('paused');
	}

	create()
	{
		const canvasWidth = this.sys.game.canvas.width;
		const canvasHeight = this.sys.game.canvas.height;

		const bg = new Phaser.GameObjects.Rectangle(this, 0, 0, canvasWidth, canvasHeight, 0x000000, 0.5);
		bg.setOrigin(0,0);
		this.add.existing(bg);

		const centerWidth = canvasWidth / 2;
		const startHeight = 200;
		const separatorSpace = 20;
		const helpText = new Phaser.GameObjects.Text(this, centerWidth, startHeight, 'Press ESC or P to get back to the game.', defaultPrimaryShadowStyle);
		helpText.setOrigin(0.5);
		this.add.existing(helpText);

		const backToSelectionMenuText = new Phaser.GameObjects.Text(this, centerWidth, startHeight + helpText.height + separatorSpace, 'Press R to get back to stage selection', defaultPrimaryShadowStyle);
		backToSelectionMenuText.setOrigin(0.5);
		this.add.existing(backToSelectionMenuText);
		const unpauseCallback = () =>
		{
			this.scene.stop(this.scene.key);
			this.scene.resume('roll');
		};

		this.input.keyboard.on('keydown-ESC', unpauseCallback);
		this.input.keyboard.on('keydown-P', unpauseCallback);

		this.input.keyboard.on('keydown-R', () =>
		{
			this.scene.stop(this.scene.key);
			this.scene.stop('roll');
			this.scene.launch('stageSelection');
		});
	}

}

