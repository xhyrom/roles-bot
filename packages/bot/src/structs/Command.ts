import { APIApplicationCommandInteraction } from "discord-api-types/v10";
import { registerCommand } from "../registers";

interface CommandOptions {
	name: string;
	run: (interaction: APIApplicationCommandInteraction) => Promise<Response>;
}

export class Command {
	public name: string;
	public run: (
		interaction: APIApplicationCommandInteraction,
	) => Promise<Response>;

	constructor(options: CommandOptions) {
		this.name = options.name;
		this.run = options.run;

		registerCommand(this);
	}
}
