import { defineMiddleware } from "astro/middleware";
import { checkRateLimit, getClientIp } from "./lib/rate-limit";

const PUBLIC_PATHS = ["/", "/servicios", "/galeria", "/cita", "/cita/confirmacion", "/aboutUs", "/contacto"];

function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some(p => path === p || path.startsWith(p + "/")) ||
    path.startsWith("/api/") ||
    path.startsWith("/_astro/") ||
    path === "/admin/login" ||
    path.startsWith("/api/auth/login");
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;

  if (isPublicPath(url.pathname)) {
    const ip = getClientIp(request);
    const result = checkRateLimit(ip);

    if (!result.ok) {
      return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Intenta de nuevo en 60 segundos." }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      });
    }
  }

  if (url.pathname.startsWith("/admin/") && url.pathname !== "/admin/login") {
    const token = context.cookies.get("sb-session")?.value;
    if (!token) {
      if (request.headers.get("accept")?.includes("text/html")) {
        return context.redirect("/admin/login");
      }
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const response = await next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (!response.headers.has("Content-Security-Policy")) {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co"
    );
  }

  return response;
});
