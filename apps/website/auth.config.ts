import Discord from "@auth/core/providers/discord";
import { defineConfig } from "auth-astro";

export default defineConfig({
	providers: [
		Discord({
			clientId: import.meta.env.DISCORD_CLIENT_ID,
			clientSecret: import.meta.env.DISCORD_CLIENT_SECRET,
		}),
	],
	callbacks: {
		session({ session, token }) {
			if (session.user && token?.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
	pages: {
		signIn: "/auth/login",
		signOut: "/auth/logout",
	},
});
