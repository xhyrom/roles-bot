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
import { BasicData } from "../types";

export default async function (data: BasicData, ctx: Context, rawRole: string) {
	const rolesRaw: string | null = await REDIS.get(
		`roles-bot-setup-roles:${ctx.guildId}`,
	);
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

	const components = [
		new ActionRowBuilder<TextInputBuilder>()
			.addComponents(
				new TextInputBuilder()
					.setLabel("Label")
					.setCustomId("label")
					.setMaxLength(data.selecting === "buttons" ? 80 : 100)
					.setPlaceholder("Ping")
					.setStyle(TextInputStyle.Short)
					.setRequired(true),
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
	];

	switch (data.selecting) {
		case "buttons": {
			components.push(
				new ActionRowBuilder<TextInputBuilder>()
					.addComponents(
						new TextInputBuilder()
							.setLabel("Style")
							.setCustomId("style")
							.setPlaceholder("Primary, Secondary, Success or Danger")
							.setStyle(TextInputStyle.Short)
							.setRequired(true),
					)
					.toJSON(),
			);

			break;
		}
		case "dropdowns": {
			components.push(
				new ActionRowBuilder<TextInputBuilder>()
					.addComponents(
						new TextInputBuilder()
							.setLabel("Description")
							.setCustomId("description")
							.setMaxLength(100)
							.setPlaceholder("pingping pong pong")
							.setStyle(TextInputStyle.Short)
							.setRequired(false),
					)
					.toJSON(),
			);
		}
	}

	return ctx.returnModal({
		title: `${roleName?.slice(0, 39)} Role`,
		custom_id: "setup:part-roles-lpe",
		components,
	});
}
