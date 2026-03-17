import { useState, useEffect } from "react";
import { X, Save, Dog } from "lucide-react";
import { mascotaService } from "../../services/mascotas.service";
import { useClienteStore } from "../../store/useCliente";
import type { Mascota } from "../../interfaces/mascotas";
import { alertService } from "../../utils/alerts";

interface MascotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  mascotaEdit?: Mascota | null;
}

const MascotaModal = ({
  isOpen,
  onClose,
  onRefresh,
  mascotaEdit,
}: MascotaModalProps) => {
  const { clientes } = useClienteStore();

  const [formData, setFormData] = useState({
    nombre: "",
    especie: "Perro",
    raza: "",
    edad: "",
    peso: "",
    cliente_id: "", // Mantenemos el estándar de la DB
  });

  useEffect(() => {
    if (mascotaEdit) {
      setFormData({
        nombre: mascotaEdit.nombre,
        especie: mascotaEdit.especie,
        raza: mascotaEdit.raza || "",
        edad: mascotaEdit.edad?.toString() || "",
        peso: mascotaEdit.peso?.toString() || "",
        cliente_id: mascotaEdit.cliente_id?.toString() || "",
      });
    } else {
      setFormData({
        nombre: "",
        especie: "Perro",
        raza: "",
        edad: "",
        peso: "",
        cliente_id: "",
      });
    }
  }, [mascotaEdit, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de seguridad
    if (!formData.cliente_id) {
      alertService.error("Por favor, selecciona un propietario");
      return;
    }

    try {
      if (mascotaEdit?.id) {
        await mascotaService.update(mascotaEdit.id, formData as any);
        alertService.success("Datos del paciente actualizados");
      } else {
        await mascotaService.create(formData as any);
        alertService.success("Paciente registrado correctamente");
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error en submit:", error);
      alertService.error("No se pudo guardar la mascota");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-azul-vet/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300 font-opensans">
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-verde-vet/10 rounded-2xl flex items-center justify-center text-verde-vet">
              <Dog size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-azul-vet font-montserrat">
                {mascotaEdit ? "Editar Paciente" : "Nuevo Paciente"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                Nombre
              </label>
              <input
                required
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                type="text"
                placeholder="Ej. Fido"
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-verde-vet transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                Especie
              </label>
              <select
                name="especie"
                value={formData.especie}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-verde-vet transition-all bg-white"
              >
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                Raza
              </label>
              <input
                name="raza"
                value={formData.raza}
                onChange={handleChange}
                type="text"
                placeholder="Ej. Golden"
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-verde-vet transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                  Edad
                </label>
                <input
                  name="edad"
                  value={formData.edad}
                  onChange={handleChange}
                  type="number"
                  placeholder="Años"
                  className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-verde-vet transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                  Peso (kg)
                </label>
                <input
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  type="number"
                  step="0.1"
                  placeholder="Kg"
                  className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-verde-vet transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">
              Propietario
            </label>
            <select
              required
              name="cliente_id" // <--- CORREGIDO: Antes decía clienteId
              value={formData.cliente_id}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-azul-vet transition-all bg-white font-semibold text-azul-vet"
            >
              <option value="">-- Seleccionar dueño --</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-4 rounded-2xl font-bold text-white bg-verde-vet shadow-lg shadow-verde-vet/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Save size={20} />
              {mascotaEdit ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MascotaModal;
