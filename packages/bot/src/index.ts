import "./commands/setup";
import {
	APIApplicationCommandInteraction,
	APIMessageComponentInteraction,
	APIPingInteraction,
	InteractionResponseType,
	InteractionType,
} from "discord-api-types/v10";
import { COMMANDS, COMPONENTS } from "./registers";
import { verify } from "./utils/verify";
import respond from "./utils/respond";

console.log(COMMANDS);

export default {
	fetch: async (request: Request) => {
		if (
			!request.headers.get("X-Signature-Ed25519") ||
			!request.headers.get("X-Signature-Timestamp")
		)
			return Response.redirect("https://xhyrom.dev");
		if (!(await verify(request)))
			return new Response("Invalid request signature", { status: 401 });

		const interaction = (await request.json()) as
			| APIPingInteraction
			| APIApplicationCommandInteraction
			| APIMessageComponentInteraction;

		if (interaction.type === InteractionType.Ping)
			return respond({
				type: InteractionResponseType.Pong,
			});

		if (interaction.type === InteractionType.ApplicationCommand) {
			const command = COMMANDS.find(
				(cmd) => cmd.name === interaction.data.name,
			);

			if (!command) return new Response("Unknown command", { status: 404 });
			return command.run(interaction);
		}

		const component = COMPONENTS.find(
			(cmp) => cmp.id === interaction.data.custom_id,
		);

		if (!component) return new Response("Unknown component", { status: 404 });
		return component.run(interaction);
	},
};
