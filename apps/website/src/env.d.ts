/// <reference types="astro/client" />

import type { User as AuthCoreUser } from "@auth/core/types";

export type User = AuthCoreUser & {
  global_name: string;
  discordAccessToken: string;
};

export interface Guild {
  id: string;
  name: string;
  icon: string;
  permissions: string;
  owner: boolean;
}

export interface MutualeGuild {
  mutual: boolean;
  guild: Guild;
}
