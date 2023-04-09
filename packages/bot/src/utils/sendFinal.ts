import {
	APIActionRowComponent,
	APIEmbed,
	APIMessageActionRowComponent,
	ButtonStyle,
	InteractionResponseType,
	MessageFlags,
	RouteBases,
	Routes,
} from "discord-api-types/v10";
import { Context } from "../structs/contexts/Context";
import { REDIS } from "../things";
import {
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from "builders";
import hexToRGB from "./hexToRGB";
import splitArray from "./splitArray";
import { resolvePartialEmoji } from "./resolveEmoji";
import { BasicData } from "../types";
import resolveButtonStyle from "./resolveButtonStyle";

type DataBot = BasicData & {
	sendAs: "bot";
};

type DataWebhook = BasicData & {
	sendAs: "webhook";
	webhook: {
		name: string;
		avatarUrl: string;
		id: string;
		token: string;
	};
};

type Data = DataBot | DataWebhook;

export default async function (ctx: Context, data: Data) {
	await REDIS.del(`roles-bot-setup:${ctx.guildId}`);
	await REDIS.del(`roles-bot-setup-roles:${ctx.guildId}`);

	const payload: {
		content?: string;
		embeds?: APIEmbed[];
		components: APIActionRowComponent<APIMessageActionRowComponent>[];
	} = {
		components: [],
	};

	if (data.message.content) payload.content = data.message.content;
	if (data.message.embedTitle || data.message.embedDescription) {
		payload.embeds = [
			new EmbedBuilder()
				.setTitle(data.message.embedTitle)
				.setDescription(data.message.embedDescription)
				.setColor(
					data.message.embedColor ? hexToRGB(data.message.embedColor) : null,
				)
				.toJSON(),
		];
	}

	const components: APIActionRowComponent<APIMessageActionRowComponent>[] = [];
	const array = splitArray(data.roleIds, 25);
	for (const items of array) {
		const actionRow = new ActionRowBuilder();

		const selectMenu = new StringSelectMenuBuilder().setCustomId("select:role");

		for (const item of items) {
			switch (data.selecting) {
				case "buttons": {
					const button = new ButtonBuilder()
						.setLabel(item.label)
						.setCustomId(`role:${item.id}`)
						// rome-ignore lint/style/noNonNullAssertion: defined
						.setStyle(resolveButtonStyle(item.style!));

					if (item.emoji && resolvePartialEmoji(item.emoji))
						// rome-ignore lint/style/noNonNullAssertion: its fine
						button.setEmoji(resolvePartialEmoji(item.emoji)!);

					actionRow.addComponents(button);

					break;
				}
				case "dropdowns": {
					const option = new StringSelectMenuOptionBuilder()
						.setLabel(item.label)
						// rome-ignore lint/style/noNonNullAssertion: defined
						.setDescription(item.description!)
						.setValue(`role:${item.id}`);

					if (item.emoji && resolvePartialEmoji(item.emoji))
						// rome-ignore lint/style/noNonNullAssertion: its fine
						option.setEmoji(resolvePartialEmoji(item.emoji)!);

					option.setValue(item.id);
					selectMenu.addOptions(option);
				}
			}
		}

		if (data.selecting === "dropdowns") actionRow.addComponents(selectMenu);

		// @ts-expect-error i know i know
		components.push(actionRow);
	}

	payload.components = components;

	switch (data.sendAs) {
		case "bot": {
			const res = await fetch(
				`${RouteBases.api}${Routes.channelMessages(data.channelId)}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bot ${ctx.env.token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				},
			);

			if (!res.ok) {
				const json: { message: string; code: string } = await res.json();
				return ctx.respond({
					type: InteractionResponseType.ChannelMessageWithSource,
					data: {
						content: `Error: ${json.message} (${json.code})`,
						flags: MessageFlags.Ephemeral,
					},
				});
			}

			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "Done!",
					flags: MessageFlags.Ephemeral,
				},
			});
		}
		case "webhook": {
			const res = await fetch(
				`${RouteBases.api}${Routes.webhook(
					data.webhook.id,
					data.webhook.token,
				)}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...payload,
						username: data.webhook.name,
						avatar_url: data.webhook.avatarUrl,
					}),
				},
			);

			await fetch(
				`${RouteBases.api}${Routes.webhook(
					data.webhook.id,
					data.webhook.token,
				)}`,
				{
					method: "DELETE",
				},
			);

			if (!res.ok) {
				const json: { message: string; code: string } = await res.json();
				return ctx.respond({
					type: InteractionResponseType.ChannelMessageWithSource,
					data: {
						content: `Error: ${json.message} (${json.code})`,
						flags: MessageFlags.Ephemeral,
					},
				});
			}

			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "Done!",
					flags: MessageFlags.Ephemeral,
				},
			});
		}
	}
}
