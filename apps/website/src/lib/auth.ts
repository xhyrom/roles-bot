import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { Discord } from "arctic";

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: "user",
    session: "session",
  });
  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        // set to `true` when using HTTPS
        secure: import.meta.env.PROD,
      },
    },
    getUserAttributes: (attributes) => {
      return {
        discordId: attributes.discord_id,
        username: attributes.username,
        avatar: attributes.avatar,
        sensitive: {
          accessToken: attributes.access_token,
          refreshToken: attributes.refresh_token,
          accessTokenExpiresAt: attributes.access_token_expiration,
        },
      };
    },
  });
}

export function initializeDiscord(
  discordClientId: string,
  discordClientSecret: string,
  redirectUri: string
) {
  return new Discord(discordClientId, discordClientSecret, redirectUri);
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  discord_id: number;
  username: string;
  avatar: string;
  access_token: string;
  refresh_token: string;
  access_token_expiration: number;
}
