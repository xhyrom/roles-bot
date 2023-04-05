import { Command } from "./structs/Command";
import { Listener } from "./structs/Listener";

export const COMMANDS: Command[] = [];
export const LISTENERS: Listener[] = [];

export const registerCommand = (command: Command) => {
	COMMANDS.push(command);
};

export const registerListener = (listener: Listener) => {
	LISTENERS.push(listener);
};
