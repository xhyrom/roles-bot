import { MessageFlags } from "discord-api-types/v10";
import { registerModal } from "../registers";
import { ModalContext } from "./contexts/ModalContext";

interface ModalOptions {
	id: string;
	flags?: MessageFlags;
	run: (interaction: ModalContext) => void;
}

export class Modal {
	public id: string;
	public flags: MessageFlags | undefined;
	public run: (interaction: ModalContext) => void;

	constructor(options: ModalOptions) {
		this.id = options.id;
		this.flags = options.flags;
		this.run = options.run;

		registerModal(this);
	}
}
