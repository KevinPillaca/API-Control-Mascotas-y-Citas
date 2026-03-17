import { useEffect, useState } from "react";
import { Search, UserPlus } from "lucide-react"; // search aun no implimentado
import { clienteService } from "../../services/clientes.service";
import type { Cliente } from "../../interfaces/clientes";
import TableActions from "../../components/TableActions";
import ClienteModal from "../../components/modals/ClienteModal";
import { usePagination } from "../../hooks/usePagination";
import { alertService } from "../../utils/alerts";

const Clientes = () => {
  // Estados de datos y control de interfaz
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);

  // READ: Obtener lista de clientes desde el Backend
  const obtenerClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAll();
      setClientes(data);
    } catch (error) {
      console.error("Error al traer clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial al montar el componente
  useEffect(() => {
    obtenerClientes();
  }, []);

  // UPDATE: Carga los datos en el estado para editarlos en el Modal
  const handleEdit = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setIsModalOpen(true);
  };

  // DELETE: Elimina un registro físicamente en la base de datos
  const handleDelete = async (id: number) => {
    // Llamamos a la plantilla de confirmación
    const result = await alertService.confirmDelete("este cliente");

    if (result.isConfirmed) {
      try {
        await clienteService.delete(id);

        // Llamamos a la plantilla de éxito
        alertService.success("El cliente ha sido borrado correctamente.");

        obtenerClientes();
      } catch (error) {
        alertService.error("No se pudo eliminar el cliente.");
      }
    }
  };

  // Funciones de cierre y limpieza de estados
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setClienteSeleccionado(null);
  };

  // Configuración de Paginación
  const {
    itemsPaginados: clientesPaginados,
    paginaActual,
    totalPaginas,
    irSiguiente,
    irAnterior,
  } = usePagination(clientes, 7);

  return (
    <div className="p-8">
      {/* 1. ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-azul-vet font-montserrat">
            Gestión de Clientes
          </h1>
        </div>

        {/* Botón Nuevo Cliente */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-verde-vet text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-verde-vet/20 hover:opacity-90 transition-all active:scale-95"
        >
          <UserPlus size={20} />
          Nuevo Cliente
        </button>
      </div>

      {/* 2. BARRA DE BÚSQUEDA */}
      <div className="bg-white p-4 rounded-[30px] shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar cliente..."
          className="flex-1 bg-transparent outline-none text-slate-600"
        />
      </div>

      {/* 3. TABLA (ESTRUCTURA VACÍA) */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-300/50">
              <tr className="text-slate-900 uppercase text-[12px] font-black tracking-wider border-b-2 border-slate-200">
                <th className="px-6 py-5">Nombre</th>
                <th className="px-6 py-5">Teléfono</th>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5">Dirección</th>
                <th className="px-6 py-5 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-slate-400 animate-pulse"
                  >
                    Cargando datos desde el servidor...
                  </td>
                </tr>
              ) : clientesPaginados.length > 0 ? (
                clientesPaginados.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="hover:bg-verde-vet/[.2] transition-colors group"
                  >
                    <td className="px-6 py-4 font-bold text-azul-vet">
                      {cliente.nombre}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {cliente.telefono}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {cliente.email}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {cliente.direccion}
                    </td>
                    <td className="px-6 py-4">
                      <TableActions
                        onEdit={() => handleEdit(cliente)}
                        onDelete={() => {
                          if (cliente.id) handleDelete(cliente.id); // Llamamos a la función con el ID
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-24 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-300">
                      <p className="font-montserrat italic text-lg">
                        No hay clientes para mostrar
                      </p>
                      <p className="text-sm">Agrega uno nuevo para comenzar.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* CONTROLES DE PAGINACIÓN */}
          <div className="flex items-center justify-between px-8 py-4 bg-slate-50 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Página{" "}
              <span className="font-bold text-azul-vet">{paginaActual}</span> de{" "}
              {totalPaginas || 1}
            </p>

            <div className="flex gap-2">
              <button
                onClick={irAnterior}
                disabled={paginaActual === 1}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Anterior
              </button>
              <button
                onClick={irSiguiente}
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                className="px-4 py-2 rounded-xl bg-azul-vet text-white font-bold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
        {/* Componente Modal al final */}
        <ClienteModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onRefresh={obtenerClientes}
          clienteEdit={clienteSeleccionado} // <--- Nueva prop
        />
      </div>
    </div>
  );
};

export default Clientes;
