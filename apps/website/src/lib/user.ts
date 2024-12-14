import type { Guild } from "~/env";

// Checks if user has AMDINISTRATOR permissions in the guild
export function isUserEligible(guild: Guild): boolean {
  return (BigInt(guild.permissions) & 0x8n) == 0x8n;
}
