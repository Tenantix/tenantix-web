const USE_REAL_API = false;
const API_BASE_URL = "https://tu-api.com";

export interface Servicio {
    id: number;
    icono: string;
    titulo: string;
    subtitulo: string;
    resumen: string;
    descripcion: string;
    imagen: string;
    href: string;
}

export interface GaleriaItem {
    id: number;
    titulo: string;
    categoria: string;
    imagen: string;
    imagenes?: string[];
}

export interface FranjaHoraria {
    hora: string;
    disponible: boolean;
}

export interface CitaPayload {
    nombre: string;
    telefono: string;
    email: string;
    fecha: string;
    hora: string;
    mensaje?: string;
}

export async function getHeroSlides(): Promise<string[]> {
    if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/trabajos/destacados`);
        const data = await res.json();
        return data.map((t: GaleriaItem) => t.imagen);
    }
    return Array.from({ length: 5 }, (_, i) =>
        `https://picsum.photos/seed/atelier-${i}/400/600`
    );
}

export async function getServicios(): Promise<Servicio[]> {
    if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/servicios`);
        return res.json();
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
        },
    ];
}

export async function getGaleria(): Promise<GaleriaItem[]> {
    if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/trabajos`);
        return res.json();
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

export async function getDisponibilidad(fecha: string): Promise<FranjaHoraria[]> {
    if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/citas/disponibilidad?fecha=${fecha}`);
        return res.json();
    }
    const franjas = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];
    return franjas.map((hora, i) => ({
        hora,
        disponible: i % 3 !== 1,
    }));
}

export async function crearCita(payload: CitaPayload): Promise<{ ok: boolean; id?: number }> {
    if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/citas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) return { ok: false };
        const data = await res.json();
        return { ok: true, id: data.id };
    }
    return { ok: true, id: Math.floor(Math.random() * 1000) };
}
