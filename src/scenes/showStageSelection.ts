import * as Phaser from 'phaser';
import Timer from '../entities/timer';
import StarContainer from '../entities/starContainer';
import BlinkText from '../entities/blinkText';
import { stagesData } from '../stagesData';
import {StageData} from '../types';
import {defaultPrimaryShadowStyle} from '../fontStyles';
import StageCompletionTimeRecord from '../models/StageCompletionTimeRecord';

export default class ShowStageSelection extends Phaser.Scene
{
	currentSelectedStageId: string;
	thumbnailYDistance: number = 25;

	constructor()
    {
        super('showStageSelection');
    }

    preload()
    {
		stagesData.forEach((stage) => {
			this.load.image(stage.thumbnailName, "assets/" + stage.thumbnailName + stage.thumbnailExtension);
		});
    }

    create()
    {
		this.cameras.main.setBackgroundColor('#000000');
		this.currentSelectedStageId = null;
		let thumbnailYPosition = 127;
		let thumbnailXPosition = 123;
		const setCurrentStageIdCallback = this.setCurrentStageId.bind(this);

		stagesData.forEach((stage) => {
			const thumbImage = this.add.image(thumbnailXPosition, thumbnailYPosition, stage.thumbnailName);
			thumbImage.setName(stage.thumbnailName);
			thumbImage.setAlpha(0.5)
			thumbImage.setOrigin(0,0);
			thumbImage.setInteractive();
			thumbImage.on('pointerover', function() {
				this.setAlpha(1);
			});
			thumbImage.on('pointerout', function() {
				if (stage.id !== this.currentSelectedStageId)
				{
					thumbImage.setAlpha(0.5);
				}
			}, this);

			thumbImage.on('pointerdown', function() {
				setCurrentStageIdCallback(stage.id);
			});
			thumbnailYPosition += stage.thumbnailHeight + this.thumbnailYDistance;
		});

		const selectStageText = this.add.text(this.sys.game.canvas.width / 2, 50, "SELECT A STAGE");
		selectStageText.setOrigin(0.5);
		selectStageText.setScrollFactor(0,0);

		const starColumnXPosition: number = this.sys.game.canvas.width / 2 + 50;
		const textColumnXPosition: number = starColumnXPosition + 100;

		const targetCompletionTimesText = this.add.text(starColumnXPosition, 123, 'Target completion times');
		targetCompletionTimesText.setScrollFactor(0,0);

		let timeLineYPosition: number = 153;
		const targetTimeOneStar = new Timer(this, textColumnXPosition, timeLineYPosition, 0);
		targetTimeOneStar.setOrigin(0,0);
		targetTimeOneStar.setName('targetTimeText0');
		new StarContainer(this, starColumnXPosition, timeLineYPosition, 1);

		timeLineYPosition += 30;
		const targetTimeTwoStar = new Timer(this, textColumnXPosition, timeLineYPosition, 0);
		targetTimeTwoStar.setOrigin(0,0);
		targetTimeTwoStar.setName('targetTimeText1');
		new StarContainer(this, starColumnXPosition, timeLineYPosition, 2);

		timeLineYPosition += 30;
		const targetTimeThreeStar = new Timer(this, textColumnXPosition, timeLineYPosition, 0);
		targetTimeThreeStar.setOrigin(0,0);
		targetTimeThreeStar.setName('targetTimeText2');
		new StarContainer(this, starColumnXPosition, timeLineYPosition, 3);

		const bestPersonalTimeTitle = this.add.text(starColumnXPosition, targetTimeThreeStar.y + 60, 'Best Personal Time');
		bestPersonalTimeTitle.setScrollFactor(0,0);
		const bestPersonalTime = new Timer(this, starColumnXPosition, bestPersonalTimeTitle.y + 30, null, defaultPrimaryShadowStyle);
		bestPersonalTime.setOrigin(0,0);
		bestPersonalTime.setName('bestPersonalTimeTimer');

		const startText = new BlinkText(this, this.sys.game.canvas.width / 2, 550, 'Press ENTER to start the selected stage!', 250);
		startText.setScrollFactor(0,0);

		this.setCurrentStageId('stage1');

		this.input.keyboard.on('keydown-ENTER', function()
		{
			this.scene.start('roll', { stageId: this.currentSelectedStageId });
		}, this);

		this.input.keyboard.on('keydown-DOWN', () =>
		{
			this.setCurrentStageId(this.getStageIdByIndexDiff(1));
		});

		this.input.keyboard.on('keydown-UP', () => {
			this.setCurrentStageId(this.getStageIdByIndexDiff(-1));
		});
	}

	setCurrentStageId(stageId: string)
	{
		this.currentSelectedStageId = stageId;
		stagesData.forEach((stage) =>
		{
			const thumbImage = this.children.getByName(stage.thumbnailName) as Phaser.GameObjects.Image;
			if (stage.id !== this.currentSelectedStageId)
			{
				thumbImage.setAlpha(0.5);
			}
			else
			{
				this.cameras.main.pan(thumbImage.x + thumbImage.width - 5, thumbImage.y + thumbImage.height - 38, 500, 'Cubic', true);
				thumbImage.setAlpha(1);

				stage.targetCompletionTimes.forEach((time, index) =>
				{
					const timer = this.children.getByName('targetTimeText' + index) as Timer;
					timer.setTime(time);
				});

				const bestTimeTimer = this.children.getByName('bestPersonalTimeTimer') as Timer;
				const bestTimeRecord = StageCompletionTimeRecord.build(stage.id);
				bestTimeTimer.setTime(bestTimeRecord.data.time);
			}
		});
	}

	getStageIdByIndexDiff(indexDiff: number): string
	{
		let stageIdByIndex: string = this.currentSelectedStageId;
		let currentStageIndex: number;
		stagesData.forEach((stageData: StageData, index: number) => {
			if (stageData.id == this.currentSelectedStageId)
			{
				currentStageIndex = index;
			}
		});

		const desiredStageIndex = currentStageIndex + indexDiff;
		if (stagesData[desiredStageIndex] !== undefined)
		{
			stageIdByIndex = stagesData[desiredStageIndex].id;
		}

		return stageIdByIndex;
	}

}

