export interface Cliente {
  id?: number;          // Opcional porque al crear uno nuevo el ID lo pone la BD
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  created_at?: string;  // Viene del TIMESTAMP de MySQL
}