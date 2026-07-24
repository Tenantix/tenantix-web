import { z } from "zod";

export const citaSchema = z.object({
  nombre: z.string().min(2, "Nombre debe tener al menos 2 caracteres").max(100),
  telefono: z.string().regex(/^[\d\s\+\-()]{7,20}$/, "Teléfono inválido"),
  email: z.string().email("Email inválido"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  hora: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida (HH:mm)"),
  mensaje: z.string().max(500).optional(),
});

export const servicioSchema = z.object({
  icono: z.string().max(10).default(""),
  titulo: z.string().min(2, "Título obligatorio").max(100),
  subtitulo: z.string().max(200).default(""),
  resumen: z.string().max(300).default(""),
  descripcion: z.string().max(2000).default(""),
  imagen: z.string().url("URL de imagen inválida").default(""),
  href: z.string().max(100).default(""),
  orden: z.number().int().min(0).default(0),
});

export const trabajoSchema = z.object({
  titulo: z.string().min(2, "Título obligatorio").max(100),
  categoria: z.string().max(50).default(""),
  imagen: z.string().url("URL de imagen inválida").default(""),
  imagenes: z.array(z.string().url()).default([]),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
});
