import { Command } from "../structs/Command";
import {
	ChannelType,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { ActionRowBuilder, ChannelSelectMenuBuilder } from "builders";
import { serializers } from "serialize";

// Part 1 ## select channel
new Command({
	name: "setup",
	acknowledge: false,
	run: async (ctx) => {
		return ctx.respond({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: "Select the channel to which the panel will be sent.",
				components: [
					new ActionRowBuilder<ChannelSelectMenuBuilder>()
						.addComponents(
							new ChannelSelectMenuBuilder()
								.setCustomId(
									serializers.genericObject.encodeCustomId({
										type: "setup:part-channel",
									}),
								)
								.addChannelTypes(
									ChannelType.GuildAnnouncement,
									ChannelType.GuildText,
								),
						)
						.toJSON(),
				],
				flags: MessageFlags.Ephemeral,
			},
		});
	},
});
