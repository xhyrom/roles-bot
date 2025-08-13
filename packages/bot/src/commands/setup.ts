import { Command } from "../structs/Command";
import {
	APIRole,
	ChannelType,
	InteractionResponseType,
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
	acknowledge: false,
	run: async (ctx) => {
		if (!ctx.guildId)
			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "Guild not found.",
				},
			});

		// Delete the data if it exists
		await REDIS.del(`roles-bot-setup:${ctx.guildId}`);

		// Fetch roles
		const rolesResponse = await fetch(`${RouteBases.api}${Routes.guildRoles(ctx.guildId)}`, {
			headers: {
				Authorization: `Bot ${ctx.env.token}`,
			},
		});

		// Handle rate limits
		if (rolesResponse.status === 429) {
			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: `This bot is hosted on the free Cloudflare Workers plan. Currently, Discord sometimes blocks requests from Cloudflare Workers due to global ratelimits, so **you won’t be able to set up a new panel right now**.

To continue, you can either:
**a)** Host your own instance: <https://github.com/xhyrom/roles-bot>
**b)** Wait a while and try again.

As a student, I don’t have resources and stable income for hosting, but I plan to buy a VPS in the next few weeks.

If you enjoy the bot or want to support me, you can do so here: <https://ko-fi.com/xhyrom>.

Thanks for using this bot ♥️.

Sincerely,
Jozef Steinhübl
contact@xhyrom.dev
<https://github.com/xhyrom>
<@525316393768452098>`,
					flags: MessageFlags.Ephemeral,
				},
			});
		}

		const roles = (await rolesResponse.json()) as APIRole[];

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
				flags: MessageFlags.Ephemeral,
			},
		});
	},
});
