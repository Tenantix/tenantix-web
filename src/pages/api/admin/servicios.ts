export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { servicioSchema } from "../../../lib/validation";

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "JSON inválido" }), { status: 400 }); }

  const parsed = servicioSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Datos inválidos", detalles: parsed.error.flatten().fieldErrors }), { status: 400 });
  }

  const { data, error } = await supabase.from("servicios").insert(parsed.data).select("id").single();
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify({ ok: true, id: data.id }), { status: 201 });
};

export const PUT: APIRoute = async ({ request, url }) => {
  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "ID requerido" }), { status: 400 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "JSON inválido" }), { status: 400 }); }

  const parsed = servicioSchema.partial().safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Datos inválidos", detalles: parsed.error.flatten().fieldErrors }), { status: 400 });
  }

  const { error } = await supabase.from("servicios").update(parsed.data).eq("id", id);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "ID requerido" }), { status: 400 });

  const { error } = await supabase.from("servicios").delete().eq("id", id);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
