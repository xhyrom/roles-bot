import Discord from "@auth/core/providers/discord";
import { defineConfig } from "auth-astro";
import type { User } from "~/env";

export default defineConfig({
  providers: [
    Discord({
      clientId: import.meta.env.DISCORD_CLIENT_ID,
      clientSecret: import.meta.env.DISCORD_CLIENT_SECRET,
      authorization:
        "https://discord.com/api/oauth2/authorize?scope=guilds+identify+email",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.id = profile.id;

        token.name = profile.username as string;
        token.global_name = profile.global_name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as User).global_name =
          token.global_name as string;

        const guilds = await fetch(
          "https://discord.com/api/v10/users/@me/guilds",
          {
            headers: {
              Authorization: `Bearer ${token.accessToken as string}`,
              "Cache-Control": "max-age=300",
            },
          }
        );

        (session.user as unknown as User).guilds = await guilds.json();
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
});
