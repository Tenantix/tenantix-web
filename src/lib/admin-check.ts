import { supabase } from "./supabase";
import type { AstroCookies } from "astro";

export async function checkAdminSession(cookies: AstroCookies): Promise<{ autenticado: boolean; email?: string }> {
  const token = cookies.get("sb-session")?.value;
  if (!token) return { autenticado: false };

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return { autenticado: false };

  return { autenticado: true, email: user.email ?? undefined };
}
