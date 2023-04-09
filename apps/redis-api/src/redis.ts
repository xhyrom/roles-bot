import Redis from "ioredis";
const redis = new Redis(
	// rome-ignore lint/style/noNonNullAssertion: env vars are always defined
	parseInt(process.env.REDIS_PORT!),
	process.env.REDIS_HOST as string,
	{
		password: process.env.REDIS_PASSWORD,
	},
);

export default redis;
