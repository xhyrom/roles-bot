import { Command } from "./structs/Command";
import { Component } from "./structs/Component";
import { Modal } from "./structs/Modal";
import type { Redis } from "@upstash/redis/cloudflare";

export const COMMANDS: Command[] = [];
export const COMPONENTS: Component[] = [];
export const MODALS: Modal[] = [];
export let REDIS: Redis;

export const setRedis = (redis: Redis) => {
	REDIS = redis;
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
