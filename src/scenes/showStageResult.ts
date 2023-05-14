import * as Phaser from 'phaser';
import RestartControl from '../entities/restartControl';
import QuitControl from '../entities/quitControl';
import Timer from '../entities/timer';
import {defaultPrimaryShadowStyle} from '../fontStyles';
import StageCompletionTimeRecord from '../models/StageCompletionTimeRecord';
import {StageResultData} from '../types';

export default class ShowStageResult extends Phaser.Scene
{

	completionTimeRecord: StageCompletionTimeRecord;

	constructor()
	{
		super('showStageResult');
	}

	init(resultsData: StageResultData)
	{
		this.completionTimeRecord = resultsData.completionTimeRecord;
	}

	create()
	{
		new RestartControl(this);
		new QuitControl(this);
		const canvasWidth = this.sys.game.canvas.width;
		const centerWidth = canvasWidth / 2;
		let fontStyle = {...defaultPrimaryShadowStyle};
		fontStyle.fontSize = 30;
		const timer = new Timer(this, centerWidth, 200, this.completionTimeRecord.data.time, fontStyle);

		const currentTimeRecord = StageCompletionTimeRecord.build(this.completionTimeRecord.data.stageId);
		if (! currentTimeRecord.data.time || currentTimeRecord.data.time > this.completionTimeRecord.data.time)
		{
			this.completionTimeRecord.save();

			fontStyle = {...defaultPrimaryShadowStyle};
			fontStyle.color = 'yellow';
			fontStyle.fontStyle = 'strong';
			fontStyle.fontSize = 18;
			const newRecordText = new Phaser.GameObjects.Text(this, centerWidth, timer.y - 25, 'NEW RECORD!!!', fontStyle);
			newRecordText.setOrigin(0.5);
			this.add.existing(newRecordText);
		}

		const completionText = new Phaser.GameObjects.Text(this, centerWidth, timer.y + 50, 'You completed the stage!', defaultPrimaryShadowStyle);
		completionText.setOrigin(0.5);
		this.add.existing(completionText);

		this.input.keyboard.on('keydown-ENTER', () =>
		{
			this.scene.stop(this.scene.key);
			this.scene.stop('roll');
			this.scene.launch('showStageSelection');
		});

		this.input.keyboard.on('keydown-SHIFT', () =>
		{
			this.scene.stop(this.scene.key);
			this.scene.get('roll').scene.restart();
		});
	}

}
