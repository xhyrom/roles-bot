import { Command } from "../structs/Command";
import { ChannelType } from "discord-api-types/v10";
import { ActionRowBuilder, ChannelSelectMenuBuilder } from "builders";

new Command({
	name: "setup",
	run: async (ctx) => {
		await ctx.editReply({
			content: "Setup",
			components: [
				new ActionRowBuilder<ChannelSelectMenuBuilder>()
					.addComponents(
						new ChannelSelectMenuBuilder()
							.setCustomId("channel")
							.addChannelTypes(
								ChannelType.GuildAnnouncement,
								ChannelType.GuildText,
							),
					)
					.toJSON(),
			],
		});
	},
});
