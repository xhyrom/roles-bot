import { InteractionResponseType } from 'discord-api-types/v9';
import { respond } from './respond';

export const badFormatting = (rolesMax?: boolean) => {
	return respond({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			flags: 64,
			content: `${rolesMax ? 'You can have maximum 25 buttons. (5x5)' : 'Bad formatting, generate [here](https://xhyrom.github.io/roles-bot)'}`
		}
	});
};