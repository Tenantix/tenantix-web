// Cuando tu API esté lista, cambia USE_REAL_API a true
// y rellena API_BASE_URL con tu endpoint
const USE_REAL_API = false;
const API_BASE_URL = "https://tu-api.com"; // <-- tu futura URL

export interface Vestido {
    id: number;
    titulo: string;
    categoria: "novia" | "madrina" | "fiesta" | "otro";
    imagen: string;
    nuevo?: boolean;
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
    return Array.from({length: 16}, (_, i) => ({
        id: i + 1,
        titulo: `Vestido ${i + 1}`,
        categoria: categorias[i % categorias.length],
        imagen: `https://picsum.photos/seed/cat-${i}/400/600`,
        nuevo: i < 4,
    }));
}