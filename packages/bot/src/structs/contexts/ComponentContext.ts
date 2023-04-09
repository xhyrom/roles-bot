import { APIMessageComponentInteraction } from "discord-api-types/v10";
import { Env } from "../../types";
import { Context } from "./Context";

export class ComponentContext extends Context {
	public interaction: APIMessageComponentInteraction;

	constructor(interaction: APIMessageComponentInteraction, env: Env) {
		super(interaction, env);

		this.interaction = interaction;
	}
}
