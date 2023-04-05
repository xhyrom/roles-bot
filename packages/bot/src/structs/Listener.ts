import { registerListener } from "../registers";

interface ListenerOptions {
	name: string;
	once: boolean | undefined;
}

export class Listener {
	public name: string;
	public once: boolean;

	constructor(options: ListenerOptions) {
		this.name = options.name;
		this.once = options.once ?? false;

		registerListener(this);
	}
}
