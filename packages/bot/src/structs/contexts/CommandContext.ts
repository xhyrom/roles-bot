import { APIApplicationCommandInteraction } from "discord-api-types/v10";
import { Context } from "./Context";
import { Env } from "../../types";

export class CommandContext extends Context {
	public interaction: APIApplicationCommandInteraction;

	constructor(interaction: APIApplicationCommandInteraction, env: Env) {
		super(interaction, env);

		this.interaction = interaction;
	}
}
