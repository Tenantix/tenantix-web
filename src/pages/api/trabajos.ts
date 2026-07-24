export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from("trabajos")
    .select("*, imagenes_trabajo(url, orden)")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = data.map((t: Record<string, unknown>) => ({
    ...t,
    imagenes: (t.imagenes_trabajo as { url: string }[])?.map((i) => i.url) || [],
  }));

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
