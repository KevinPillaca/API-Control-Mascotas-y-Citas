// frontend/src/components/modals/DiagnosticoFormModal.tsx
import { useState, useEffect } from "react";
import { X, Save, ClipboardList, Pill, MessageSquare } from "lucide-react";
import type { CreateDiagnosticoInput, Diagnostico } from "../../interfaces/diagnosticos";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (datos: CreateDiagnosticoInput) => void;
  citaId: number;
  nombreMascota: string;
  initialData?: Diagnostico | null; // <-- NUEVA PROP para edición
}

const DiagnosticoFormModal = ({ isOpen, onClose, onSave, citaId, nombreMascota, initialData }: Props) => {
  const [formData, setFormData] = useState<CreateDiagnosticoInput>({
    descripcion: "",
    tratamiento: "",
    medicamentos: "",
    observaciones: "",
    cita_id: citaId
  });

  // EFECTO CLAVE: Si hay initialData, cargamos los campos para editar
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        descripcion: initialData.descripcion || "",
        tratamiento: initialData.tratamiento || "",
        medicamentos: initialData.medicamentos || "",
        observaciones: initialData.observaciones || "",
        cita_id: initialData.cita_id || citaId
      });
    } else if (!initialData && isOpen) {
      // Si no hay datos (creación), limpiamos el form
      setFormData({ descripcion: "", tratamiento: "", medicamentos: "", observaciones: "", cita_id: citaId });
    }
  }, [initialData, isOpen, citaId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, cita_id: citaId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[30px] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-200">
        
       <header className="bg-azul-vet p-6 text-white flex justify-between items-center">
  <div>
    <h2 className="text-xl font-bold font-montserrat tracking-tight">
      {initialData ? 'Editar Atención' : 'Nueva Atención Médica'}
    </h2>
    <p className="text-blue-100/80 text-sm font-opensans">
      Paciente: <span className="font-bold text-white">{nombreMascota}</span>
    </p>
  </div>
  <button 
    onClick={onClose} 
    className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-95"
    title="Cerrar"
  >
    <X size={24} />
  </button>
</header>

        <form onSubmit={handleSubmit} className="p-8 space-y-4 font-opensans max-h-[70vh] overflow-y-auto">
          {/* ... Todos tus campos (Textareas e Inputs) se quedan igual ... */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
              <ClipboardList size={14} /> Diagnóstico / Hallazgos *
            </label>
            <textarea
              required
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-azul-vet outline-none min-h-[100px] text-sm"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Tratamiento Sugerido</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-azul-vet outline-none text-sm"
              value={formData.tratamiento}
              onChange={(e) => setFormData({...formData, tratamiento: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
              <Pill size={14} /> Medicamentos
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-azul-vet outline-none text-sm"
              value={formData.medicamentos}
              onChange={(e) => setFormData({...formData, medicamentos: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
              <MessageSquare size={14} /> Observaciones
            </label>
            <textarea
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-azul-vet outline-none text-sm"
              value={formData.observaciones}
              onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className={`w-full text-white py-4 rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-4 ${initialData ? 'bg-amber-500 shadow-amber-100' : 'bg-azul-vet'}`}
          >
            <Save size={20} /> {initialData ? 'Actualizar Cambios' : 'Guardar Diagnóstico'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiagnosticoFormModal;