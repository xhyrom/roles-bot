import { generateState } from "arctic";

import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  const state = generateState();
  const url = await context.locals.discord.createAuthorizationURL(state, {
    scopes: ["identify", "guilds"],
  });

  console.log("login");

  context.cookies.set("discord_oauth_state", state, {
    path: "/",
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return context.redirect(url.toString());
}
