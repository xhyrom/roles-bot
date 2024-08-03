import type { APIRoute } from "astro";
import { filterUserGuilds, getUserGuilds } from "~/lib/guilds";
import { getUser } from "~/lib/user";

export const GET: APIRoute = async ({ request }) => {
  const user = await getUser(request);
  if (!user) {
    return new Response(null, {
      status: 401,
    });
  }

  const guilds = await getUserGuilds(user);
  const res = await filterUserGuilds(guilds);

  return Response.json(res);
};
