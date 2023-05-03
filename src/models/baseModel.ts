export default abstract class BaseModel
{

	data: Object;

	abstract getId(): string;
	abstract setAttributes(data: Object): void;

	constructor()
	{
		this.data = {};
	}

	save()
	{
		localStorage.setItem(this.getId(), JSON.stringify(this.data))
	}

	load()
	{
		return JSON.parse(localStorage.getItem(this.getId()));
	}

}
