import { ActionRowBuilder, RoleSelectMenuBuilder } from "builders";
import { Component } from "../structs/Component";
import { MessageFlags } from "discord-api-types/v10";

new Component({
	id: "setup:part-channel",
	flags: MessageFlags.Ephemeral,
	run: async (ctx) => {
		await ctx.editReply({
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
		});
	},
});

new Component({
	id: "setup:part-roles",
	flags: MessageFlags.Ephemeral,
	run: async (ctx) => {
		await ctx.editReply({
			content: "done",
			components: [],
		});
	},
});
