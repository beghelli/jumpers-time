import StageCompletionTimeRecord from "./models/StageCompletionTimeRecord";

export interface RollSceneData {
	stageId: string;
}

export interface StageResultData {
	completionTimeRecord: StageCompletionTimeRecord,
}

export interface StageData {
	id: string,
	thumbnailName: string,
	thumbnailExtension: string,
	thumbnailHeight: number,
	tilemapJson: string,
	targetCompletionTimes: number[],
}

export interface StageCompletionTimeRecordData {
	time: number,
	stageId: string,
}

export interface JumpSoundConfig {
	key: string,
	file: string,
	jumpVelocityPercentageLimit: number,
}
