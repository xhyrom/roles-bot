import type { Guild, MutualeGuild, User } from "~/env";
import { isUserEligible } from "./user";

export async function getGuild(
  user: User,
  guildId: string
): Promise<Guild | undefined> {
  const guilds = await getUserGuilds(user);
  const guild = guilds.find((g) => g.id === guildId);

  if (!guild || !(await isMutualGuild(guild))) return undefined;

  return guild;
}

export async function getUserGuilds(user: User): Promise<Guild[]> {
  const discordApiGuildsResponse = await fetch(
    "https://discord.com/api/v10/users/@me/guilds",
    {
      headers: {
        Authorization: `Bearer ${user.discordAccessToken as string}`,
        "Cache-Control": "max-age=300",
      },
    }
  );

  return (await discordApiGuildsResponse.json()) as Guild[];
}

export async function filterUserGuilds(
  guilds: Guild[]
): Promise<MutualeGuild[]> {
  const filtered = guilds
    .filter(isUserEligible)
    .sort((a, b) => Number(b.owner) - Number(a.owner));

  const result: MutualeGuild[] = [];

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
