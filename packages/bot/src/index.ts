import "./commands/setup";
import "./commands/info";
import "./commands/edit_message";
import "./components/setup";
import "./components/select";
import "./modals/setup";

import {
	APIApplicationCommandInteraction,
	APIMessageApplicationCommandInteraction,
	APIMessageComponentInteraction,
	APIModalSubmitInteraction,
	APIPingInteraction,
	InteractionResponseType,
	InteractionType,
} from "discord-api-types/v10";
import { COMMANDS, COMPONENTS, MODALS, REDIS, setRedis } from "./things";
import { verify } from "./utils/verify";
import respond from "./utils/respond";
import { CommandContext } from "./structs/contexts/CommandContext";
import { ComponentContext } from "./structs/contexts/ComponentContext";
import { ModalContext } from "./structs/contexts/ModalContext";
import { Env } from "./types";
import { Redis } from "@upstash/redis/cloudflare";

export default {
	fetch: async (request: Request, env: Env) => {
		if (!REDIS) setRedis(Redis.fromEnv(env));

		if (new URL(request.url).pathname === "/ping") {
			return new Response("Pong!", { status: 200 });
		}

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
			| APIMessageApplicationCommandInteraction
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
				} catch (e) {
					console.log(e);
				} finally {
					if (command.acknowledge)
						command.run(new CommandContext(interaction, env));
					// rome-ignore lint/correctness/noUnsafeFinally: it works, must do better typings etc...
					else return command.run(new CommandContext(interaction, env));
				}

				break;
			}
			case InteractionType.ModalSubmit: {
				const context = new ModalContext(interaction, env);
				const modal = MODALS.find((md) =>
					context.interaction.data.custom_id.startsWith(md.id),
				);

				if (!modal) return new Response("Unknown modal", { status: 404 });

				try {
					if (modal.acknowledge)
						return respond({
							type: InteractionResponseType.DeferredChannelMessageWithSource,
							data: {
								flags: modal.flags,
							},
						});
				} catch (e) {
					console.log(e);
				} finally {
					if (modal.acknowledge) modal.run(context);
					// rome-ignore lint/correctness/noUnsafeFinally: it works, must do better typings etc...
					else return modal.run(context);
				}

				break;
			}
			case InteractionType.MessageComponent: {
				const context = new ComponentContext(interaction, env);
				const component =
					COMPONENTS.find((cmp) =>
						context.interaction.data.custom_id.startsWith(cmp.id),
					) ?? COMPONENTS.find((cmp) => cmp.default);

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
				} catch (e) {
					console.log(e);
				} finally {
					if (component.acknowledge) component.run(context);
					// rome-ignore lint/correctness/noUnsafeFinally: it works, must do better typings etc...
					else return component.run(context);
				}
			}
		}
	},
};
