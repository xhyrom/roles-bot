import type { APIRoute } from "astro";
import { filterUserGuilds, getUserGuilds } from "~/lib/guilds";

export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response(null, {
      status: 401,
    });
  }

  console.log(user);
  return Response.json([]);
};
