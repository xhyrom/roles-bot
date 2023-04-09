import {
	ComponentType,
	MessageFlags,
	RouteBases,
	Routes,
} from "discord-api-types/v10";
import { Component } from "../structs/Component";

new Component({
	id: "select:role",
	default: true,
	flags: MessageFlags.Ephemeral,
	run: async (ctx) => {
		if (!ctx.guildId)
			return ctx.editReply({
				content: "Guild not found.",
			});

		if (!ctx.interaction.member)
			return ctx.editReply({
				content: "Member not found.",
			});

		const roleId =
			ctx.interaction.data.component_type === ComponentType.StringSelect
				? ctx.interaction.data.values[0].startsWith("role:")
					? ctx.interaction.data.values[0].split(":")[1]
					: // support for legacy select menus
					  ctx.interaction.data.values[0]
				: ctx.interaction.data.custom_id.startsWith("role:")
				? ctx.interaction.data.custom_id.split(":")[1]
				: // support for legacy select menus
				  ctx.interaction.data.custom_id;

		const content = !ctx.interaction.member?.roles.includes(roleId)
			? `Gave the <@&${roleId}> role!`
			: `Removed the <@&${roleId}> role!`;

		const method = !ctx.interaction.member?.roles.includes(roleId)
			? "PUT"
			: "DELETE";

		await fetch(
			`${RouteBases.api}${Routes.guildMemberRole(
				ctx.guildId,
				ctx.interaction.member.user.id,
				roleId,
			)}`,
			{
				method,
				headers: {
					Authorization: `Bot ${ctx.env.token}`,
				},
			},
		);

		await ctx.editReply({
			content,
		});
	},
});
