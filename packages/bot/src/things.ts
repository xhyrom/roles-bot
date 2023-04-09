import { RedisAPIClient } from "redis-api-client";
import { Command } from "./structs/Command";
import { Component } from "./structs/Component";
import { Modal } from "./structs/Modal";

export const COMMANDS: Command[] = [];
export const COMPONENTS: Component[] = [];
export const MODALS: Modal[] = [];
export let REDIS: RedisAPIClient;

export const setRedis = (apiKey: string, host: string) => {
	REDIS = new RedisAPIClient(apiKey, host);
};

export const registerCommand = (command: Command) => {
	COMMANDS.push(command);
};

export const registerComponent = (component: Component) => {
	COMPONENTS.push(component);
};

export const registerModal = (modal: Modal) => {
	MODALS.push(modal);
};
