import type { Guild } from "~/env";

// Checks if user has AMDINISTRATOR permissions in the guild
export async function filterUserGuilds(guilds: Guild[]): Promise<
  {
    mutual: boolean;
    guild: Guild;
  }[]
> {
  const filtered = guilds
    .filter((g) => (BigInt(g.permissions) & 0x8n) == 0x8n)
    .sort((a, b) => Number(b.owner) - Number(a.owner));

  const result: {
    mutual: boolean;
    guild: Guild;
  }[] = [];

  for (const guild of filtered) {
    const mutual = await isMutualGuild(guild);

    result.push({ mutual, guild });
  }

  result.sort((a, b) => Number(b.mutual) - Number(a.mutual));

  return result;
}

export async function isMutualGuild(guild: Guild): Promise<boolean> {
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${guild.id}/members/${
      import.meta.env.DISCORD_CLIENT_ID
    }`,
    {
      headers: {
        Authorization: `Bot ${import.meta.env.DISCORD_BOT_TOKEN}`,
      },
    }
  );

  return res.ok;
}
