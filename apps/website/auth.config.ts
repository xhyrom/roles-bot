import Discord from "@auth/core/providers/discord";
import { defineConfig } from "auth-astro";
import type { User } from "~/env";

import dotenv from "dotenv";

dotenv.config();

const { env } = process;

export default defineConfig({
  secret: env.AUTH_SECRET,
  providers: [
    Discord({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
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

        (session.user as unknown as User).discordAccessToken =
          token.accessToken as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
});
