import { Generic, serializers } from "serialize";
import { Context } from "../structs/contexts/Context";
import { ActionRowBuilder, TextInputBuilder } from "builders";
import { TextInputStyle } from "discord-api-types/v10";

export default function (
	data: Record<string, Generic>,
	ctx: Context,
	rawRole: string,
) {
	return ctx.returnModal({
		title: `Role Setup ${rawRole}`,
		custom_id: serializers.genericObject.encodeCustomId({
			type: "setup:part-roles-lpe",
			data,
		}),
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
