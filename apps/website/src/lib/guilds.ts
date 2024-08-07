import type { Guild, MutualeGuild } from "~/env";
import { isUserEligible } from "./user";

export async function getGuild(
  user,
  guildId: string,
  env
): Promise<Guild | undefined> {
  const guilds = await getUserGuilds(user);
  const guild = guilds.find((g) => g.id === guildId);

  if (!guild || !(await isMutualGuild(guild, env))) return undefined;

  return guild;
}

export async function getUserGuilds(user): Promise<Guild[]> {
  const discordApiGuildsResponse = await fetch(
    "https://discord.com/api/v10/users/@me/guilds",
    {
      headers: {
        Authorization: `Bearer ${user.sensitive.accessToken as string}`,
        "Cache-Control": "max-age=300",
      },
    }
  );

  return (await discordApiGuildsResponse.json()) as Guild[];
}

export async function filterUserGuilds(
  guilds: Guild[],
  env
): Promise<MutualeGuild[]> {
  const filtered = guilds
    .filter(isUserEligible)
    .sort((a, b) => Number(b.owner) - Number(a.owner));

  const result: MutualeGuild[] = [];

  for (const guild of filtered) {
    const mutual = await isMutualGuild(guild, env);

    result.push({ mutual, guild });
  }

  result.sort((a, b) => Number(b.mutual) - Number(a.mutual));

  return result;
}

export async function isMutualGuild(guild: Guild, env): Promise<boolean> {
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${guild.id}/members/${env.DISCORD_CLIENT_ID}`,
    {
      headers: {
        Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
      },
    }
  );

  return res.ok;
}
