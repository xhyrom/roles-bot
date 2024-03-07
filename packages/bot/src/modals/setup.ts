import {
	APIWebhook,
	ButtonStyle,
	InteractionResponseType,
	MessageFlags,
	RouteBases,
	Routes,
} from "discord-api-types/v10";
import { Modal } from "../structs/Modal";
import { ActionRowBuilder, ButtonBuilder } from "builders";
import { encodeToHex, decodeFromString } from "serialize";
import { REDIS } from "../things";
import sendFinal from "../utils/sendFinal";
import { RoleId } from "../types";

// Part 5 Roles ## add label, placeholder, emoji OR message content
new Modal({
	id: "setup:part-roles-lpe",
	acknowledge: false,
	run: async (ctx) => {
		const rawData = await REDIS.get(
			`roles-bot-setup:${ctx.interaction.guild_id}`,
		);
		if (!rawData)
			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "Data not found. Try running setup again.",
					flags: MessageFlags.Ephemeral,
				},
			});

		const data = decodeFromString(rawData);
		const rawRoleIds = data.rawRoleIds as string[];
		const roleIds = (data.roleIds ?? []) as RoleId[];

		const label = ctx.interaction.data.components[0].components[0].value;
		const emoji = ctx.interaction.data.components[1].components[0].value;

		switch (data.selecting) {
			case "buttons": {
				const style = ctx.interaction.data.components[2].components[0].value;

				roleIds.push({ label, style, emoji, id: rawRoleIds[0] });

				break;
			}
			case "dropdowns": {
				const description =
					ctx.interaction.data.components[2].components[0].value;

				roleIds.push({ label, description, emoji, id: rawRoleIds[0] });

				break;
			}
		}

		rawRoleIds.shift();
		data.rawRoleIds = rawRoleIds;
		data.roleIds = roleIds;

		await REDIS.setex(
			`roles-bot-setup:${ctx.interaction.guild_id}`,
			600,
			encodeToHex(data),
		);

		return ctx.respond({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content:
					rawRoleIds.length > 0
						? "Click the button to set the label, placeholder and emoji for next role."
						: "Click the button to set message content or embed.",
				components: [
					new ActionRowBuilder<ButtonBuilder>()
						.addComponents(
							new ButtonBuilder()
								.setLabel(
									rawRoleIds.length > 0 ? "Next Role" : "Message Content",
								)
								.setCustomId("setup:part-roles")
								.setStyle(ButtonStyle.Primary),
						)
						.toJSON(),
				],
				flags: MessageFlags.Ephemeral,
			},
		});
	},
});

// Part 6 Message Content ## select send as webhook/as bot
new Modal({
	id: "setup:part-messageContent",
	acknowledge: false,
	run: async (ctx) => {
		const rawData = await REDIS.get(
			`roles-bot-setup:${ctx.interaction.guild_id}`,
		);
		if (!rawData)
			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "Data not found. Try running setup again.",
					flags: MessageFlags.Ephemeral,
				},
			});

		const data = decodeFromString(rawData);

		const content = ctx.interaction.data.components[0].components[0].value;
		const embedTitle = ctx.interaction.data.components[1].components[0].value;
		const embedDescription =
			ctx.interaction.data.components[2].components[0].value;
		const embedColor = ctx.interaction.data.components[3].components[0].value;

		if (!content && !embedTitle && !embedDescription) {
			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "You must provide a message content or embed.",
					components: [],
					flags: MessageFlags.Ephemeral,
				},
			});
		}

		data.message = { content, embedTitle, embedDescription, embedColor };

		if (data.originalMessageId) {
			return sendFinal(ctx, data);
		}

		await REDIS.setex(
			`roles-bot-setup:${ctx.interaction.guild_id}`,
			600,
			encodeToHex(data),
		);

		return ctx.respond({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content:
					"Choose whether you want to send the message as a webhook or as a bot.",
				components: [
					new ActionRowBuilder<ButtonBuilder>()
						.addComponents(
							new ButtonBuilder()
								.setLabel("Webhook")
								.setCustomId("setup:part-sendAs:webhook")
								.setStyle(ButtonStyle.Primary),
							new ButtonBuilder()
								.setLabel("Bot")
								.setCustomId("setup:part-sendAs:bot")
								.setStyle(ButtonStyle.Primary),
						)
						.toJSON(),
				],
				flags: MessageFlags.Ephemeral,
			},
		});
	},
});

// Part 8 (ONLY IF WEBHOOK) Webhook ## send webhook
new Modal({
	id: "setup:part-webhook",
	acknowledge: false,
	run: async (ctx) => {
		const rawData = await REDIS.get(
			`roles-bot-setup:${ctx.interaction.guild_id}`,
		);
		if (!rawData)
			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "Data not found. Try running setup again.",
					flags: MessageFlags.Ephemeral,
				},
			});

		const data = decodeFromString(rawData);

		const webhookName = ctx.interaction.data.components[0].components[0].value;
		const webhookAvatarUrl =
			ctx.interaction.data.components[1].components[0].value;

		const webhook = (await (
			await fetch(
				`${RouteBases.api}${Routes.channelWebhooks(data.channelId)}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bot ${ctx.env.token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: "Roles Bot Webhook",
					}),
				},
			)
		).json()) as APIWebhook;

		data.webhook = {
			name: webhookName,
			avatarUrl: webhookAvatarUrl,
			id: webhook.id,
			token: webhook.token,
		};

		return sendFinal(ctx, data);
	},
});
