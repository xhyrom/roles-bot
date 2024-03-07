import {
	APIMessageApplicationCommandInteractionDataResolved,
	InteractionResponseType,
	MessageFlags,
	RouteBases,
	Routes,
	APIRole,
	ButtonStyle,
} from "discord-api-types/v10";
import { Command } from "../structs/Command";
import { ActionRowBuilder, ButtonBuilder } from "builders";
import { REDIS } from "../things";
import { encodeToHex } from "serialize";

new Command({
	name: "Edit Message",
	acknowledge: false,
	run: async (ctx) => {
		if (!ctx.guildId)
			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "Guild not found.",
				},
			});

		const resolved = ctx.interaction.data
			.resolved as APIMessageApplicationCommandInteractionDataResolved;
		const messages = resolved.messages;
		const message = Object.values(messages)[0];

		if (message.author.id !== ctx.env.applicationId) {
			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "This message was not sent by me.",
					flags: MessageFlags.Ephemeral,
				},
			});
		}

		// Delete the data if it exists
		await REDIS.del(`roles-bot-setup:${ctx.guildId}`);

		await REDIS.setex(
			`roles-bot-setup:${ctx.guildId}`,
			600,
			encodeToHex({
				channelId: message.channel_id,
				originalMessageId: message.id,
				sendAs: "bot",
			}),
		);

		const roles = (await (
			await fetch(`${RouteBases.api}${Routes.guildRoles(ctx.guildId)}`, {
				headers: {
					Authorization: `Bot ${ctx.env.token}`,
				},
			})
		).json()) as APIRole[];

		await REDIS.setex(
			`roles-bot-setup-roles:${ctx.guildId}`,
			3600,
			encodeToHex(
				roles.map((r) => ({
					id: r.id,
					name: r.name,
				})),
			),
		);

		return ctx.respond({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content:
					"Choose whether you want to use buttons or dropdown menu (select menu).",
				components: [
					new ActionRowBuilder<ButtonBuilder>()
						.addComponents(
							new ButtonBuilder()
								.setLabel("Buttons")
								.setCustomId("setup:part-selecting:buttons")
								.setStyle(ButtonStyle.Primary),
							new ButtonBuilder()
								.setLabel("Dropdowns")
								.setCustomId("setup:part-selecting:dropdowns")
								.setStyle(ButtonStyle.Primary),
						)
						.toJSON(),
				],
				flags: MessageFlags.Ephemeral,
			},
		});
	},
});
