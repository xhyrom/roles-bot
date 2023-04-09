// https://github.com/discordjs/discord.js/blob/6412da4921a5fd9ed0987205508bacd2b4868fd6/packages/discord.js/src/util/Util.js#L90-L109

export function parseEmoji(text: string) {
	if (text.includes("%")) text = decodeURIComponent(text);
	if (!text.includes(":"))
		return { animated: false, name: text, id: undefined };
	const match = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
	return match && { animated: Boolean(match[1]), name: match[2], id: match[3] };
}

export function resolvePartialEmoji(emoji: string) {
	if (!emoji) return null;
	if (typeof emoji === "string")
		return /^\d{17,19}$/.test(emoji) ? { id: emoji } : parseEmoji(emoji);
	const { id, name, animated } = emoji;
	if (!id && !name) return null;
	return { id, name, animated: Boolean(animated) };
}
