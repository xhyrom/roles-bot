import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { Command } from "../structs/Command";

new Command({
	name: "info",
	acknowledge: false,
	run: (ctx) => {
		return ctx.respond({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content:
					"[Website](https://roles-bot.xhyrom.dev/) | [Discord](https://discord.gg/kFPKmEKeMS)",
				flags: MessageFlags.Ephemeral,
			},
		});
	},
});
