import { useState, useEffect } from "react";
import { Plus, Search, Calendar, Clock, User, Dog, ChevronLeft, ChevronRight } from "lucide-react"; 
import CitasModal from "../../components/modals/CitasModal";
import TableActions from "../../components/TableActions";
import { citasService } from "../../services/citas.service";
import { mascotaService } from "../../services/mascotas.service";
import { alertService } from "../../utils/alerts";
import { usePagination } from "../../hooks/usePagination"; // Importamos tu hook
import type { Cita, CreateCitaInput } from "../../interfaces/citas";
import type { Mascota } from "../../interfaces/mascotas";

const Citas = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | undefined>(undefined);

  // LOGICA DE PAGINACIÓN: Configuramos el hook con el array de citas (7 por página)
  const {
    paginaActual,
    totalPaginas,
    itemsPaginados,
    irSiguiente,
    irAnterior,
    irPagina,
  } = usePagination(citas, 7);

  // LOGICA GET: Esta función llama a los servicios para traer los datos de la BD y mostrarlos en la tabla
  const fetchDatos = async () => {
    try {
      setLoading(true);
      const [dataCitas, dataMascotas] = await Promise.all([
        citasService.getAll(),
        mascotaService.getAll(),
      ]);
      setCitas(dataCitas); // Guardamos las citas obtenidas en el estado
      setMascotas(dataMascotas); // Guardamos las mascotas para el select del modal
    } catch (error) {
      alertService.error("No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos(); // Se ejecuta al cargar la página por primera vez
  }, []);

  // LOGICA MODAL NUEVO: Prepara el estado para que el modal se abra vacío (limpio)
  const handleNuevaCita = () => {
    setCitaSeleccionada(undefined);
    setIsModalOpen(true);
  };

  // LOGICA MODAL EDITAR: Recibe los datos de la fila seleccionada y los pasa al modal
  const handleEditarCita = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setIsModalOpen(true);
  };

  // LOGICA POST / PUT: Esta función decide si enviar un "create" (POST) o un "update" (PUT) a la BD
  const handleSaveCita = async (datos: CreateCitaInput) => {
    try {
      if (citaSeleccionada?.id) {
        // Si hay un ID, llamamos al servicio de actualización (PUT)
        await citasService.update(citaSeleccionada.id, datos);
        alertService.success("La cita se ha actualizado correctamente", "¡Actualizado!");
      } else {
        // Si no hay ID, llamamos al servicio de creación (POST)
        await citasService.create(datos);
        alertService.success("La cita se ha programado correctamente", "¡Agendado!");
      }

      setIsModalOpen(false); // Cerramos el modal tras la operación
      fetchDatos(); // Refrescamos la tabla para ver los cambios (GET de nuevo)
    } catch (error) {
      alertService.error("Error al procesar la solicitud");
      console.error(error);
    }
  };

  // LOGICA DELETE: Llama al servicio para eliminar el registro por ID tras confirmar con el usuario
  const handleDeleteCita = async (id: number, nombrePaciente: string) => {
    const confirmacion = await alertService.confirmDelete(`la cita de ${nombrePaciente}`);

    if (confirmacion.isConfirmed) {
      try {
        await citasService.delete(id); // Llamada al backend para borrar
        await fetchDatos(); // Refrescamos la lista para que desaparezca de la tabla
        alertService.success("Cita eliminada correctamente");
      } catch (error) {
        alertService.error("No se pudo eliminar la cita");
      }
    }
  };

  const getEstadoEstilo = (estado: string) => {
    const estilos = {
      pendiente: "bg-amber-100 text-amber-600 border-amber-200",
      atendida: "bg-emerald-100 text-emerald-600 border-emerald-200",
      cancelada: "bg-rose-100 text-rose-600 border-rose-200",
    };
    return estilos[estado as keyof typeof estilos] || estilos.pendiente;
  };

  return (
    <main className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <section>
          <h1 className="text-3xl font-bold text-azul-vet font-montserrat tracking-tight text-[30px]">
            Citas control de turnos
          </h1>
        </section>

        <button
          onClick={handleNuevaCita}
          className="bg-azul-vet text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Agendar Cita
        </button>
      </header>

      <section className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Buscar mascota o dueño..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-azul-vet outline-none transition-all"
        />
      </section>

      <section className="bg-white rounded-[30px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100 font-montserrat">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Fecha/Hora</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Paciente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Motivo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Estado</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-opensans">
              {!loading &&
                itemsPaginados.map((cita) => ( // Usamos los items recortados por el hook
                  <tr key={cita.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-azul-vet" />
                        <span>
                          <b className="block text-azul-vet">{new Date(cita.fecha).toLocaleDateString()}</b>
                          <small className="text-slate-400 font-bold flex items-center gap-1">
                            <Clock size={10} /> {new Date(cita.fecha).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </small>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <Dog size={14} /> {cita.mascotas?.nombre}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <User size={12} /> {cita.mascotas?.clientes?.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 italic">{cita.motivo}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getEstadoEstilo(cita.estado)}`}>
                        {cita.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <TableActions
                        onEdit={() => handleEditarCita(cita)}
                        onDelete={() => {
                          if (cita.id && cita.mascotas) {
                            handleDeleteCita(cita.id, cita.mascotas.nombre);
                          } else if (cita.id) {
                            handleDeleteCita(cita.id, "el registro de cita");
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER DE PAGINACIÓN */}
        <footer className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-opensans">
            Mostrando página <b className="text-azul-vet">{paginaActual}</b> de <b>{totalPaginas}</b>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={irAnterior}
              disabled={paginaActual === 1}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => irPagina(n)}
                  className={`w-9 h-9 rounded-xl font-bold transition-all text-xs ${
                    paginaActual === n 
                      ? "bg-azul-vet text-white shadow-md scale-110" 
                      : "bg-white text-slate-500 border border-slate-200 hover:border-azul-vet hover:text-azul-vet"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              onClick={irSiguiente}
              disabled={paginaActual === totalPaginas}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        </footer>
      </section>

      <CitasModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mascotas={mascotas}
        onSave={handleSaveCita}
        citaAEditar={citaSeleccionada}
      />
    </main>
  );
};

export default Citas;