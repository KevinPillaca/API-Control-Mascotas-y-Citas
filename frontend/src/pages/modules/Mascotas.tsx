import { useEffect, useState } from "react";
import { Plus, Dog, User, Calendar, Search } from "lucide-react";
import TableActions from "../../components/TableActions";
import MascotaModal from "../../components/modals/MascotaModal";
import { mascotaService } from "../../services/mascotas.service";
import type { Mascota } from "../../interfaces/mascotas";
import { alertService } from "../../utils/alerts";
import { useClienteStore } from "../../store/useCliente";
import { usePagination } from "../../hooks/usePagination";

const Mascotas = () => {
  // --- ESTADOS ---
  const [mascotas, setMascotas] = useState<Mascota[]>([]); // Guarda la lista completa que viene de la base de datos
  const [loading, setLoading] = useState(true); // Controla si mostramos el mensaje de "Cargando..."
  const [isModalOpen, setIsModalOpen] = useState(false); // Switch para abrir o cerrar la ventana flotante (modal)
  const [mascotaSeleccionada, setMascotaSeleccionada] =
    useState<Mascota | null>(null); // Guarda los datos de la mascota que queremos editar
  const { fetchClientes } = useClienteStore(); // Trae la lista de dueños desde el estado global (Zustand)

  // --- LÓGICA DE DATOS ---
  const obtenerMascotas = async () => {
    try {
      setLoading(true); // Empieza la carga
      const data = await mascotaService.getAll(); // Pide las mascotas al servidor
      setMascotas(data); // Guarda el resultado en el estado
    } catch (error) {
      console.error("Error al traer mascotas:", error);
      alertService.error("No se pudieron cargar los pacientes");
    } finally {
      setLoading(false); // Termina la carga, pase lo que pase
    }
  };

  useEffect(() => {
    obtenerMascotas(); // Se ejecuta una sola vez cuando entras a la página
    fetchClientes(); // Carga los clientes para tenerlos listos en el modal
  }, []);

  // --- MANEJADORES DE INTERFAZ ---
  const handleEdit = (mascota: Mascota) => {
    setMascotaSeleccionada(mascota); // Pasa la mascota elegida al estado para que el modal la reciba
    setIsModalOpen(true); // Abre el modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cierra el modal
    setMascotaSeleccionada(null); // Limpia la mascota seleccionada para que el próximo registro sea nuevo
  };

  const handleDelete = async (id: number) => {
    const result = await alertService.confirmDelete("este paciente"); // Muestra la alerta de confirmación
    if (result.isConfirmed) {
      try {
        await mascotaService.delete(id); // Borra en la base de datos
        alertService.success("Mascota eliminada correctamente");
        obtenerMascotas(); // Refresca la lista para que desaparezca el borrado
      } catch (error) {
        alertService.error("No se pudo eliminar");
      }
    }
  };

  // --- PAGINACIÓN ---
  const {
    itemsPaginados: mascotasPaginadas, // La lista cortada (ej: solo 6) que se muestra en la tabla
    paginaActual,
    totalPaginas,
    irSiguiente,
    irAnterior,
  } = usePagination(mascotas, 6); // Divide la lista 'mascotas' en trozos de 6

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-azul-vet font-montserrat tracking-tight">
            Pacientes
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-verde-vet text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-verde-vet/20 hover:scale-102 transition-all flex items-center justify-center gap-2 font-montserrat"
        >
          <Plus size={24} />
          Registrar Paciente
        </button>
      </div>

      {/* 2. BARRA DE BÚSQUEDA */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar mascota o dueño..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 outline-none focus:border-azul-vet focus:ring-4 focus:ring-azul-vet/5 transition-all font-opensans"
        />
      </div>

      {/* 3. TABLA DINÁMICA */}
      <div className="bg-white rounded-[35px] overflow-hidden border border-slate-100 font-opensans shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* NOMBRES CLUMNAS */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mascota
                </th>
                <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Especie / Raza
                </th>
                <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Propietario
                </th>
                <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            {/* DEATALLE DE LOS REGISTROS */}
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-400">
                    Cargando pacientes...
                  </td>
                </tr>
              ) : mascotasPaginadas.length > 0 ? ( // <--- CAMBIO AQUÍ: Usamos la variable del hook
                mascotasPaginadas.map(
                  (
                    mascota, // <--- CAMBIO AQUÍ: Mapeamos la lista recortada
                  ) => (
                    <tr
                      key={mascota.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-verde-vet/10 flex items-center justify-center text-verde-vet shadow-sm group-hover:scale-110 transition-transform">
                            <Dog size={24} />
                          </div>
                          <div>
                            <div className="font-bold text-azul-vet text-lg leading-tight tracking-tight">
                              {mascota.nombre}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                              <Calendar size={12} /> {mascota.edad} años •{" "}
                              {mascota.peso}kg
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                          {mascota.especie}
                        </span>
                        <div className="text-sm text-slate-400 mt-1 ml-1">
                          {mascota.raza}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-azul-vet/5 flex items-center justify-center text-azul-vet border border-azul-vet/10">
                            <User size={14} />
                          </div>
                          <span className="text-sm font-semibold text-slate-700">
                            {mascota.clientes?.nombre || "Sin dueño"}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <TableActions
                          onEdit={() => handleEdit(mascota)}
                          onDelete={() =>
                            mascota.id && handleDelete(mascota.id)
                          }
                        />
                      </td>
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-slate-400 italic"
                  >
                    No hay mascotas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* PAGINACION DE LA TABLAS */}
        <footer className="flex items-center justify-between px-8 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Página{" "}
            <span className="font-bold text-azul-vet">{paginaActual}</span> de{" "}
            {totalPaginas || 1}
          </p>

          <div className="flex gap-2">
            <button
              onClick={irAnterior}
              disabled={paginaActual === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold disabled:opacity-30"
            >
              Anterior
            </button>
            <button
              onClick={irSiguiente}
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
              className="px-4 py-2 rounded-xl bg-azul-vet text-white font-bold disabled:opacity-30 shadow-md"
            >
              Siguiente
            </button>
          </div>
        </footer>
      </div>

      {/* MODAL (Fuera de la tabla para evitar errores de renderizado) */}
      <MascotaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRefresh={obtenerMascotas}
        mascotaEdit={mascotaSeleccionada}
      />
    </div>
  );
};

export default Mascotas;
