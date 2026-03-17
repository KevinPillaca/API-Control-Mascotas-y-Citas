import Swal from "sweetalert2";

export const alertService = {
  // Plantilla para preguntar antes de eliminar
  confirmDelete: async (nombre: string = "este registro") => {
    return await Swal.fire({
      title: `¿Eliminar ${nombre}?`,
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981", // Tu Verde-vet
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  },

  // Plantilla para avisar que todo salió bien (Check verde)
  success: (mensaje: string, titulo: string = "¡Listo!") => {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  },
  // Plantilla para errores
  error: (mensaje: string) => {
    Swal.fire("Error", mensaje, "error");
  },
};
