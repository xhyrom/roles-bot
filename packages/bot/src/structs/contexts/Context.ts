import {
	APIInteraction,
	APIInteractionResponseCallbackData,
	RouteBases,
	Routes,
} from "discord-api-types/v10";

export class Context {
	public interaction: APIInteraction;
	public env: Env;

	constructor(interaction: APIInteraction, env: Env) {
		this.interaction = interaction;
		this.env = env;
	}

	public async editReply(content: APIInteractionResponseCallbackData) {
		return await fetch(
			`${RouteBases.api}${Routes.webhookMessage(
				this.interaction.application_id,
				this.interaction.token,
			)}`,
			{
				method: "PATCH",
				body: JSON.stringify(content),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bot ${this.env.token}`,
				},
			},
		);
	}
}
