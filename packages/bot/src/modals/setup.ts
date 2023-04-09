import {
	ButtonStyle,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { Modal } from "../structs/Modal";
import { ActionRowBuilder, ButtonBuilder } from "builders";
import { encodeToHex, decodeFromString } from "serialize";
import { REDIS } from "../things";

// Part 5 Roles ## add label, placeholder, emoji OR message content
new Modal({
	id: "setup:part-roles-lpe",
	run: async (ctx) => {
		const rawData = await REDIS.get(
			`roles-bot-setup:${ctx.interaction.guild_id}`,
		);
		if (!rawData)
			return await ctx.editReply({
				content: "Data not found. Try running setup again.",
			});

		const data = decodeFromString(rawData);
		const rawRoleIds = data.rawRoleIds as string[];
		const roleIds = (data.roleIds ?? []) as {
			label: string;
			placeholder: string;
			emoji: string;
		}[];

		const label = ctx.interaction.data.components[0].components[0].value;
		const placeholder = ctx.interaction.data.components[1].components[0].value;
		const emoji = ctx.interaction.data.components[2].components[0].value;

		roleIds.push({ label, placeholder, emoji });

		rawRoleIds.shift();
		data.rawRoleIds = rawRoleIds;

		await REDIS.setex(
			`roles-bot-setup:${ctx.interaction.guild_id}`,
			encodeToHex(data),
			600,
		);

		return await ctx.editReply({
			content:
				rawRoleIds.length > 0
					? "Click the button to set the label, placeholder and emoji for next role."
					: "Click the button to set message content or embed.",
			components: [
				new ActionRowBuilder<ButtonBuilder>()
					.addComponents(
						new ButtonBuilder()
							.setLabel(rawRoleIds.length > 0 ? "Next Role" : "Message Content")
							.setCustomId("setup:part-roles")
							.setStyle(ButtonStyle.Primary),
					)
					.toJSON(),
			],
		});
	},
});

// Part 6 Message Content ## select send as webhook/as bot
new Modal({
	id: "setup:part-messageContent",
	flags: MessageFlags.Ephemeral,
	run: async (ctx) => {
		const rawData = await REDIS.get(
			`roles-bot-setup:${ctx.interaction.guild_id}`,
		);
		if (!rawData)
			return await ctx.editReply({
				content: "Data not found. Try running setup again.",
			});

		const data = decodeFromString(rawData);

		const content = ctx.interaction.data.components[0].components[0].value;
		const embedTitle = ctx.interaction.data.components[1].components[0].value;
		const embedDescription =
			ctx.interaction.data.components[2].components[0].value;
		const embedColor = ctx.interaction.data.components[3].components[0].value;

		if (!content && !embedTitle && !embedDescription) {
			await ctx.editReply({
				content: "You must provide a message content or embed.",
				components: [],
			});

			return;
		}

		data.message = { content, embedTitle, embedDescription, embedColor };

		await REDIS.setex(
			`roles-bot-setup:${ctx.interaction.guild_id}`,
			encodeToHex(data),
			600,
		);

		await ctx.editReply({
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
		});
	},
});
