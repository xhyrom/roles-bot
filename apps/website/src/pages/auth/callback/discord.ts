import { OAuth2RequestError } from "arctic";
import type { APIContext } from "astro";
import { generateIdFromEntropySize } from "lucia";

type UserRow = {
  id: string;
};

export async function GET(context: APIContext): Promise<Response> {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("discord_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await context.locals.discord.validateAuthorizationCode(code);
    const disocrdUserResponse = await fetch(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    const discordUser: DiscordUser = await disocrdUserResponse.json();

    const existingUser = await context.locals.runtime.env.DB.prepare(
      "SELECT * FROM user WHERE discord_id = ?1"
    )
      .bind(discordUser.id)
      .first<UserRow>();

    if (existingUser) {
      const session = await context.locals.lucia.createSession(
        existingUser.id,
        {}
      );

      const sessionCookie = context.locals.lucia.createSessionCookie(
        session.id
      );

      context.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return context.redirect("/dashboard");
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long

    await context.locals.runtime.env.DB.prepare(
      "INSERT INTO user (id, discord_id, username, avatar, access_token, access_token_expiration, refresh_token) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)"
    )
      .bind(
        userId,
        discordUser.id,
        discordUser.username,
        discordUser.avatar,
        tokens.accessToken,
        tokens.accessTokenExpiresAt.getTime(),
        tokens.refreshToken
      )
      .run();

    const session = await context.locals.lucia.createSession(userId, {});
    const sessionCookie = context.locals.lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return context.redirect("/dashboard");
  } catch (e) {
    console.error(e.message);

    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
}
