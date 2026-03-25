import { useState, useEffect } from "react";
import { Search, Activity, Stethoscope, Eye } from "lucide-react";
import { diagnosticosService } from "../../services/diagnostico.service";
import { alertService } from "../../utils/alerts";
import type {
  Diagnostico,
  CreateDiagnosticoInput,
} from "../../interfaces/diagnosticos";
import TableActions from "../../components/TableActions";
import DiagnosticoFormModal from "../../components/modals/DiagnosticoModal"; // <-- Importamos el modal
import DiagnosticoViewModal from "../../components/modals/DiagnosticoViewModal";
import { usePagination } from "../../hooks/usePagination";

const Diagnosticos = () => {
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [diagParaVer, setDiagParaVer] = useState<Diagnostico | null>(null);

  // ESTADOS PARA EL MODAL DE EDICIÓN
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diagSeleccionado, setDiagSeleccionado] = useState<Diagnostico | null>(
    null,
  );

  const fetchDiagnosticos = async () => {
    try {
      setLoading(true);
      const data = await diagnosticosService.getAll();
      setDiagnosticos(data);
    } catch (error) {
      alertService.error("Error al cargar el historial de diagnósticos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnosticos();
  }, []);

  // FUNCIÓN PARA ABRIR EL MODAL (Llamada por TableActions)
  const handleEdit = (diag: Diagnostico) => {
    setDiagSeleccionado(diag);
    setIsModalOpen(true);
  };

  // FUNCION DE BOTON VER
  const handleView = (diag: Diagnostico) => {
    setDiagParaVer(diag);
    setIsViewModalOpen(true);
  };

  // FUNCIÓN PARA GUARDAR LOS CAMBIOS EDITADOS
  const handleSaveEdit = async (datos: CreateDiagnosticoInput) => {
    try {
      if (diagSeleccionado?.id) {
        await diagnosticosService.update(diagSeleccionado.id, datos);
        alertService.success("¡Diagnóstico actualizado correctamente!");
        setIsModalOpen(false);
        setDiagSeleccionado(null);
        fetchDiagnosticos(); // Refrescamos la tabla
      }
    } catch (error) {
      alertService.error("No se pudo actualizar el diagnóstico");
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = await alertService.confirmDelete("este diagnóstico");
    if (confirm.isConfirmed) {
      try {
        await diagnosticosService.delete(id);
        setDiagnosticos(diagnosticos.filter((d) => d.id !== id));
        alertService.success("Diagnóstico eliminado");
      } catch (error) {
        alertService.error("No se pudo eliminar");
      }
    }
  };

  const diagnosticosFiltrados = diagnosticos.filter((diag) => {
    const search = searchTerm.toLowerCase();
    return (
      diag.citas?.mascotas?.nombre?.toLowerCase().includes(search) ||
      diag.descripcion.toLowerCase().includes(search)
    );
  });

  //PAGINACION
  const {
    paginaActual,
    totalPaginas,
    itemsPaginados,
    irSiguiente,
    irAnterior,
    setPaginaActual,
  } = usePagination(diagnosticosFiltrados, 7); // 5 registros por página

  // Resetear a la página 1 cuando el usuario busca algo
  useEffect(() => {
    setPaginaActual(1);
  }, [searchTerm, setPaginaActual]);

  return (
    <main className="p-8 space-y-8 animate-in fade-in duration-500 font-opensans">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <section>
          <h1 className="text-3xl font-bold text-azul-vet font-montserrat tracking-tight text-[30px]">
            Historial de Diagnósticos
          </h1>
          <p className="text-slate-400 font-opensans">
            Consulta los resultados de las citas pasadas
          </p>
        </section>

        <div className="flex items-center gap-2 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100">
          <Activity size={20} />
          <span className="font-bold text-sm">Sistema de Salud Activo</span>
        </div>
      </header>

      {/* Buscador */}
      <section className="relative max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar por mascota o diagnóstico..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-azul-vet outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      {/* Tabla */}
      <section className="bg-white rounded-[30px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100 font-montserrat uppercase text-xs font-bold text-slate-400">
              <tr>
                <th className="px-6 py-4">Mascota</th>
                <th className="px-6 py-4">Diagnóstico</th>
                <th className="px-6 py-4">Tratamiento</th>
                <th className="px-6 py-4 text-center">Fecha</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-opensans">
              {!loading &&
                itemsPaginados.map((diag) => (
                  <tr
                    key={diag.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-azul-vet/10 rounded-full flex items-center justify-center text-azul-vet">
                          <Stethoscope size={20} />
                        </div>
                        <div>
                          <b className="block text-slate-700">
                            {diag.citas?.mascotas?.nombre || "S/N"}
                          </b>
                          <small className="text-slate-400">
                            {diag.citas?.mascotas?.especie || "Mascota"}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                      {diag.descripcion}
                    </td>
                    <td className="px-6 py-4 text-slate-500 italic">
                      {diag.tratamiento || "No especificado"}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-400 font-bold">
                      {diag.created_at
                        ? new Date(diag.created_at).toLocaleDateString()
                        : "---"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleView(diag)}
                          className="p-2 text-azul-vet hover:bg-azul-vet/10 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye size={18} />
                        </button>
                        <TableActions
                          onEdit={() => handleEdit(diag)}
                          onDelete={() => diag.id && handleDelete(diag.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* --- CONTROLES DE PAGINACIÓN --- */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
          <p className="text-sm text-slate-500 font-opensans">
            Página{" "}
            <span className="font-bold text-azul-vet">{paginaActual}</span> de{" "}
            {totalPaginas}
          </p>

          <div className="flex gap-2">
            <button
              onClick={irAnterior}
              disabled={paginaActual === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-white disabled:opacity-30 transition-all"
            >
              Anterior
            </button>
            <button
              onClick={irSiguiente}
              disabled={paginaActual === totalPaginas}
              className="px-4 py-2 rounded-xl bg-azul-vet text-white font-bold text-xs hover:bg-blue-700 disabled:opacity-30 shadow-md shadow-blue-100 transition-all"
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>

      {/* MODAL DE EDICIÓN (Aparece condicionalmente) */}
      {isModalOpen && (
        <DiagnosticoFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setDiagSeleccionado(null);
          }}
          onSave={handleSaveEdit}
          citaId={diagSeleccionado?.cita_id || 0}
          nombreMascota={diagSeleccionado?.citas?.mascotas?.nombre || "Mascota"}
          initialData={diagSeleccionado} // PASAMOS LOS DATOS PARA EDITAR
        />
      )}

      {/* MODAL DE VER DIAGNOSTICO */}
      <DiagnosticoViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        diagnostico={diagParaVer}
      />
    </main>
  );
};

export default Diagnosticos;
