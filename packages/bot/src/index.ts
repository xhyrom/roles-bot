import "./commands/setup";
import "./components/setup";
import "./modals/setup";

import {
	APIApplicationCommandInteraction,
	APIMessageComponentInteraction,
	APIModalSubmitInteraction,
	APIPingInteraction,
	InteractionResponseType,
	InteractionType,
} from "discord-api-types/v10";
import { COMMANDS, COMPONENTS, MODALS } from "./registers";
import { verify } from "./utils/verify";
import respond from "./utils/respond";
import { CommandContext } from "./structs/contexts/CommandContext";
import { ComponentContext } from "./structs/contexts/ComponentContext";
import { ModalContext } from "./structs/contexts/ModalContext";

export default {
	fetch: async (request: Request, env: Env) => {
		if (
			!request.headers.get("X-Signature-Ed25519") ||
			!request.headers.get("X-Signature-Timestamp")
		)
			return Response.redirect("https://xhyrom.dev");
		if (!(await verify(request, env)))
			return new Response("Invalid request signature", { status: 401 });

		const interaction = (await request.json()) as
			| APIPingInteraction
			| APIApplicationCommandInteraction
			| APIModalSubmitInteraction
			| APIMessageComponentInteraction;

		if (interaction.type === InteractionType.Ping)
			return respond({
				type: InteractionResponseType.Pong,
			});

		switch (interaction.type) {
			case InteractionType.ApplicationCommand: {
				const command = COMMANDS.find(
					(cmd) => cmd.name === interaction.data.name,
				);

				if (!command) return new Response("Unknown command", { status: 404 });

				try {
					if (command.acknowledge)
						return respond({
							type: InteractionResponseType.DeferredChannelMessageWithSource,
							data: {
								flags: command.flags,
							},
						});
				} finally {
					if (command.acknowledge)
						command.run(new CommandContext(interaction, env));
					// rome-ignore lint/correctness/noUnsafeFinally: it works, must do better typings etc...
					else return command.run(new CommandContext(interaction, env));
				}

				break;
			}
			case InteractionType.ModalSubmit: {
				const modal = MODALS.find((md) => md.id === interaction.data.custom_id);

				if (!modal) return new Response("Unknown modal", { status: 404 });

				try {
					return respond({
						type: InteractionResponseType.DeferredChannelMessageWithSource,
						data: {
							flags: modal.flags,
						},
					});
				} finally {
					modal.run(new ModalContext(interaction, env));
				}
			}
			case InteractionType.MessageComponent: {
				const component = COMPONENTS.find(
					(cmp) => cmp.id === interaction.data.custom_id,
				);

				if (!component)
					return new Response("Unknown component", { status: 404 });

				try {
					if (component.acknowledge)
						return respond({
							type: InteractionResponseType.DeferredChannelMessageWithSource,
							data: {
								flags: component.flags,
							},
						});
				} finally {
					if (component.acknowledge)
						component.run(new ComponentContext(interaction, env));
					// rome-ignore lint/correctness/noUnsafeFinally: it works, must do better typings etc...
					else return component.run(new ComponentContext(interaction, env));
				}
			}
		}
	},
};
