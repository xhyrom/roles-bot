import { Context } from "../structs/contexts/Context";
import { ActionRowBuilder, TextInputBuilder } from "builders";
import {
	APIRole,
	InteractionResponseType,
	MessageFlags,
	TextInputStyle,
} from "discord-api-types/v10";
import { REDIS } from "../things";
import { decodeFromString } from "serialize";

export default async function (ctx: Context, rawRole: string) {
	const rolesRaw = await REDIS.get(`roles-bot-setup-roles:${ctx.guildId}`);
	if (!rolesRaw)
		return ctx.respond({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content:
					"Something went wrong. Please try again.\nIf this problem persists, please contact [Support Server](https://discord.gg/kFPKmEKeMS/).",
				flags: MessageFlags.Ephemeral,
			},
		});

	const roles = decodeFromString(rolesRaw) as Partial<APIRole>[];

	const roleName = roles?.find((r) => r.id === rawRole)?.name;

	return ctx.returnModal({
		title: `${roleName?.slice(0, 39)} Role`,
		custom_id: "setup:part-roles-lpe",
		components: [
			new ActionRowBuilder<TextInputBuilder>()
				.addComponents(
					new TextInputBuilder()
						.setLabel("Label")
						.setCustomId("label")
						.setPlaceholder("Ping")
						.setStyle(TextInputStyle.Short)
						.setRequired(false),
				)
				.toJSON(),
			new ActionRowBuilder<TextInputBuilder>()
				.addComponents(
					new TextInputBuilder()
						.setLabel("Placeholder")
						.setCustomId("placeholder")
						.setPlaceholder("pingping pong pong")
						.setStyle(TextInputStyle.Short)
						.setRequired(false),
				)
				.toJSON(),
			new ActionRowBuilder<TextInputBuilder>()
				.addComponents(
					new TextInputBuilder()
						.setLabel("Emoji")
						.setCustomId("emoji")
						.setPlaceholder("emoji 💡")
						.setStyle(TextInputStyle.Short)
						.setRequired(false),
				)
				.toJSON(),
		],
	});
}
