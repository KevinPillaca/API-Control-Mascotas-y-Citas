// frontend/src/interfaces/diagnosticos.ts

export interface Cliente {
  id?: number;
  nombre: string;
  telefono?: string;
  email?: string;
}

export interface Diagnostico {
  id: number;
  descripcion: string;
  tratamiento?: string;
  medicamentos?: string;
  observaciones?: string;
  cita_id: number;
  created_at: string;
  // Estos vienen del "include" de tu Prisma en el backend
  citas?: {
    fecha: string;
    mascotas?: {
      nombre: string;
      especie: string;
      raza?: string;
      // AGREGAMOS ESTO: La relación con el dueño
      clientes?: Cliente; 
    };
  };
}

// Para cuando creamos uno nuevo (Se queda igual)
export interface CreateDiagnosticoInput {
  descripcion: string;
  cita_id: number;
  tratamiento?: string;
  medicamentos?: string;
  observaciones?: string;
}