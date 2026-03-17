import { useState, useEffect } from "react"; // 1. Añadimos useEffect
import { X, Save } from "lucide-react";
import { clienteService } from "../../services/clientes.service";
import type { Cliente } from "../../interfaces/clientes"; // Importamos el tipo
import { alertService } from "../../utils/alerts";
import { useClienteStore } from "../../store/useCliente";

// Definición de las propiedades que recibe el Modal desde el componente Padre
interface ClienteModalProps {
  isOpen: boolean; // Controla si el modal se muestra o se oculta
  onClose: () => void; // Función para cerrar el modal
  onRefresh: () => void; // Función para recargar la tabla después de un cambio
  clienteEdit?: Cliente | null; // Datos del cliente si estamos en modo edición
}

const ClienteModal = ({
  isOpen,
  onClose,
  onRefresh,
  clienteEdit,
}: ClienteModalProps) => {
  // --- CAMBIO AQUÍ: Traemos updateClienteInStore del store ---
  const { addClienteToStore, updateClienteInStore } = useClienteStore();

  // Estado local para controlar los valores de los campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  // Sincronizar formulario: Si hay un cliente para editar, llena los campos; si no, los limpia
  useEffect(() => {
    if (clienteEdit) {
      setFormData({
        nombre: clienteEdit.nombre,
        telefono: clienteEdit.telefono,
        email: clienteEdit.email,
        direccion: clienteEdit.direccion,
      });
    } else {
      setFormData({ nombre: "", telefono: "", email: "", direccion: "" });
    }
  }, [clienteEdit, isOpen]);

  // Manejador de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Acción principal: Crear (POST) o Actualizar (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (clienteEdit && clienteEdit.id) {
        // 1. Actualizamos en la base de datos
        // Capturamos el cliente actualizado ---
        const actualizado = await clienteService.update(
          clienteEdit.id,
          formData as any,
        );

        // 2. Sincronizamos la "pizarra" global (Store) con los nuevos datos
        // Usamos la función específica del store ---
        updateClienteInStore(actualizado);

        alertService.success(
          "Se actualizó cliente correctamente.",
          "¡Actualizado!",
        );
      } else {
        // 1. Guardamos y CAPTURAMOS lo que nos responde el servidor
        const nuevoCliente = await clienteService.create(formData as any);

        // 2. Pasamos ese nuevo cliente al Store para que Mascotas lo vea
        addClienteToStore(nuevoCliente);

        alertService.success(
          "Se registró cliente correctamente.",
          "¡Guardado!",
        );
      }

      onRefresh(); // Tu función original para la tabla local
      onClose(); // Tu función original para cerrar
    } catch (error) {
      console.error("Error en el submit:", error);
      alertService.error("No se pudo procesar la solicitud");
    }
  };

  // Si el modal está cerrado, no renderiza nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-azul-vet/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            {/* Título dinámico */}
            <h2 className="text-2xl font-bold text-azul-vet font-montserrat">
              {clienteEdit ? "Editar Cliente" : "Nuevo Cliente"}
            </h2>
            <p className="text-slate-400 text-sm font-opensans">
              {clienteEdit
                ? "Modifica los datos del propietario"
                : "Registro de propietario"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4 font-opensans">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">
              Nombre Completo
            </label>
            <input
              required
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              type="text"
              placeholder="Ej. Juan Pérez"
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-verde-vet focus:ring-4 focus:ring-verde-vet/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                Teléfono
              </label>
              <input
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                type="tel"
                placeholder="999..."
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-verde-vet focus:ring-4 focus:ring-verde-vet/10 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="cliente@gmail.com"
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-verde-vet focus:ring-4 focus:ring-verde-vet/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">
              Dirección
            </label>
            <input
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              type="text"
              placeholder="Av. Principal 123"
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-verde-vet focus:ring-4 focus:ring-verde-vet/10 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-4 rounded-2xl font-bold text-white bg-verde-vet shadow-lg shadow-verde-vet/30 hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {clienteEdit ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteModal;
