export interface Servicio {
  id: number;
  icono: string;
  titulo: string;
  subtitulo: string;
  resumen: string;
  descripcion: string;
  imagen: string;
  href: string;
  orden: number;
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

export interface Cita extends CitaPayload {
  id: number;
  created_at: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  nombre: string;
}

export type Database = {
  public: {
    Tables: {
      servicios: {
        Row: Servicio;
        Insert: Omit<Servicio, "id">;
        Update: Partial<Omit<Servicio, "id">>;
      };
      trabajos: {
        Row: GaleriaItem;
        Insert: Omit<GaleriaItem, "id" | "imagenes">;
        Update: Partial<Omit<GaleriaItem, "id" | "imagenes">>;
      };
      imagenes_trabajo: {
        Row: {
          id: number;
          trabajo_id: number;
          url: string;
          orden: number;
        };
        Insert: {
          trabajo_id: number;
          url: string;
          orden: number;
        };
        Update: Partial<{
          trabajo_id: number;
          url: string;
          orden: number;
        }>;
      };
      citas: {
        Row: Cita;
        Insert: Omit<Cita, "id" | "created_at">;
        Update: Partial<Omit<Cita, "id" | "created_at">>;
      };
      admin_profiles: {
        Row: AdminProfile;
        Insert: Omit<AdminProfile, "id">;
        Update: Partial<Omit<AdminProfile, "id">>;
      };
    };
  };
};
