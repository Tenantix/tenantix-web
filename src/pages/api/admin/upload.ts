export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "general";

  if (!file) {
    return new Response(JSON.stringify({ error: "No se envió ningún archivo" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!file.type.startsWith("image/")) {
    return new Response(JSON.stringify({ error: "Solo se permiten imágenes" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (file.size > 5 * 1024 * 1024) {
    return new Response(JSON.stringify({ error: "La imagen no puede superar 5MB" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from("imagenes")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: urlData } = supabase.storage
    .from("imagenes")
    .getPublicUrl(data.path);

  return new Response(JSON.stringify({ url: urlData.publicUrl, path: data.path }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
