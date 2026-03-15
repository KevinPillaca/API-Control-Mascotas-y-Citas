import api from "../api/axiosConfig";
import type { Cliente } from "../interfaces/clientes";

export const clienteService = {
  // 1. Obtener todos los clientes (GET)
  getAll: async (): Promise<Cliente[]> => {
    const { data } = await api.get<Cliente[]>("/clientes");
    return data;
  },

  // 2. Crear un nuevo cliente (POST)
  create: async (cliente: Omit<Cliente, "id">): Promise<Cliente> => {
    const { data } = await api.post<Cliente>("/clientes", cliente);
    return data;
  },

  // 3. Actualizar un cliente (PUT)
  update: async (id: number, cliente: Cliente): Promise<Cliente> => {
    const { data } = await api.put<Cliente>(`/clientes/${id}`, cliente);
    return data;
  },

  // 4. Eliminar un cliente (DELETE)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },
};
