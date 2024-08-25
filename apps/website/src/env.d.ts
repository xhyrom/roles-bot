/// <reference types="astro/client" />

type Env = {
  GITHUB_APP_NAME: string;
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  DISCORD_BOT_TOKEN: string;
  DISCORD_REDIRECT_URI: string;
  DB: D1Database;
};

/*export interface Guild {
  id: string;
  name: string;
  icon: string;
  permissions: string;
  owner: boolean;
}

export interface MutualeGuild {
  mutual: boolean;
  guild: Guild;
}*/

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

// https://github.com/withastro/astro/issues/7394#issuecomment-1975657601
declare namespace App {
  interface Locals extends Runtime {
    discord: import("arctic").Discord;
    lucia: import("lucia").Lucia;
    session: import("lucia").Session | null;
    user: import("lucia").User | null;
  }
}
