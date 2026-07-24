export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

const FRANJAS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00",
];

export const GET: APIRoute = async ({ url }) => {
  const fecha = url.searchParams.get("fecha");

  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return new Response(JSON.stringify({ error: "Fecha inválida. Formato: YYYY-MM-DD" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const hoy = new Date();
  const fechaSel = new Date(fecha + "T00:00:00");
  if (fechaSel <= hoy) {
    return new Response(JSON.stringify({ error: "La fecha debe ser posterior a hoy" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: citas, error } = await supabase
    .from("citas")
    .select("hora")
    .eq("fecha", fecha);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const horasOcupadas = new Set(citas.map((c: { hora: string }) => c.hora));

  const disponibilidad = FRANJAS.map((hora) => ({
    hora,
    disponible: !horasOcupadas.has(hora),
  }));

  return new Response(JSON.stringify(disponibilidad), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
