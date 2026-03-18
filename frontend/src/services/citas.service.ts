import api from "../api/axiosConfig"; 
import type { Cita, CreateCitaInput } from "../interfaces/citas";

export const citasService = {
  // LISTAR: Trae citas + mascotas + clientes (gracias a tu Prisma include)
  getAll: async (): Promise<Cita[]> => {
    const { data } = await api.get<Cita[]>("/citas");
    return data;
  },

  // CREAR: Usa el input que omite ID y relaciones
  create: async (cita: CreateCitaInput): Promise<Cita> => {
    const { data } = await api.post<Cita>("/citas", cita);
    return data;
  },

  // ACTUALIZAR: Permite mandar solo lo que quieras cambiar (ej: solo el estado)
  update: async (id: number, cita: Partial<Cita>): Promise<Cita> => {
    const { data } = await api.put<Cita>(`/citas/${id}`, cita);
    return data;
  },

  // ELIMINAR
  delete: async (id: number): Promise<void> => {
    await api.delete(`/citas/${id}`);
  }
};