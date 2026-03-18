import { useState, useEffect } from "react";
import { X, Calendar, FileText, Dog, Clock, Activity } from "lucide-react";
import type { Mascota } from "../../interfaces/mascotas";
import type { CreateCitaInput, Cita } from "../../interfaces/citas";
import { alertService } from "../../utils/alerts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mascotas: Mascota[];
  onSave: (data: CreateCitaInput) => void;
  citaAEditar?: Cita;
}

const CitasModal = ({ isOpen, onClose, mascotas, onSave, citaAEditar }: Props) => {
  const [formData, setFormData] = useState<CreateCitaInput>({
    fecha: "",
    motivo: "",
    mascota_id: 0,
    estado: "pendiente",
  });

  // LOGICA DE AUTO-RELLENADO: Este useEffect escucha si el modal se abre y si hay datos para editar
  useEffect(() => {
    if (isOpen) {
      if (citaAEditar) {
        // Si estamos editando, formateamos la fecha de la BD para el input y llenamos el estado
        const fechaFormateada = new Date(citaAEditar.fecha).toISOString().slice(0, 16);
        setFormData({
          fecha: fechaFormateada,
          motivo: citaAEditar.motivo,
          mascota_id: citaAEditar.mascota_id,
          estado: citaAEditar.estado,
        });
      } else {
        // Si es una cita nueva, reseteamos el formulario a valores vacíos
        setFormData({
          fecha: "",
          motivo: "",
          mascota_id: 0,
          estado: "pendiente",
        });
      }
    }
  }, [isOpen, citaAEditar]);

  if (!isOpen) return null;

  // LOGICA DE ENVÍO: Valida los campos y envía el objeto completo al componente Padre (Citas.tsx)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.mascota_id === 0) {
      alertService.error("Por favor, selecciona una mascota válida.");
      return;
    }
    onSave(formData); // Ejecuta la función handleSaveCita definida en el padre
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <section className="bg-white w-full max-w-lg rounded-[30px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        <header className="bg-azul-vet p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Calendar size={24} />
            <h2 className="text-xl font-bold font-montserrat">
              {citaAEditar ? "Editar Cita" : "Programar Cita"}
            </h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <fieldset className="space-y-2 border-none p-0">
            <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
              <Dog size={16} /> Seleccionar Paciente
            </label>
            <select
              required
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none bg-slate-50 focus:border-azul-vet transition-all cursor-pointer"
              value={formData.mascota_id}
              onChange={(e) => setFormData({ ...formData, mascota_id: Number(e.target.value) })}
            >
              <option value="">¿Quién viene a consulta?</option>
              {mascotas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} ({m.clientes?.nombre})
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset className="space-y-2 border-none p-0">
            <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
              <Clock size={16} /> Fecha y Hora
            </label>
            <input
              required
              type="datetime-local"
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-azul-vet transition-all"
              value={formData.fecha as string}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            />
          </fieldset>

          {citaAEditar && (
            <fieldset className="space-y-2 border-none p-0">
              <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
                <Activity size={16} /> Estado de la Cita
              </label>
              <select
                className="w-full p-4 rounded-2xl border border-slate-200 outline-none bg-slate-50 focus:border-azul-vet transition-all cursor-pointer"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
              >
                <option value="pendiente">Pendiente</option>
                <option value="atendida">Atendida</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </fieldset>
          )}

          <fieldset className="space-y-2 border-none p-0">
            <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
              <FileText size={16} /> Motivo de la consulta
            </label>
            <textarea
              required
              placeholder="Ej: Vacunación anual..."
              rows={3}
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none resize-none focus:border-azul-vet transition-all"
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            />
          </fieldset>

          <footer className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-4 rounded-2xl font-bold bg-verde-vet text-white shadow-lg hover:brightness-110 active:scale-95 transition-all">
              {citaAEditar ? "Actualizar Cita" : "Guardar Cita"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default CitasModal;