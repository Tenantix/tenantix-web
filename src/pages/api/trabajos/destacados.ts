export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from("trabajos")
    .select("imagen")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const imagenes = data.map((t: { imagen: string }) => t.imagen);

  return new Response(JSON.stringify(imagenes), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
