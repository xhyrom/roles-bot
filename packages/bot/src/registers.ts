import { Command } from "./structs/Command";
import { Component } from "./structs/Component";

export const COMMANDS: Command[] = [];
export const COMPONENTS: Component[] = [];

export const registerCommand = (command: Command) => {
	COMMANDS.push(command);
};

export const registerComponent = (component: Component) => {
	COMPONENTS.push(component);
};
