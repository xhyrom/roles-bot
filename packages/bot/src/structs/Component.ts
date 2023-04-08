import { MessageFlags } from "discord-api-types/v10";
import { registerComponent } from "../registers";
import { ComponentContext } from "./contexts/ComponentContext";

interface ComponentOptions {
	id: string;
	flags?: MessageFlags;
	run: (interaction: ComponentContext) => void;
}

export class Component {
	public id: string;
	public flags: MessageFlags | undefined;
	public run: (interaction: ComponentContext) => void;

	constructor(options: ComponentOptions) {
		this.id = options.id;
		this.flags = options.flags;
		this.run = options.run;

		registerComponent(this);
	}
}
