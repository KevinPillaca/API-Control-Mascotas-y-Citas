import api from "../api/axiosConfig";
import type { Diagnostico, CreateDiagnosticoInput } from "../interfaces/diagnosticos";

export const diagnosticosService = {
  // GET: Obtener todos los diagnósticos
  getAll: async (): Promise<Diagnostico[]> => {
    const { data } = await api.get<Diagnostico[]>("/diagnosticos");
    return data;
  },

  // POST: Crear un nuevo diagnóstico
  create: async (datos: CreateDiagnosticoInput): Promise<Diagnostico> => {
    const { data } = await api.post<Diagnostico>("/diagnosticos", datos);
    return data;
  },

  // PUT: Actualizar un diagnóstico existente
  update: async (id: number, datos: Partial<CreateDiagnosticoInput>): Promise<Diagnostico> => {
    // Tip: Usamos el tipo para la respuesta de la data según tu backend
    const { data } = await api.put<{ data: Diagnostico }>(`/diagnosticos/${id}`, datos);
    return data.data;
  },

  // DELETE: Eliminar un diagnóstico
  delete: async (id: number): Promise<void> => {
    await api.delete(`/diagnosticos/${id}`);
  }
};