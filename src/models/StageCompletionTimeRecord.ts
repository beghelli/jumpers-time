import BaseModel from './baseModel';
import {StageCompletionTimeRecordData} from '../types';

export default class StageCompletionTimeRecord extends BaseModel
{

	data: StageCompletionTimeRecordData;

	static build(stageId: string)
	{
		const completionTime = new StageCompletionTimeRecord();
		completionTime.data['stageId'] = stageId;

		const data = completionTime.load();
		if (data)
		{
			completionTime.setAttributes(data);
		}

		return completionTime;
	}

	getId()
	{
		return 'playerStageCompletionTime-' + this.data.stageId;
	}

	setAttributes(data: Object): void
	{
		const castedData = data as StageCompletionTimeRecordData;
		this.data['time'] = castedData.time;
		this.data['stageId'] = castedData.stageId;
	}
}
