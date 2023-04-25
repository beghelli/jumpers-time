export interface RollSceneData {
	stageId: string;
}

export interface StageData {
	id: string,
	thumbnailName: string,
	thumbnailExtension: string,
	thumbnailHeight: number,
	tilemapJson: string,
	targetCompletionTimes: number[],
}
