import {StageData} from "./types";

export const stagesData: StageData[] = [
	{
		id: 'stage1',
		thumbnailName: 'thumb-stage1',
		thumbnailExtension: '.png',
		thumbnailHeight: 210,
		tilemapJson: 'level1.json',
		targetCompletionTimes: [22000,17500,13000]
	},
	{
		id: 'stage2',
		thumbnailName: 'thumb-stage2',
		thumbnailExtension: '.png',
		thumbnailHeight: 210,
		tilemapJson: 'level2.json',
		targetCompletionTimes: [33000,25500,17500]
	},
	{
		id: 'stage3',
		thumbnailName: 'thumb-stage3',
		thumbnailExtension: '.png',
		thumbnailHeight: 210,
		tilemapJson: 'level3.json',
		targetCompletionTimes: [45000,31500,20000]
	}
];
