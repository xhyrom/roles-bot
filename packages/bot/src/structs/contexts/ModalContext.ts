import { APIModalSubmitInteraction } from "discord-api-types/v10";
import { DeclaredId, Env } from "../../types";
import { serializers } from "serialize";
import { Context } from "./Context";

export class ModalContext extends Context {
	public decodedId: DeclaredId;
	public interaction: APIModalSubmitInteraction;

	constructor(interaction: APIModalSubmitInteraction, env: Env) {
		super(interaction, env);

		this.decodedId = serializers.genericObject.decodeCustomId(
			interaction.data.custom_id,
		) as DeclaredId;
		this.interaction = interaction;
	}
}
