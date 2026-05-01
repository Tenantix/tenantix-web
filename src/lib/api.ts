// Cuando tu API esté lista, cambia USE_REAL_API a true
// y rellena API_BASE_URL con tu endpoint
const USE_REAL_API = false;
const API_BASE_URL = "https://tu-api.com"; // <-- tu futura URL

export interface Vestido {
    id: number;
    titulo: string;
    categoria: "novia" | "madrina" | "fiesta" | "otro";
    imagen: string;
    imagenes?: string[];
    descripcion?: string;
    nuevo?: boolean;
    disponible?: boolean;
}

// Placeholder: usa picsum.photos con seed fijo para que no cambien al recargar
function placeholderVestidos(cantidad: number, seed = 0): Vestido[] {
    const categorias: Vestido["categoria"][] = ["novia", "madrina", "fiesta", "otro"];
    return Array.from({ length: cantidad }, (_, i) => ({
        id: i + 1,
        titulo: `Vestido ${i + 1}`,
        categoria: categorias[i % categorias.length],
        imagen: `https://picsum.photos/seed/vestido-${seed + i}/400/600`,
        nuevo: i < 3,
    }));
}

export async function getHeroSlides(): Promise<string[]> {
    if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/vestidos/destacados`);
        const data = await res.json();
        return data.map((v: Vestido) => v.imagen);
    }
    return Array.from({ length: 5 }, (_, i) =>
        `https://picsum.photos/seed/hero-${i}/400/600`
    );
}

export async function getCategorias() {
    if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/categorias`);
        return res.json();
    }
    return [
        { slug: "novia", label: "Novia", imagen: "https://picsum.photos/seed/novia/300/450" },
        { slug: "madrina", label: "Madrina", imagen: "https://picsum.photos/seed/madrina/300/450" },
        { slug: "fiesta", label: "Fiesta", imagen: "https://picsum.photos/seed/fiesta/300/450" },
    ];
}

export async function getNovedades(): Promise<Vestido[]> {
    if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/vestidos?nuevo=true`);
        return res.json();
    }
    return placeholderVestidos(5, 20);
}

export async function getCatalogo(): Promise<Vestido[]> {
    if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/vestidos`);
        return res.json();
    }
    const categorias: Vestido["categoria"][] = ["novia", "madrina", "fiesta", "otro"];
    return Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        titulo: `Vestido ${i + 1}`,
        categoria: categorias[i % categorias.length],
        imagen: `https://picsum.photos/seed/cat-${i}/400/600`,
        nuevo: i < 4,
    }));
}

export async function getVestidoById(id: number): Promise<Vestido | null> {
    if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/vestidos/${id}`);
        if (!res.ok) return null;
        return res.json();
    }
    const categorias: Vestido["categoria"][] = ["novia", "madrina", "fiesta", "otro"];
    return {
        id,
        titulo: `Vestido ${id}`,
        categoria: categorias[id % categorias.length],
        imagen: `https://picsum.photos/seed/cat-${id}/400/600`,
        imagenes: [
            `https://picsum.photos/seed/cat-${id}/400/600`,
            `https://picsum.photos/seed/cat-${id}b/400/600`,
            `https://picsum.photos/seed/cat-${id}c/400/600`,
        ],
        descripcion: "Elegante vestido de corte sirena con escote recto y tirantes finos. Confeccionado en tejido de alta calidad con caída impecable. Disponible para prueba en tienda previa cita.",
        nuevo: id <= 4,
        disponible: true,
    };
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

export async function getDisponibilidad(fecha: string): Promise<FranjaHoraria[]> {
    if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/citas/disponibilidad?fecha=${fecha}`);
        return res.json();
    }
    // Placeholder: franjas fijas con algunas ocupadas
    const franjas = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];
    return franjas.map((hora, i) => ({
        hora,
        disponible: i % 3 !== 1, // simula algunas ocupadas
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
    // Placeholder: simula éxito
    return { ok: true, id: Math.floor(Math.random() * 1000) };
}