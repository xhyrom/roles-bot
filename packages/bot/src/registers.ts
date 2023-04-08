import { Command } from "./structs/Command";
import { Component } from "./structs/Component";
import { Modal } from "./structs/Modal";

export const COMMANDS: Command[] = [];
export const COMPONENTS: Component[] = [];
export const MODALS: Modal[] = [];

export const registerCommand = (command: Command) => {
	COMMANDS.push(command);
};

export const registerComponent = (component: Component) => {
	COMPONENTS.push(component);
};

export const registerModal = (modal: Modal) => {
	MODALS.push(modal);
};
