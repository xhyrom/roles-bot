import type { Guild } from "~/env";

interface Props {
  guild: Guild;
  mutual: boolean;
}

export default function Guild({ guild, mutual }: Props) {
  return (
    <section
      class={`flex min-h-max w-80 justify-between rounded-md border-[1px] border-neutral-800 bg-dark-100 p-6 md:w-96 ${
        !mutual && "brightness-50"
      }`}
    >
      <div class="flex flex-row items-center">
        <img
          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`}
          class="mr-5 rounded-full"
          alt="icon"
          width="64"
          height="64"
        />

        <h2 class="w-fit break-all text-3xl font-bold">{guild.name}</h2>
      </div>
    </section>
  );
}
