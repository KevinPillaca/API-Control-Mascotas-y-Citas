import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/image/logo.png";
import { Users, Dog, Calendar, ClipboardList, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate(); // Inicializamos la navegación

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tendrás que ingresar tus credenciales nuevamente.",
      icon: "warning",
      iconColor: "#25b367", // Usamos tu Verde-Vet para el icono
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        popup: "rounded-[40px] border-none shadow-2xl p-10", // Redondeado como tu menú
        title: "text-azul-vet font-montserrat text-2xl font-bold", // Tu Azul-Vet
        htmlContainer: "text-slate-500 font-opensans",
        // Botón Salir con tu Verde-Vet
        confirmButton:
          "bg-verde-vet hover:opacity-90 text-white font-bold py-3 px-8 rounded-2xl ml-3 transition-all shadow-lg shadow-verde-vet/20",
        // Botón Cancelar discreto
        cancelButton:
          "bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-3 px-8 rounded-2xl transition-all",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    });
  };

  return (
    <div className="flex h-screen bg-slate-100 p-6 gap-6 font-opensans">
      {/* 1. BARRA LATERAL (Menú Flotante y Redondeado) */}
      <aside className="w-32 bg-white rounded-[40px] shadow-sm border border-slate-200 flex flex-col items-center py-10">
        {/* LOGO de la Veterinaria */}
        <div className="mb-12 flex flex-col items-center justify-center">
          <div className="w-20 h-20 flex items-center justify-center transition-transform hover:scale-105 duration-300">
            <img
              src={logo}
              alt="Logo Veterinaria"
              className="w-full h-auto drop-shadow-[0_0_12px_rgba(37,179,103,0.4)]"
            />
          </div>
        </div>

        {/* MENÚ DE SECCIONES (Clientes, Mascotas, Citas, Diagnósticos) */}
        <nav className="flex-1 w-full px-2 space-y-4">
          <button className="w-full flex flex-col items-center justify-center py-4 rounded-3xl text-indigo-600 bg-indigo-50 transition-all shadow-sm">
            <Users size={24} strokeWidth={2} className="mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Clientes
            </span>
          </button>

          <button className="w-full flex flex-col items-center justify-center py-4 rounded-3xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all">
            <Dog size={24} strokeWidth={2} className="mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Mascotas
            </span>
          </button>

          <button className="w-full flex flex-col items-center justify-center py-4 rounded-3xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all">
            <Calendar size={24} strokeWidth={2} className="mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Citas
            </span>
          </button>

          <button className="w-full flex flex-col items-center justify-center py-4 rounded-3xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all">
            <ClipboardList size={24} strokeWidth={2} className="mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Diagnósticos
            </span>
          </button>
        </nav>

        {/* BOTÓN CERRAR SESIÓN (Al final) */}
        <button
          onClick={handleLogout}
          className="w-full flex flex-col items-center justify-center py-6 rounded-3xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all mt-auto group"
        >
          <LogOut size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Salir
          </span>
        </button>
      </aside>

      {/* 2. ÁREA DE CONTENIDO (Derecha - En blanco por ahora) */}
      <main className="flex-1 bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden relative">
        {/* Este espacio queda limpio para los módulos que vendrán */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-slate-200 text-xl font-montserrat font-bold uppercase tracking-[10px] select-none">
            Bienvenido
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
