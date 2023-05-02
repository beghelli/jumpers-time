import {StageData} from "./types";

export const stagesData: StageData[] = [
	{
		id: 'stage1',
		thumbnailName: 'thumb-stage1',
		thumbnailExtension: '.png',
		thumbnailHeight: 210,
		tilemapJson: 'level1.json',
		targetCompletionTimes: [25000,15000,8000]
	},
	{
		id: 'stage2',
		thumbnailName: 'thumb-stage2',
		thumbnailExtension: '.png',
		thumbnailHeight: 210,
		tilemapJson: 'level2.json',
		targetCompletionTimes: [35000,25000,15000]
	},
	{
		id: 'stage3',
		thumbnailName: 'thumb-stage3',
		thumbnailExtension: '.png',
		thumbnailHeight: 210,
		tilemapJson: 'level3.json',
		targetCompletionTimes: [75000,60000,45000]
	}
];

export const getStageDataById = (stageId: string) =>
{
	return stagesData.filter((data) => { return data.id == stageId })[0];
}
