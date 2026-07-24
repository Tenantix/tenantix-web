export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { trabajoSchema } from "../../../lib/validation";

export const POST: APIRoute = async ({ request }) => {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  let body: unknown;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "JSON inválido" }), { status: 400 }); }

  const parsed = trabajoSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Datos inválidos", detalles: parsed.error.flatten().fieldErrors }), { status: 400 });
  }

  const { imagenes, ...trabajo } = parsed.data;

  const { data, error } = await supabase.from("trabajos").insert(trabajo).select("id").single();
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  if (imagenes && imagenes.length > 0) {
    const { error: imgError } = await supabase.from("imagenes_trabajo").insert(
      imagenes.map((url, i) => ({ trabajo_id: data.id, url, orden: i }))
    );
    if (imgError) console.error("Error insertando imágenes:", imgError);
  }

  return new Response(JSON.stringify({ ok: true, id: data.id }), { status: 201 });
};

export const PUT: APIRoute = async ({ request, url }) => {
  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "ID requerido" }), { status: 400 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "JSON inválido" }), { status: 400 }); }

  const parsed = trabajoSchema.partial().safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Datos inválidos", detalles: parsed.error.flatten().fieldErrors }), { status: 400 });
  }

  const { imagenes, ...trabajo } = parsed.data;

  const { error } = await supabase.from("trabajos").update(trabajo).eq("id", id);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  if (imagenes) {
    await supabase.from("imagenes_trabajo").delete().eq("trabajo_id", id);
    if (imagenes.length > 0) {
      await supabase.from("imagenes_trabajo").insert(
        imagenes.map((url, i) => ({ trabajo_id: Number(id), url, orden: i }))
      );
    }
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "ID requerido" }), { status: 400 });

  const { error } = await supabase.from("trabajos").delete().eq("id", id);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
