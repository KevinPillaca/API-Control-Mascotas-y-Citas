// Datos del cliente incluidos en la consulta de mascota
export interface ClienteRelacion {
  id: number;
  nombre: string;
  telefono: string;
}

// Interfaz para lectura y listado (GET)
export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza?: string;
  edad: number;
  peso: number;
  cliente_id: number;
  created_at?: string;
  clientes: ClienteRelacion; // Objeto que viene del 'include' de Prisma
}

// Interfaz para creación y edición (POST/PUT)
export interface MascotaForm {
  nombre: string;
  especie: string;
  raza?: string;
  edad: number;
  peso: number;
  cliente_id: number;
}