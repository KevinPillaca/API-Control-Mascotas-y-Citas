import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  Dog,
  ChevronLeft, // <-- Restaurado
  ChevronRight, // <-- Restaurado
  Stethoscope,
} from "lucide-react";
import CitasModal from "../../components/modals/CitasModal";
import TableActions from "../../components/TableActions";
import DiagnosticoFormModal from "../../components/modals/DiagnosticoModal";
import { citasService } from "../../services/citas.service";
import { mascotaService } from "../../services/mascotas.service";
import { diagnosticosService } from "../../services/diagnostico.service";
import { alertService } from "../../utils/alerts";
import { usePagination } from "../../hooks/usePagination";
import type { Cita, CreateCitaInput } from "../../interfaces/citas";
import type { Mascota } from "../../interfaces/mascotas";
import type { CreateDiagnosticoInput } from "../../interfaces/diagnosticos";

const Citas = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]); // <-- Se usa en fetchDatos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | undefined>(
    undefined,
  );

  // Estados para Diagnóstico
  const [isDiagModalOpen, setIsDiagModalOpen] = useState(false);
  const [citaParaAtender, setCitaParaAtender] = useState<Cita | null>(null);

  // LOGICA DE PAGINACIÓN COMPLETA
  const {
    paginaActual,
    totalPaginas,
    itemsPaginados,
    irSiguiente,
    irAnterior,
    irPagina,
  } = usePagination(citas, 7);

  const fetchDatos = async () => {
    try {
      setLoading(true);
      const [dataCitas, dataMascotas] = await Promise.all([
        citasService.getAll(),
        mascotaService.getAll(),
      ]);
      setCitas(dataCitas);
      setMascotas(dataMascotas); // <-- Restaurado el uso de dataMascotas
    } catch (error) {
      alertService.error("No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const handleNuevaCita = () => {
    setCitaSeleccionada(undefined);
    setIsModalOpen(true);
  };

  const handleEditarCita = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setIsModalOpen(true);
  };

  const handleAtenderCita = (cita: Cita) => {
    setCitaParaAtender(cita);
    setIsDiagModalOpen(true);
  };

  const handleSaveDiagnostico = async (datos: CreateDiagnosticoInput) => {
    try {
      // 1. Guardar el diagnóstico (Esto ya funciona en tu BD)
      await diagnosticosService.create(datos);

      // 2. Actualizar la cita de forma segura
      if (citaParaAtender?.id) {
        // PROTIP: No envíes el objeto completo (...citaParaAtender).
        // Envía solo los datos primitivos que el Backend necesita actualizar.
        await citasService.update(citaParaAtender.id, {
          fecha: citaParaAtender.fecha,
          motivo: citaParaAtender.motivo,
          mascota_id: citaParaAtender.mascota_id,
          estado: "atendida", // <-- El cambio clave
        } as any);
      }

      alertService.success("¡Atención registrada y cita actualizada!");
      setIsDiagModalOpen(false);
      setCitaParaAtender(null);
      fetchDatos(); // Esto refrescará la tabla y verás el color verde
    } catch (error) {
      console.error("Detalle del error:", error);
      alertService.error("Error al finalizar la atención");
    }
  };

  const handleSaveCita = async (datos: CreateCitaInput) => {
    try {
      if (citaSeleccionada?.id) {
        await citasService.update(citaSeleccionada.id, datos);
        alertService.success("La cita se ha actualizado correctamente");
      } else {
        await citasService.create(datos);
        alertService.success("La cita se ha programado correctamente");
      }
      setIsModalOpen(false);
      fetchDatos();
    } catch (error) {
      alertService.error("Error al procesar la solicitud");
    }
  };

  const handleDeleteCita = async (id: number, nombrePaciente: string) => {
    const confirmacion = await alertService.confirmDelete(
      `la cita de ${nombrePaciente}`,
    );
    if (confirmacion.isConfirmed) {
      try {
        await citasService.delete(id);
        await fetchDatos();
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
    <main className="p-8 space-y-8 animate-in fade-in duration-500 font-opensans">
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

      {/* Buscador */}
      <section className="relative max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
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
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                  Fecha/Hora
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                  Paciente
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                  Motivo
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">
                  Estado
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {!loading &&
                itemsPaginados.map((cita) => (
                  <tr
                    key={cita.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-azul-vet" />
                        <span>
                          <b className="block text-azul-vet">
                            {new Date(cita.fecha).toLocaleDateString()}
                          </b>
                          <small className="text-slate-400 font-bold flex items-center gap-1">
                            <Clock size={10} />{" "}
                            {new Date(cita.fecha).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </small>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-opensans">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <Dog size={14} /> {cita.mascotas?.nombre}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <User size={12} /> {cita.mascotas?.clientes?.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 italic font-opensans">
                      {cita.motivo}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getEstadoEstilo(cita.estado)}`}
                      >
                        {cita.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {cita.estado === "pendiente" && (
                          <button
                            onClick={() => handleAtenderCita(cita)}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Atender"
                          >
                            <Stethoscope size={18} />
                          </button>
                        )}
                        <TableActions
                          onEdit={() => handleEditarCita(cita)}
                          onDelete={() =>
                            cita.id &&
                            handleDeleteCita(
                              cita.id,
                              cita.mascotas?.nombre || "la cita",
                            )
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* --- NAVEGACIÓN RESTAURADA --- */}
        <footer className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-opensans">
            Mostrando página <b className="text-azul-vet">{paginaActual}</b> de{" "}
            <b>{totalPaginas}</b>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={irAnterior}
              disabled={paginaActual === 1}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (n) => (
                  <button
                    key={n}
                    onClick={() => irPagina(n)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs ${paginaActual === n ? "bg-azul-vet text-white shadow-md" : "bg-white text-slate-500 border border-slate-200"}`}
                  >
                    {n}
                  </button>
                ),
              )}
            </div>
            <button
              onClick={irSiguiente}
              disabled={paginaActual === totalPaginas}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
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

      <DiagnosticoFormModal
        isOpen={isDiagModalOpen}
        onClose={() => setIsDiagModalOpen(false)}
        onSave={handleSaveDiagnostico}
        citaId={citaParaAtender?.id || 0}
        nombreMascota={citaParaAtender?.mascotas?.nombre || ""}
      />
    </main>
  );
};

export default Citas;
