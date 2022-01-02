export const toSnowflake = (snowflake: number, epoch = DISCORD_EPOCH) => {
	return new Date(snowflake / 4194304 + epoch);
};

export const DISCORD_EPOCH = 1420070400000;

export const isSnowflake = (snowflake: number, epoch?: number) => {
	if (!Number.isInteger(+snowflake)) return false;
	if (snowflake < 4194304) return false;

	const timestamp = toSnowflake(snowflake, epoch);
	if (isNaN(timestamp.getTime())) return false;

	return true;
};