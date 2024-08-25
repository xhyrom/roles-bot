import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  await context.locals.lucia.invalidateSession(context.locals.session.id);

  const sessionCookie = context.locals.lucia.createBlankSessionCookie();
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return context.redirect("/");
}
