require('dotenv').config();
import express from 'express';
import hyttpo, { PayloadMethod } from 'hyttpo';
import Utils from 'hyttpo/dist/js/util/utils';
import { RoleObject } from './constants';
import { verifyKeyMiddleware, InteractionType, InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';
const app = express();
const baseUrl = 'https://discord.com/api/v9';

app.get('/', (req, res) => res.send('lol'))

const badFormatting = (res, rolesMax?: boolean) => {
    res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            flags: InteractionResponseFlags.EPHEMERAL,
            content: `${rolesMax ? 'You can have maximum 25 buttons. (5x5)' : 'Bad formatting, generate [here](https://xhyrom.github.io/roles-bot)'}`
        }
    })
}

app.post('/interactions', verifyKeyMiddleware(process.env.CLIENT_PUBLIC_KEY), async(req, res) => {
    const interaction = req.body;
    if (interaction.type === InteractionType.APPLICATION_COMMAND && interaction.data.name === 'setup') {
        const json = Utils.isJSON(interaction.data.options[0].value) ? JSON.parse(interaction.data.options[0].value) : null;

        if (!json) return badFormatting(res);

        const channelId = json.channel;
        const message = json.message?.toString();
        let roles = json.roles;

        if (!channelId) return badFormatting(res);
        if (!message) return badFormatting(res);
        if (!roles || Object.values(json.roles).filter((role: RoleObject) => role.id && role.label).length === 0 || roles.length === 0 || roles.length > 25) return badFormatting(res, roles.length > 25);

        roles = roles.map(r => {
            return {
                type: 2,
                style: r.style || 2,
                label: r.label,
                emoji: {
                    id: null,
                    name: r.emoji
                },
                custom_id: r.id
            }
        })

        const finalComponents = [];
        for (let i = 0; i <= roles.length; i += 5) {
            const row = {
                type: 1,
                components: []
            }

            const btnslice = roles.slice(i, i + 5);
            for (let y = 0; y < btnslice.length; y++) row.components.push(btnslice[y]);
            
            finalComponents.push(row);
        }

        await hyttpo.request({
            method: 'POST',
            url: `${baseUrl}/channels/${channelId}/messages`,
            headers: {
                'Authorization': `Bot ${process.env.CLIENT_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: message,
                components: finalComponents
            })
        }).catch(e => e)

        res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                flags: InteractionResponseFlags.EPHEMERAL,
                content: 'Done!'
            }
        })
    } else if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
        const roleId = interaction.data.custom_id;
        const url = `${baseUrl}/guilds/${interaction.guild_id}/members/${interaction.member.user.id}/roles/${roleId}`;
        let method = "";
        let content = "";

        if (!interaction.member.roles.includes(roleId)) {
            content = `Gave the <@&${roleId}> role!`;
            method = 'PUT';
        } else {
            content = `Removed the <@&${roleId}> role!`;
            method = 'DELETE';
        }

        await hyttpo.request({
            method: method as PayloadMethod,
            url,
            headers: {
                'Authorization': `Bot ${process.env.CLIENT_TOKEN}`
            },
            body: JSON.stringify({})
        }).catch(e => e);
        
        res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                flags: InteractionResponseFlags.EPHEMERAL,
                content: content,
                allowed_mentions: { parse: [] }
            }
        })
    }
});

app.listen(80)