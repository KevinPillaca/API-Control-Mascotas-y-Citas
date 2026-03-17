import api from "../api/axiosConfig";
import type { Mascota, MascotaForm } from "../interfaces/mascotas";

export const mascotaService = {
  // Obtener todas las mascotas con sus dueños (GET)
  getAll: async (): Promise<Mascota[]> => {
    const { data } = await api.get<Mascota[]>("/mascotas");
    return data;
  },

  // Crear una nueva mascota (POST)
  create: async (mascota: MascotaForm): Promise<Mascota> => {
    // Transformamos los strings a números antes de enviar
    const formattedData = {
      ...mascota,
      edad: parseInt(mascota.edad.toString()) || 0,
      peso: parseFloat(mascota.peso.toString()) || 0,
      cliente_id: parseInt(mascota.cliente_id.toString())
    };
    
    const { data } = await api.post<Mascota>("/mascotas", formattedData);
    return data;
  },

  // Actualizar datos de una mascota (PUT)
  update: async (id: number, mascota: Partial<MascotaForm>): Promise<Mascota> => {
    // Transformamos solo si los campos existen en el objeto partial
    const formattedData = {
      ...mascota,
      ...(mascota.edad && { edad: parseInt(mascota.edad.toString()) }),
      ...(mascota.peso && { peso: parseFloat(mascota.peso.toString()) }),
      ...(mascota.cliente_id && { cliente_id: parseInt(mascota.cliente_id.toString()) })
    };

    const { data } = await api.put<Mascota>(`/mascotas/${id}`, formattedData);
    return data;
  },

  // Eliminar una mascota (DELETE)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/mascotas/${id}`);
  },
};
