import { create } from "zustand";
import { clienteService } from "../services/clientes.service";
import type { Cliente } from "../interfaces/clientes";

// 1. Agregamos las funciones de Update y Remove a la interfaz
interface ClienteState {
  clientes: Cliente[];
  loading: boolean;
  fetchClientes: () => Promise<void>;
  addClienteToStore: (cliente: Cliente) => void;
  updateClienteInStore: (cliente: Cliente) => void; // Nueva
  removeClienteFromStore: (id: number) => void;    // Nueva
}

export const useClienteStore = create<ClienteState>((set) => ({
  clientes: [],
  loading: false,

  fetchClientes: async () => {
    set({ loading: true });
    try {
      const data = await clienteService.getAll();
      set({ clientes: data, loading: false });
    } catch (error) {
      console.error("Error al cargar clientes en el Store", error);
      set({ loading: false });
    }
  },

  addClienteToStore: (cliente) => {
    set((state) => ({
      clientes: [...state.clientes, cliente]
    }));
  },

  // 2. Implementamos la actualización en la "pizarra"
  updateClienteInStore: (updatedCliente) => {
    set((state) => ({
      clientes: state.clientes.map((c) => 
        c.id === updatedCliente.id ? updatedCliente : c
      )
    }));
  },

  // 3. Implementamos la eliminación en la "pizarra"
  removeClienteFromStore: (id) => {
    set((state) => ({
      clientes: state.clientes.filter((c) => c.id !== id)
    }));
  }
}));