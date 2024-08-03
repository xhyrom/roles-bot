/// <reference types="astro/client" />

import type { User as AuthCoreUser } from "@auth/core/types";

export type User = AuthCoreUser & {
  global_name: string;
  guilds: Guild[];
};

export interface Guild {
  id: string;
  name: string;
  icon: string;
  permissions: string;
  owner: boolean;
}
