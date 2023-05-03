import * as Phaser from 'phaser';
import Timer from '../entities/timer';
import {defaultPrimaryShadowStyle} from '../fontStyles';
import PlayerStageCompletionTime from '../models/PlayerStageCompletionTime';
import {getStageDataById} from '../stagesData';
import {StageData, StageResultData} from '../types';

export default class StageResult extends Phaser.Scene
{

	completionTime: number;
	stageData: StageData;

	constructor()
	{
		super('stageResult');
	}

	init(resultsData: StageResultData)
	{
		this.stageData = getStageDataById(resultsData.stageId);
		this.completionTime = resultsData.completionTime;
	}

	create()
	{
		const canvasWidth = this.sys.game.canvas.width;
		const centerWidth = canvasWidth / 2;
		const timer = new Timer(this, centerWidth, 200, this.completionTime);

		const completionText = new Phaser.GameObjects.Text(this, centerWidth, timer.y + 25, 'You completed the stage! Press ENTER to continue.', defaultPrimaryShadowStyle);
		completionText.setOrigin(0.5);
		this.add.existing(completionText);

		const completionTimeEntity = PlayerStageCompletionTime.build(this.stageData.id);

		if (completionTimeEntity.data.completionTime && completionTimeEntity.data.completionTime > this.completionTime)
		{
			completionTimeEntity.data.completionTime = this.completionTime;
			completionTimeEntity.save();
		}

		this.input.keyboard.on('keydown-ENTER', () =>
		{
			this.scene.stop(this.scene.key);
			this.scene.stop('roll');
			this.scene.launch('stageSelection');
		});

	}

}
