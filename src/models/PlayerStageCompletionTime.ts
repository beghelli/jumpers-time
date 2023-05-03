import BaseModel from './baseModel';
import {PlayerStageCompletionTimeData} from '../types';

export default class PlayerStageCompletionTime extends BaseModel
{

	data: PlayerStageCompletionTimeData;

	static build(stageId: string)
	{
		const completionTime = new PlayerStageCompletionTime();
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
		const castedData = data as PlayerStageCompletionTimeData;
		this.data['completionTime'] = castedData.completionTime;
		this.data['stageId'] = castedData.stageId;
	}
}
