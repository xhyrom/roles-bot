import { getSession } from "auth-astro/server";
import type { Guild, User } from "~/env";

export async function getUser(req: Request): Promise<User | null> {
  const session = await getSession(req);
  if (!session || !session.user) return null;

  return session.user as User;
}

// Checks if user has AMDINISTRATOR permissions in the guild
export function isUserEligible(guild: Guild): boolean {
  return (BigInt(guild.permissions) & 0x8n) == 0x8n;
}
