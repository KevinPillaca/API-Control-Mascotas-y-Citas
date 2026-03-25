import { X, ClipboardList, Pill, MessageSquare, Calendar, Stethoscope, User, Dog, Phone, Activity } from "lucide-react";
import type { Diagnostico } from "../../interfaces/diagnosticos";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  diagnostico: Diagnostico | null;
}

const DiagnosticoViewModal = ({ isOpen, onClose, diagnostico }: Props) => {
  if (!isOpen || !diagnostico) return null;

  // Formateo de fecha
  const fechaFormateada = diagnostico.created_at 
    ? new Date(diagnostico.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })
    : "Fecha no disponible";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-[35px] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-300">
        
        {/* Encabezado Principal */}
        <header className="bg-azul-vet p-6 text-white flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
              <Stethoscope size={30} />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-montserrat tracking-tight">Ficha de Diagnóstico</h2>
              <p className="text-blue-100 text-sm flex items-center gap-2 mt-1">
                <Calendar size={14} /> Atendido el {fechaFormateada}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-95">
            <X size={26} />
          </button>
        </header>

        <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* SECCIÓN 1: INFORMACIÓN GENERAL (Grid 2 columnas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Mascota */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <Dog size={12} className="text-azul-vet" /> Datos del Paciente
              </span>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-700">{diagnostico.citas?.mascotas?.nombre}</p>
                <p className="text-sm text-slate-500 capitalize">
                  {diagnostico.citas?.mascotas?.especie} • {diagnostico.citas?.mascotas?.raza || 'Raza no especificada'}
                </p>
              </div>
            </div>

            {/* Card Propietario */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <User size={12} className="text-emerald-500" /> Propietario
              </span>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-700">
                   {/* Aquí asumo que tienes la relación cargada en tu interface */}
                   {diagnostico.citas?.mascotas?.clientes?.nombre || 'Dueño no registrado'}
                </p>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Phone size={12} /> {diagnostico.citas?.mascotas?.clientes?.telefono || 'Sin teléfono'}
                </p>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: HALLAZGOS MÉDICOS */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-azul-vet uppercase tracking-widest flex items-center gap-2">
              <ClipboardList size={16} /> Diagnóstico Detallado
            </h3>
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-50 shadow-sm">
              <p className="text-slate-700 leading-relaxed text-sm italic">
                "{diagnostico.descripcion}"
              </p>
            </div>
          </section>

          {/* SECCIÓN 3: TRATAMIENTO Y MEDICACIÓN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan de Tratamiento</h3>
              <p className="text-slate-600 text-sm bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                {diagnostico.tratamiento || "No se especificó un tratamiento físico."}
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Pill size={14} className="text-emerald-500" /> Receta / Medicinas
              </h3>
              <p className="text-slate-600 text-sm bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 font-medium">
                {diagnostico.medicamentos || "Sin prescripción médica."}
              </p>
            </section>
          </div>

          {/* SECCIÓN 4: OBSERVACIONES */}
          {diagnostico.observaciones && (
            <section className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                <MessageSquare size={14} /> Notas de Seguimiento
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl text-slate-500 text-sm">
                {diagnostico.observaciones}
              </div>
            </section>
          )}
        </div>

        {/* Footer con Acciones */}
        <footer className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-400">
            <Activity size={16} />
            <span className="text-[10px] font-bold uppercase">Software Veterinaria v1.0</span>
          </div>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-azul-vet text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            Finalizar Revisión
          </button>
        </footer>
      </div>
    </div>
  );
};

export default DiagnosticoViewModal;