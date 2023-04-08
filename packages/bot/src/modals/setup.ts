import {
	ButtonStyle,
	InteractionResponseType,
	MessageFlags,
	TextInputStyle,
} from "discord-api-types/v10";
import { Modal } from "../structs/Modal";
import { ActionRowBuilder, ButtonBuilder, TextInputBuilder } from "builders";
import { serializers } from "serialize";

// Part 5 Roles ## add label, placeholder, emoji OR message content
new Modal({
	id: "setup:part-roles-lpe",
	acknowledge: false,
	run: async (ctx) => {
		const previousData = ctx.decodedId.data;
		const rawRoleIds = previousData.rawRoleIds as string[];
		const roleIds = (previousData.roleIds ?? []) as {
			label: string;
			placeholder: string;
			emoji: string;
		}[];

		const label = ctx.interaction.data.components[0].components[0].value;
		const placeholder = ctx.interaction.data.components[1].components[0].value;
		const emoji = ctx.interaction.data.components[2].components[0].value;

		roleIds.push({ label, placeholder, emoji });

		rawRoleIds.shift();
		previousData.rawRoleIds = rawRoleIds;
		const data = { ...previousData, roleIds };

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
								.setCustomId(
									serializers.genericObject.encodeCustomId({
										type: "setup:part-roles",
										data,
									}),
								)
								.setStyle(ButtonStyle.Primary),
						)
						.toJSON(),
				],
			},
		});
	},
});

// Part 6 Message Content ## select send as webhook/as bot
new Modal({
	id: "setup:part-messageContent",
	flags: MessageFlags.Ephemeral,
	run: async (ctx) => {
		const previousData = ctx.decodedId.data;
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

		const data = {
			...previousData,
			message: { content, embedTitle, embedDescription, embedColor },
		};

		await ctx.editReply({
			content:
				"Choose whether you want to send the message as a webhook or as a bot.",
			components: [
				new ActionRowBuilder<ButtonBuilder>()
					.addComponents(
						new ButtonBuilder()
							.setLabel("Webhook")
							.setCustomId(
								serializers.genericObject.encodeCustomId({
									type: "setup:part-sendAs",
									data: {
										...data,
										sendAs: 1,
									},
								}),
							)
							.setStyle(ButtonStyle.Primary),
						new ButtonBuilder()
							.setLabel("Bot")
							.setCustomId(
								serializers.genericObject.encodeCustomId({
									type: "setup:part-sendAs",
									data: {
										...data,
										sendAs: 2,
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
