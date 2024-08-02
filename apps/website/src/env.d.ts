/// <reference types="astro/client" />

import type { User as AuthCoreUser } from "@auth/core/types";

export type User = AuthCoreUser & {
  guilds: {
    name: string;
  }[];
};
