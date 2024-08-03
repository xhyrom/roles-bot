import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import type { User } from "~/env";

export const GET: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  if (!session || !session.user) {
    return new Response(null, {
      status: 401,
    });
  }

  const user = session.user as User;

  return Response.json(
    user.guilds.map((g) => ({
      id: g.id,
      name: g.name,
      owner: g.owner,
      permissions: g.permissions,
    }))
  );
};
