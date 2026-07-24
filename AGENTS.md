# Atelier Carmen — tenantix-web

Web pública — Astro 6 + Tailwind CSS v4 + Supabase.

## Stack

- **Astro 6** con `@astrojs/node` (SSR standalone) y `@astrojs/react`
- **Tailwind v4** — sintaxis `@import "tailwindcss"` en CSS
- **Supabase** — base de datos, auth y API
- **zod** — validación de datos en API routes
- Tema custom en `src/styles/global.css`: `font-display` (Cormorant Garamond), `font-body` (Jost), `color-cream`, `color-dark`, `color-muted`
- TypeScript strict vía `astro/tsconfigs/strict`

## Comandos

```
npm run dev       # astro dev
npm run build     # astro build (output: dist/)
npm run preview   # astro preview
```

Node >=22.12.0 requerido. No hay test, linter ni formateador configurados.

## API (src/lib/api.ts)

Usa flag `USE_REAL_API = false`. Mientras esté en `false`:
- Datos mock con imágenes de `picsum.photos` (seed fijo)
- Cuando se cambie a `true`: cada función (`getServicios()`, `getGaleria()`, `getDisponibilidad()`, `crearCita()`) consulta Supabase directamente

## API Routes (Astro)

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/servicios` | GET | Lista servicios |
| `/api/trabajos` | GET | Lista trabajos (galería) con imágenes |
| `/api/trabajos/destacados` | GET | Últimas 5 imágenes para hero |
| `/api/citas` | POST | Crear cita (validado con zod) |
| `/api/citas/disponibilidad?fecha=` | GET | Horarios disponibles para una fecha |
| `/api/auth/login` | POST | Iniciar sesión admin (Supabase Auth) |
| `/api/auth/logout` | POST | Cerrar sesión |
| `/api/auth/session` | GET | Verificar sesión activa |
| `/api/admin/trabajos` | POST/PUT/DELETE | CRUD trabajos |
| `/api/admin/servicios` | POST/PUT/DELETE | CRUD servicios |

## Admin panel

| Ruta | Descripción |
|------|-------------|
| `/admin/login` | Inicio de sesión |
| `/admin` | Dashboard con contadores |
| `/admin/galeria` | CRUD galería (modal inline) |
| `/admin/servicios` | CRUD servicios (modal inline) |
| `/admin/citas` | Lista de citas recibidas |

Todas las rutas admin requieren autenticación (Supabase Auth + cookie `sb-session`). Layout: `AdminLayout.astro` con sidebar.

## Seguridad

- **Rate limiting** en middleware (30 req/min por IP, excede → 429)
- **Validación con zod** en todas las API routes de escritura
- **CSP headers** via middleware (`default-src 'self'`, fonts Google, imágenes externas)
- **Supabase** usa queries parametrizadas (protección contra inyección SQL)
- **Cookies** httpOnly + secure + sameSite en sesión admin
- Headers de seguridad: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`

## Variables de entorno

```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Copiar `.env.example` a `.env` y rellenar con valores reales de Supabase.

## Esquema de base de datos (Supabase)

- `servicios` (id, icono, titulo, subtitulo, resumen, descripcion, imagen, href, orden)
- `trabajos` (id, titulo, categoria, imagen, created_at)
- `imagenes_trabajo` (id, trabajo_id FK, url, orden)
- `citas` (id, nombre, telefono, email, fecha, hora, mensaje, created_at)
- Admin users manejados via Supabase Auth (tabla `auth.users`)

## Rutas públicas

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio: Hero, servicios destacados, galería breve, CTA cita |
| `/servicios` | Servicios de atelier |
| `/galeria` | Galería con lightbox inline |
| `/cita` | Formulario de reserva |
| `/cita/confirmacion` | Confirmación (query params) |
| `/aboutUs` | Nosotras |
| `/contacto` | Contacto |
| `/404`, `/505` | Páginas de error |
| `/catalogo` | Redirige 301 a `/galeria` |

## Convenciones

- Todo el contenido en español (es)
- Componentes en `.astro`, sin JSX/TSX (React disponible pero no usado)
- `@tailwindcss/vite` plugin — NO usar `tailwind.config.js`
- Google Fonts (Cormorant Garamond + Jost) cargadas en `Layout.astro`
- AdminLayout con sidebar oscura, content area flexible
- Footer hardcodeado en `Layout.astro`
- `.astro/types.d.ts` auto-generado — no editar
- Middleware en `src/middleware.ts` (rate limit + seguridad + auth check)
