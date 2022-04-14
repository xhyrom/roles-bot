/**
 * https://github.com/discordjs/discord.js/blob/3c0bbac82fa9988af4a62ff00c66d149fbe6b921/packages/discord.js/src/util/Util.js#L292-L311
 */

export const resolvePartialEmoji = (emoji: string) => {
	if (!emoji) return null;
	if (typeof emoji === 'string') return /^\d{17,19}$/.test(emoji) ? { id: emoji } : parseEmoji(emoji);
	const { id, name, animated } = emoji;
	if (!id && !name) return null;
	return { id, name, animated: Boolean(animated) };
};

export const parseEmoji = (text: string) => {
	if (text.includes('%')) text = decodeURIComponent(text);
	if (!text.includes(':')) return { animated: false, name: text, id: null };

	const match = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
	return match && { animated: Boolean(match[1]), name: match[2], id: match[3] ?? null };
};