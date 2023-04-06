import { InteractionResponseType } from "discord-api-types/v10";
import { Command } from "../structs/Command";
import respond from "../utils/respond";

new Command({
	name: "setup",
	run: async () => {
		return respond({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: "Setup",
			},
		});
	},
});
