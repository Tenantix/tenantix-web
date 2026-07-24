import { supabase } from "./supabase";
import type { Servicio, GaleriaItem, FranjaHoraria, CitaPayload } from "./types";

const USE_REAL_API = true;

export async function getHeroSlides(): Promise<string[]> {
    if (USE_REAL_API) {
        const { data, error } = await supabase
            .from("trabajos")
            .select("imagen")
            .order("created_at", { ascending: false })
            .limit(5);
        if (error || !data) return [];
        return data.map((t) => t.imagen);
    }
    return Array.from({ length: 5 }, (_, i) =>
        `https://picsum.photos/seed/atelier-${i}/400/600`
    );
}

export async function getServicios(): Promise<Servicio[]> {
    if (USE_REAL_API) {
        const { data, error } = await supabase
            .from("servicios")
            .select("*")
            .order("orden", { ascending: true });
        if (error || !data) return [];
        return data;
    }
    return [
        {
            id: 1,
            icono: "01",
            titulo: "Confección a Medida",
            subtitulo: "Prendas únicas desde cero",
            resumen: "Diseñamos y confeccionamos prendas a tu medida. Desde vestidos de novia hasta ropa casual, cada pieza es exclusiva.",
            descripcion: "Trabajamos contigo en cada paso del proceso: desde la elección de tejidos hasta el último ajuste. Corte, confección y acabados artesanales para que la prenda se adapte perfectamente a tu cuerpo y a tu estilo. Vestidos de novia, trajes de ceremonia, ropa casual y cualquier prenda que imagines.",
            imagen: "https://picsum.photos/seed/confeccion/600/800",
            href: "/servicios#confeccion",
            orden: 1,
        },
        {
            id: 2,
            icono: "02",
            titulo: "Arreglos y Reformas",
            subtitulo: "Dale nueva vida a tus prendas",
            resumen: "Ajustes de largos, entallados, cambios de cremallera y cualquier reforma que necesites en tus prendas favoritas.",
            descripcion: "¿Tienes una prenda que ya no te queda bien o necesita una reparación? Realizamos todo tipo de arreglos: bajos de pantalón, entallados de vestido, cambio de cremalleras, forros y mucho más. Dejamos tus prendas como nuevas para que puedas seguir disfrutándolas.",
            imagen: "https://picsum.photos/seed/arreglos/600/800",
            href: "/servicios#arreglos",
            orden: 2,
        },
        {
            id: 3,
            icono: "03",
            titulo: "Asesoría de Imagen",
            subtitulo: "Tu estilo, nuestra experiencia",
            resumen: "Te ayudamos a descubrir tu estilo personal y a elegir las prendas que mejor te sientan para cada ocasión.",
            descripcion: "Analizamos tu morfología, gustos y necesidades para crear un armario que funcione para ti. Te acompañamos en la elección de prendas para ocasiones especiales, te asesoramos sobre combinaciones y te ayudamos a potenciar tu imagen personal con confianza y autenticidad.",
            imagen: "https://picsum.photos/seed/asesoria/600/800",
            href: "/servicios#asesoria",
            orden: 3,
        },
        {
            id: 4,
            icono: "04",
            titulo: "Alquiler de Vestidos",
            subtitulo: "Para ocasiones especiales",
            resumen: "Alquila vestidos de ceremonia, fiesta y ocasiones especiales. Prendas cuidadas con el mejor asesoramiento.",
            descripcion: "Disponemos de una colección seleccionada de vestidos para eventos: bodas, bautizos, comuniones y galas. Te asesoramos en la elección y realizamos los ajustes necesarios para que el vestido te quede perfecto el día de tu evento.",
            imagen: "https://picsum.photos/seed/alquiler/600/800",
            href: "/servicios#alquiler",
            orden: 4,
        },
    ];
}

export async function getGaleria(): Promise<GaleriaItem[]> {
    if (USE_REAL_API) {
        const { data, error } = await supabase
            .from("trabajos")
            .select("*, imagenes_trabajo(url, orden)")
            .order("created_at", { ascending: false });
        if (error || !data) return [];
        return data.map((t) => ({
            ...t,
            imagenes: (t.imagenes_trabajo as { url: string }[])?.map((i) => i.url) || [],
        }));
    }
    const categorias = ["confección", "arreglos", "asesoría", "alquiler"];
    return Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        titulo: `Trabajo ${i + 1}`,
        categoria: categorias[i % categorias.length],
        imagen: `https://picsum.photos/seed/trabajo-${i}/400/600`,
        imagenes: [
            `https://picsum.photos/seed/trabajo-${i}/400/600`,
            `https://picsum.photos/seed/trabajo-${i}b/400/600`,
            `https://picsum.photos/seed/trabajo-${i}c/400/600`,
        ],
    }));
}

const FRANJAS = [
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00",
];

export async function getDisponibilidad(fecha: string): Promise<FranjaHoraria[]> {
    if (USE_REAL_API) {
        const { data: citas, error } = await supabase
            .from("citas")
            .select("hora")
            .eq("fecha", fecha);
        if (error) return [];
        const horasOcupadas = new Set(citas.map((c) => c.hora));
        return FRANJAS.map((hora) => ({
            hora,
            disponible: !horasOcupadas.has(hora),
        }));
    }
    return FRANJAS.map((hora, i) => ({
        hora,
        disponible: i % 3 !== 1,
    }));
}

export async function crearCita(payload: CitaPayload): Promise<{ ok: boolean; id?: number }> {
    if (USE_REAL_API) {
        const { data, error } = await supabase
            .from("citas")
            .insert(payload)
            .select("id")
            .single();
        if (error || !data) return { ok: false };
        return { ok: true, id: data.id };
    }
    return { ok: true, id: Math.floor(Math.random() * 1000) };
}
