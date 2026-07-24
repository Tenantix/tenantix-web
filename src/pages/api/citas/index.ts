export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { citaSchema } from "../../../lib/validation";

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "JSON inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = citaSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({
      error: "Datos inválidos",
      detalles: parsed.error.flatten().fieldErrors,
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data, error } = await supabase
    .from("citas")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, id: data.id }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
