import { Command } from "../structs/Command";
import {
	APIRole,
	ChannelType,
	MessageFlags,
	RouteBases,
	Routes,
} from "discord-api-types/v10";
import { ActionRowBuilder, ChannelSelectMenuBuilder } from "builders";
import { REDIS } from "../things";
import { encodeToHex } from "serialize";

// Part 1 ## select channel
new Command({
	name: "setup",
	flags: MessageFlags.Ephemeral,
	run: async (ctx) => {
		if (!ctx.guildId)
			return await ctx.editReply({
				content: "Guild not found.",
			});

		// Delete the data if it exists
		await REDIS.del(`roles-bot-setup:${ctx.guildId}`);

		const roles = (await (
			await fetch(`${RouteBases.api}${Routes.guildRoles(ctx.guildId)}`, {
				headers: {
					Authorization: `Bot ${ctx.env.token}`,
				},
			})
		).json()) as APIRole[];

		await REDIS.setex(
			`roles-bot-setup-roles:${ctx.guildId}`,
			encodeToHex(
				roles.map((r) => ({
					id: r.id,
					name: r.name,
				})),
			),
			3600,
		);

		await ctx.editReply({
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
	},
});
