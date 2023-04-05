import { registerCommand } from "../registers";

interface CommandOptions {
	name: string;
}

export class Command {
	public name: string;

	constructor(options: CommandOptions) {
		this.name = options.name;

		registerCommand(this);
	}
}
