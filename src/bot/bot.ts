import { APIApplicationCommandInteraction, APIInteractionResponse, APIMessageComponentInteraction, APIPingInteraction, InteractionResponseType, InteractionType, MessageFlags, RouteBases, Routes } from 'discord-api-types/v9';
import { isJSON } from './isJson';
import { isSnowflake } from './snowflakeUtils';
import { verify } from './verify';

const respond = (response: APIInteractionResponse) => new Response(JSON.stringify(response), {headers: {'content-type': 'application/json'}});

const badFormatting = (rolesMax?: boolean) => {
	return respond({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			flags: 64,
			content: `${rolesMax ? 'You can have maximum 25 buttons. (5x5)' : 'Bad formatting, generate [here](https://xhyrom.github.io/roles-bot)'}`
		}
	});
};

export const handleRequest = async(request: Request): Promise<Response> => {
	if (!request.headers.get('X-Signature-Ed25519') || !request.headers.get('X-Signature-Timestamp')) return Response.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
	if (!await verify(request)) return new Response('', { status: 401 });

	const interaction = await request.json() as APIPingInteraction | APIApplicationCommandInteraction | APIMessageComponentInteraction;

	if (interaction.type === InteractionType.Ping)
		return respond({
			type: InteractionResponseType.Pong
		});

	if (interaction.type === InteractionType.ApplicationCommand && interaction.data.name === 'setup') {

		if ((Number(interaction.member?.permissions) & 0x10) !== 0x10) return respond({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				flags: 64,
				content: 'Required permissions: `MANAGE_ROLES`'
			}
		});

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const json = isJSON(interaction.data.options[0].value) ? JSON.parse(interaction.data.options[0].value) : null;

		if (!json) return badFormatting();

		const channelId = json.channel;
		const message = json.message?.toString();
		let roles = json.roles;

		if (!channelId) return badFormatting();
		if (!message) return badFormatting();
		if (!roles || Object.values(json.roles).filter((role: any) => role.id && role.label).length === 0 || roles.length === 0 || roles.length > 25) return badFormatting(roles.length > 25);

		roles = roles.map((r: any) => {
			const o: any = {
				type: 2,
				style: r.style || 2,
				label: r.label,
				custom_id: r.id
			};

			if (r.emoji) {
				if (isSnowflake(r.emoji)) o.emoji = { id: r.emoji, name: null };
				else o.emoji = { id: null, name: r.emoji };
			}

			return o;
		});

		const finalComponents = [];
		for (let i = 0; i <= roles.length; i += 5) {
			const row: any = {
				type: 1,
				components: []
			};

			const btnslice: any = roles.slice(i, i + 5);

			for (let y = 0; y < btnslice.length; y++) row.components.push(btnslice[y]);
            
			finalComponents.push(row);
		}

		await fetch(`${RouteBases.api}/channels/${channelId}/messages`, {
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
				content: 'Done!'
			}
		});
	} else if (interaction.type === InteractionType.MessageComponent) {
		const roleId = interaction.data.custom_id;
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
	}

	return respond({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			flags: MessageFlags.Ephemeral,
			content: 'Beep boop, boop beep?'
		}
	});
};