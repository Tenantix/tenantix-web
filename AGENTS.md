# Atelier Carmen — tenantix-web

Web pública — Astro 6 + Tailwind CSS v4.

## Stack

- **Astro 6** con `@astrojs/react` (React disponible pero no usado aún)
- **Tailwind v4** — sintaxis `@import "tailwindcss"` en CSS (NO PostCSS `@tailwind`)
- Tema custom en `src/styles/global.css`: `font-display` (Cormorant Garamond), `font-body` (Jost), `color-cream`, `color-dark`, `color-muted`
- TypeScript strict vía `astro/tsconfigs/strict`

## Comandos

```
npm run dev       # astro dev
npm run build     # astro build (output: dist/)
npm run preview   # astro preview
```

Node >=22.12.0 requerido. No hay test, linter ni formateador configurados.

## API

`src/lib/api.ts` usa flag `USE_REAL_API = false`. Mientras esté en `false`:
- Datos mock con imágenes de `picsum.photos` (seed fijo)
- El formulario de citas (`/cita`) hace fetch a `/api/disponibilidad` y `/api/citas` que **no existen** — cae a placeholder client-side
- Para conectar API real: cambiar `USE_REAL_API = true` y configurar `API_BASE_URL`

No hay API routes de Astro (`pages/api/` no existe). Las funciones principales son `getServicios()`, `getGaleria()`, `getDisponibilidad()` y `crearCita()`.

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio: Hero atelier, servicios destacados, galería breve, CTA cita |
| `/servicios` | Servicios de atelier (confección, arreglos, asesoría, alquiler) |
| `/galeria` | Galería con lightbox (herencia del catálogo, simplificada) |
| `/cita` | Formulario de reserva |
| `/cita/confirmacion` | Confirmación (lee query params) |
| `/aboutUs` | Nosotras |
| `/contacto` | Contacto |
| `/404`, `/505` | Páginas de error |
| `/catalogo` | Redirige 301 a `/galeria` |

## Convenciones

- Todo el contenido en español (es)
- Componentes en `.astro`, sin JSX/TSX por ahora
- `@tailwindcss/vite` plugin en astro.config — NO usar `tailwind.config.js`
- Google Fonts (Cormorant Garamond + Jost) cargadas en `Layout.astro`
- Footer hardcodeado en `Layout.astro` (no componente separado)
- `.astro/types.d.ts` es auto-generado — no editar manualmente
- La galería usa lightbox inline con JS client-side (no librería externa)
- `/catalogo/[id]` eliminado — ya no hay páginas de detalle individual
