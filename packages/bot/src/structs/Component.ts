import { APIMessageComponentInteraction } from "discord-api-types/v10";
import { registerComponent } from "../registers";

interface ComponentOptions {
	id: string;
	run: (interaction: APIMessageComponentInteraction) => Promise<Response>;
}

export class Component {
	public id: string;
	public run: (
		interaction: APIMessageComponentInteraction,
	) => Promise<Response>;

	constructor(options: ComponentOptions) {
		this.id = options.id;
		this.run = options.run;

		registerComponent(this);
	}
}
