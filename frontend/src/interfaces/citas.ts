export interface Cita {
  id?: number;
  fecha: string | Date;
  motivo: string; // Tal cual lo tienes en tu DTO
  estado: 'pendiente' | 'atendida' | 'cancelada';
  mascota_id: number;
  
  // Relaciones por el "include" de Prisma
  mascotas?: {
    nombre: string;
    especie: string;
    clientes?: {
      nombre: string;
      telefono: string;
    };
  };
}

// Para usarlo en el formulario de creación sin que TS te pida el ID o las relaciones
export type CreateCitaInput = Omit<Cita, 'id' | 'mascotas'>;