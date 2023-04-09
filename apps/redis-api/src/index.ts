import "dotenv/config";
import redis from "./redis";

import Fastify from "fastify";
const fastify = Fastify();

fastify.addHook("preHandler", async (request, reply) => {
	const Authorization = request.headers.authorization?.replace("Bearer ", "");
	if (Authorization !== process.env.API_KEY)
		reply.status(401).send("Unauthorized");
});

fastify.post("/set", async (request, reply) => {
	const { key, value } = request.body as { key: string; value: string };

	reply.send(await redis.set(key, value));
});

fastify.post("/setex", async (request, reply) => {
	const { key, value, seconds } = request.body as {
		key: string;
		value: string;
		seconds: number;
	};

	reply.send(await redis.setex(key, seconds, value));
});

fastify.get("/get", async (request, reply) => {
	const { key } = request.query as { key: string };

	reply.send(await redis.get(key));
});

fastify.delete("/del", async (request, reply) => {
	const { key } = (request.body || request.query) as { key: string };

	reply.send(await redis.del(key));
});

fastify.post("/flush", async (request, reply) => {
	reply.send(await redis.flushdb());
});

fastify.listen({ port: 51253 }, console.log);
