import { Command } from "../structs/Command";

new Command({
	name: "setup",
	run: async (ctx) => {
		await ctx.editReply({
			content: "Setup",
		});
	},
});
