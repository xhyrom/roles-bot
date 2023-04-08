import { Command } from "../structs/Command";
import { MessageFlags, TextInputStyle } from "discord-api-types/v10";
import { ActionRowBuilder, TextInputBuilder } from "builders";

new Command({
	name: "setup",
	flags: MessageFlags.Ephemeral,
	acknowledge: false,
	run: async (ctx) => {
		return ctx.returnModal({
			title: "Setup",
			custom_id: "test",
			components: [
				new ActionRowBuilder<TextInputBuilder>()
					.addComponents(
						new TextInputBuilder()
							.setLabel("ASDSAD")
							.setCustomId("prefix")
							.setPlaceholder("Prefix")
							.setStyle(TextInputStyle.Paragraph)
							.setRequired(true),
					)
					.toJSON(),
			],
		});

		/**
		 * await ctx.editReply({
			content: "Select the channel to which the panel will be sent.",
			components: [
				new ActionRowBuilder<ChannelSelectMenuBuilder>()
					.addComponents(
						new ChannelSelectMenuBuilder()
							.setCustomId("setup:part-channel")
							.addChannelTypes(
								ChannelType.GuildAnnouncement,
								ChannelType.GuildText,
							),
					)
					.toJSON(),
			],
		});
		 */
	},
});
