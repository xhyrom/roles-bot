import { getSession } from "auth-astro/server";
import type { User } from "~/env";

export async function getUser(req: Request): Promise<User | null> {
  const session = await getSession(req);
  if (!session || !session.user) return null;

  return session.user as User;
}
