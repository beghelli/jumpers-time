export interface RollSceneData {
	stageId: string;
}

export interface StageResultData {
	stageId: string;
	completionTime: number;
}

export interface StageData {
	id: string,
	thumbnailName: string,
	thumbnailExtension: string,
	thumbnailHeight: number,
	tilemapJson: string,
	targetCompletionTimes: number[],
}

export interface PlayerStageCompletionTimeData {
	completionTime: number,
	stageId: string,
}

