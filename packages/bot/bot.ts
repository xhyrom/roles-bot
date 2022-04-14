import { APIApplicationCommandInteraction, APIMessageComponentInteraction, APIPingInteraction, ApplicationCommandType, ComponentType, InteractionResponseType, InteractionType, MessageFlags, RouteBases, Routes } from 'discord-api-types/v9';
import { badFormatting } from './utils/badFormatting';
import { isJSON } from './utils/isJson';
import { resolveButtonComponents, resolveSelectMenuComponents } from './utils/resolveComponents';
import { respond } from './utils/respond';
import { verify } from './utils/verify';

export const handleRequest = async(request: Request): Promise<Response> => {
	if (!request.headers.get('X-Signature-Ed25519') || !request.headers.get('X-Signature-Timestamp')) return Response.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
	if (!await verify(request)) return new Response('', { status: 401 });

	const interaction = await request.json() as APIPingInteraction | APIApplicationCommandInteraction | APIMessageComponentInteraction;

	console.log(interaction);
	if (interaction.type === InteractionType.Ping)
		return respond({
			type: InteractionResponseType.Pong
		});

	if (interaction.type === InteractionType.ApplicationCommand && interaction.data.type === ApplicationCommandType.ChatInput && interaction.data.name === 'setup') {
		if ((Number(interaction.member?.permissions) & 0x10) !== 0x10) return respond({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				flags: 64,
				content: 'Required permissions: `MANAGE_ROLES`'
			}
		});

		// @ts-expect-error No typings for value
		const json = isJSON(interaction.data.options?.[0]?.value) ? JSON.parse(interaction.data.options?.[0]?.value) : null;
		if (!json) return badFormatting();

		const channelId = json.channel;
		let message = json.message?.toString();
		let roles = json.roles;

		if (!channelId) return badFormatting();
		if (!message) message = '​';
		if (!roles || Object.values(json.roles).filter((role: any) => role.id && role.label).length === 0 || roles.length === 0 || roles.length > 25) return badFormatting(roles.length > 25);

		const finalComponents = json.type === 1 ? resolveButtonComponents(roles) : resolveSelectMenuComponents(roles, json.placeholder?.toString());

		const fetched = await fetch(`${RouteBases.api}/channels/${channelId}/messages`, {
			method: 'POST',
			headers: {
				'Authorization': `Bot ${CLIENT_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				content: message,
				components: finalComponents
			})
		}).catch(e => e);

		return respond({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				flags: 64,
				content: fetched?.ok ? 'Done!' : 'Error, bad channel id/missing permissions.'
			}
		});
	} else if (interaction.type === InteractionType.MessageComponent) {
		const roleId = interaction.data.component_type === ComponentType.Button ? interaction.data.custom_id : interaction.data.values[0];
		const url = `${RouteBases.api}${Routes.guildMemberRole(interaction.guild_id || '', interaction.member?.user.id || '', roleId)}`;

		let method = '';
		let content = '';

		if (!interaction?.member?.roles?.includes(roleId)) {
			content = `Gave the <@&${roleId}> role!`;
			method = 'PUT';
		} else {
			content = `Removed the <@&${roleId}> role!`;
			method = 'DELETE';
		}

		await fetch(url, {
			method: method,
			headers: {
				'Authorization': `Bot ${CLIENT_TOKEN}`
			}
		}).catch(e => e);
        
		return respond({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				flags: MessageFlags.Ephemeral,
				content: content,
				allowed_mentions: { parse: [] }
			}
		});
	} else {
		return respond({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				flags: MessageFlags.Ephemeral,
				content: 'Beep boop, boop beep?'
			}
		});
	}
};