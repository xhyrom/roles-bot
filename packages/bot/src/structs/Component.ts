import { registerComponent } from "../registers";
import { ComponentContext } from "./contexts/ComponentContext";

interface ComponentOptions {
	id: string;
	run: (interaction: ComponentContext) => void;
}

export class Component {
	public id: string;
	public run: (interaction: ComponentContext) => void;

	constructor(options: ComponentOptions) {
		this.id = options.id;
		this.run = options.run;

		registerComponent(this);
	}
}
