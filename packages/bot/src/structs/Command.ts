import { registerCommand } from "../registers";
import { CommandContext } from "./contexts/CommandContext";

interface CommandOptions {
	name: string;
	run: (interaction: CommandContext) => void;
}

export class Command {
	public name: string;
	public run: (interaction: CommandContext) => void;

	constructor(options: CommandOptions) {
		this.name = options.name;
		this.run = options.run;

		registerCommand(this);
	}
}
