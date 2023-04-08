import { MessageFlags } from "discord-api-types/v10";
import { registerCommand } from "../registers";
import { CommandContext } from "./contexts/CommandContext";

interface CommandOptions {
	name: string;
	acknowledge?: boolean;
	flags?: MessageFlags;
	run: (interaction: CommandContext) => void;
}

export class Command {
	public name: string;
	public acknowledge: boolean;
	public flags: MessageFlags | undefined;
	public run: (interaction: CommandContext) => void | Response;

	constructor(options: CommandOptions) {
		this.name = options.name;
		this.acknowledge = options.acknowledge ?? true;
		this.flags = options.flags;
		this.run = options.run;

		registerCommand(this);
	}
}
