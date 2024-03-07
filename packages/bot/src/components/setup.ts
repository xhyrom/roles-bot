import {
	ActionRowBuilder,
	ButtonBuilder,
	RoleSelectMenuBuilder,
	TextInputBuilder,
} from "builders";
import { Component } from "../structs/Component";
import {
	APIMessageComponentSelectMenuInteraction,
	ButtonStyle,
	InteractionResponseType,
	MessageFlags,
	TextInputStyle,
} from "discord-api-types/v10";
import returnRoleLpe from "../utils/returnRoleLpe";
import { REDIS } from "../things";
import { encodeToHex, decodeFromString } from "serialize";
import sendFinal from "../utils/sendFinal";

// Part 2 Channels ## select button/dropdowns
new Component({
	id: "setup:part-channel",
	acknowledge: false,
	run: async (ctx) => {
		if (!ctx.interaction.guild_id)
			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "Guild not found.",
				},
			});

		const interaction =
			ctx.interaction as APIMessageComponentSelectMenuInteraction;

		const data = {
			channelId: interaction.data.values[0],
		};

		await REDIS.setex(
			`roles-bot-setup:${interaction.guild_id}`,
			600,
			encodeToHex(data),
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

// Part 3 Selecting ## select roles
new Component({
	id: "setup:part-selecting",
	acknowledge: false,
	run: async (ctx) => {
		if (!ctx.interaction.guild_id)
			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "Guild not found.",
					flags: MessageFlags.Ephemeral,
				},
			});

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
		data.selecting = ctx.interaction.data.custom_id.split(":")[2];

		await REDIS.setex(
			`roles-bot-setup:${ctx.interaction.guild_id}`,
			600,
			encodeToHex(data),
		);

		return ctx.respond({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: "Select the roles that will be available in the menu.",
				components: [
					new ActionRowBuilder<RoleSelectMenuBuilder>()
						.addComponents(
							new RoleSelectMenuBuilder()
								.setCustomId("setup:part-roles")
								.setPlaceholder("Select roles")
								.setMinValues(1)
								.setMaxValues(25),
						)
						.toJSON(),
				],
				flags: MessageFlags.Ephemeral,
			},
		});
	},
});

// Part 4 Roles ## open modal for role lpe OR message preview
new Component({
	id: "setup:part-roles",
	acknowledge: false,
	run: async (ctx) => {
		if (!ctx.interaction.guild_id)
			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "Guild not found.",
					flags: MessageFlags.Ephemeral,
				},
			});

		const interaction =
			ctx.interaction as APIMessageComponentSelectMenuInteraction;

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
		const rawRoleIds = (data.rawRoleIds as string[]) ?? interaction.data.values;

		data.rawRoleIds = rawRoleIds;

		await REDIS.setex(
			`roles-bot-setup:${ctx.interaction.guild_id}`,
			600,
			encodeToHex(data),
		);

		return rawRoleIds.length > 0
			? returnRoleLpe(data, ctx, rawRoleIds[0])
			: ctx.returnModal({
					title: "Message Preview",
					custom_id: "setup:part-messageContent",
					components: [
						new ActionRowBuilder<TextInputBuilder>()
							.addComponents(
								new TextInputBuilder()
									.setLabel("Content")
									.setCustomId("content")
									.setPlaceholder("Select beautiful roles <3")
									.setStyle(TextInputStyle.Paragraph)
									.setMaxLength(2000)
									.setRequired(false),
							)
							.toJSON(),
						new ActionRowBuilder<TextInputBuilder>()
							.addComponents(
								new TextInputBuilder()
									.setLabel("Embed Title")
									.setCustomId("embedTitle")
									.setPlaceholder("I love you")
									.setStyle(TextInputStyle.Paragraph)
									.setMaxLength(256)
									.setRequired(false),
							)
							.toJSON(),
						new ActionRowBuilder<TextInputBuilder>()
							.addComponents(
								new TextInputBuilder()
									.setLabel("Embed Description")
									.setCustomId("embedDescription")
									.setPlaceholder("1. lol\n2. lol\n3. lol")
									.setStyle(TextInputStyle.Paragraph)
									.setMaxLength(4000)
									.setRequired(false),
							)
							.toJSON(),
						new ActionRowBuilder<TextInputBuilder>()
							.addComponents(
								new TextInputBuilder()
									.setLabel("Embed Color")
									.setCustomId("embedColor")
									.setPlaceholder("#4287f5")
									.setStyle(TextInputStyle.Short)
									.setMaxLength(7)
									.setRequired(false),
							)
							.toJSON(),
					],
			  });
	},
});

// Part 7 Send As ## finish or open modal for webhook preview
new Component({
	id: "setup:part-sendAs",
	acknowledge: false,
	run: async (ctx) => {
		if (!ctx.guildId)
			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "Guild not found.",
					flags: MessageFlags.Ephemeral,
				},
			});

		const rawData = await REDIS.get(`roles-bot-setup:${ctx.guildId}`);
		if (!rawData)
			return ctx.respond({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "Data not found. Try running setup again.",
					flags: MessageFlags.Ephemeral,
				},
			});

		const data = decodeFromString(rawData);
		const sendAs = ctx.interaction.data.custom_id.split(":")[2];
		data.sendAs = sendAs;

		await REDIS.setex(
			`roles-bot-setup:${ctx.interaction.guild_id}`,
			600,
			encodeToHex(data),
		);

		switch (sendAs) {
			case "webhook": {
				return ctx.returnModal({
					title: "Webhook Preview",
					custom_id: "setup:part-webhook",
					components: [
						new ActionRowBuilder<TextInputBuilder>()
							.addComponents(
								new TextInputBuilder()
									.setLabel("Webhook Name")
									.setCustomId("name")
									.setPlaceholder("Roles Bot")
									.setStyle(TextInputStyle.Short)
									.setMaxLength(80)
									.setRequired(true),
							)
							.toJSON(),
						new ActionRowBuilder<TextInputBuilder>()
							.addComponents(
								new TextInputBuilder()
									.setLabel("Webhook Avatar URL")
									.setCustomId("avatarUrl")
									.setPlaceholder(
										"https://raw.githubusercontent.com/Hyro-Blobs/blobs/main/base/hyro_blob-upscaled.png",
									)
									.setStyle(TextInputStyle.Short)
									.setRequired(false),
							)
							.toJSON(),
					],
				});
			}
			case "bot": {
				return sendFinal(ctx, data);
			}
		}
	},
});
