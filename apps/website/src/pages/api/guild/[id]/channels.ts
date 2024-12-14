import type { APIContext, APIRoute } from "astro";
import { getGuildChannels } from "~/lib/guilds";

interface APIParams {
  id: string;
}

export const GET: APIRoute = async ({ params, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response(null, {
      status: 401,
    });
  }

  const channels = await getGuildChannels(params.id!, locals.runtime.env);

  return Response.json(channels);
};
