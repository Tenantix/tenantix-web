export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get("sb-session")?.value;
  if (!token) {
    return new Response(JSON.stringify({ autenticado: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return new Response(JSON.stringify({ autenticado: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ autenticado: true, email: user.email }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
