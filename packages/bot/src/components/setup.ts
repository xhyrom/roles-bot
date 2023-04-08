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
import { serializers } from "serialize";
import returnRoleLpe from "../utils/returnRoleLpe";

// Part 2 Channels ## select button/dropdowns
new Component({
	id: "setup:part-channel",
	flags: MessageFlags.Ephemeral,
	run: async (ctx) => {
		const interaction =
			ctx.interaction as APIMessageComponentSelectMenuInteraction;
		const channelId = interaction.data.values[0];

		await ctx.editReply({
			content:
				"Choose whether you want to use buttons or dropdown menu (select menu).",
			components: [
				new ActionRowBuilder<ButtonBuilder>()
					.addComponents(
						new ButtonBuilder()
							.setLabel("Buttons")
							.setCustomId(
								serializers.genericObject.encodeCustomId({
									type: "setup:part-selecting",
									data: {
										channelId,
										selecting: 1,
									},
								}),
							)
							.setStyle(ButtonStyle.Primary),
						new ButtonBuilder()
							.setLabel("Dropdowns")
							.setCustomId(
								serializers.genericObject.encodeCustomId({
									type: "setup:part-selecting",
									data: {
										channelId,
										selecting: 2,
									},
								}),
							)
							.setStyle(ButtonStyle.Primary),
					)
					.toJSON(),
			],
		});
	},
});

// Part 3 Selecting ## select roles
new Component({
	id: "setup:part-selecting",
	flags: MessageFlags.Ephemeral,
	run: async (ctx) => {
		const data = ctx.decodedId.data;

		await ctx.editReply({
			content: "Select the roles that will be available in the menu.",
			components: [
				new ActionRowBuilder<RoleSelectMenuBuilder>()
					.addComponents(
						new RoleSelectMenuBuilder()
							.setCustomId(
								serializers.genericObject.encodeCustomId({
									type: "setup:part-roles",
									data,
								}),
							)
							.setPlaceholder("Select roles")
							.setMinValues(1)
							.setMaxValues(25),
					)
					.toJSON(),
			],
		});
	},
});

// Part 4 Roles ## open modal for role lpe OR message preview
new Component({
	id: "setup:part-roles",
	acknowledge: false,
	run: (ctx) => {
		const previousData = ctx.decodedId.data;
		const interaction =
			ctx.interaction as APIMessageComponentSelectMenuInteraction;
		const rawRoleIds =
			(previousData.rawRoleIds as string[]) ?? interaction.data.values;

		const data = { ...previousData, rawRoleIds };

		return rawRoleIds.length > 0
			? returnRoleLpe(data, ctx, rawRoleIds[0])
			: ctx.returnModal({
					title: "Message Preview",
					custom_id: serializers.genericObject.encodeCustomId({
						type: "setup:part-messageContent",
						data,
					}),
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

// Part 7 Send As ## finish
new Component({
	id: "setup:part-sendAs",
	acknowledge: false,
	run: async (ctx) => {
		const channelId = ctx.decodedId.data.channelId;
		const selecting =
			ctx.decodedId.data.selecting === 1 ? "buttons" : "dropdowns";
		const roleIds = ctx.decodedId.data.roleIds as {
			label: string;
			placeholder: string;
			emoji: string;
		}[];
		const message = ctx.decodedId.data.message;
		const sendAs = ctx.decodedId.data.sendAs === 1 ? "webhook" : "bot";

		console.log(channelId, roleIds, message, sendAs);

		// TODO: finish sending
		const actionRow = new ActionRowBuilder();

		switch (selecting) {
			case "buttons": {
				// TOOD: finish
			}
			case "dropdowns": {
				// TODO: finish
			}
		}

		return ctx.respond({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: "Done!",
				flags: MessageFlags.Ephemeral,
			},
		});
	},
});
