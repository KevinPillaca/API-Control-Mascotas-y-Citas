import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/image/logo.png";
import { Users, Dog, Calendar, ClipboardList, LogOut } from "lucide-react";

import Clientes from "./modules/Clientes";
import Mascotas from "./modules/Mascotas";
import Citas from "./modules/Citas";
import Diagnosticos from "./modules/Diagnosticos";

const Dashboard = () => {
  const navigate = useNavigate(); // Inicializamos la navegación

  // 2. Definimos el estado de la sección. Empieza en null (nada marcado)
  const [seccion, setSeccion] = useState<string | null>(null);

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
          <div
            onClick={() => setSeccion(null)} 
            className="w-20 h-20 flex items-center justify-center transition-transform hover:scale-110 duration-300 cursor-pointer"
          >
            <img
              src={logo}
              alt="Logo Veterinaria"
              className="w-full h-auto drop-shadow-[0_0_12px_rgba(37,179,103,0.4)]"
            />
          </div>
        </div>

        {/* MENÚ DE SECCIONES (Clientes, Mascotas, Citas, Diagnósticos) */}
        <nav className="flex-1 w-full px-2 space-y-4">
          {/* BOTÓN CLIENTES*/}
          <button
            onClick={() => setSeccion("clientes")}
            className={`w-full flex flex-col items-center justify-center py-4 rounded-3xl transition-all group ${
              seccion === "clientes"
                ? "text-verde-vet bg-verde-vet/10 shadow-sm" // Si está seleccionado (Usa tu Verde-Vet)
                : "text-slate-400 hover:text-verde-vet hover:bg-slate-50" // Si no está seleccionado
            }`}
          >
            <Users
              size={24}
              strokeWidth={2}
              className="mb-1 group-hover:scale-110 transition-transform"
            />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Clientes
            </span>
          </button>

          {/* BOTÓN CITAS */}
          <button
            onClick={() => setSeccion("mascotas")}
            className={`w-full flex flex-col items-center justify-center py-4 rounded-3xl transition-all group ${
              seccion === "mascotas"
                ? "text-verde-vet bg-verde-vet/10 shadow-sm"
                : "text-slate-400 hover:text-verde-vet hover:bg-slate-50"
            }`}
          >
            <Dog
              size={24}
              strokeWidth={2}
              className="mb-1 group-hover:scale-110 transition-transform"
            />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Mascotas
            </span>
          </button>

          {/* BOTÓN CITAS */}
          <button
            onClick={() => setSeccion("citas")}
            className={`w-full flex flex-col items-center justify-center py-4 rounded-3xl transition-all group ${
              seccion === "citas"
                ? "text-verde-vet bg-verde-vet/10 shadow-sm"
                : "text-slate-400 hover:text-verde-vet hover:bg-slate-50"
            }`}
          >
            <Calendar
              size={24}
              strokeWidth={2}
              className="mb-1 group-hover:scale-110 transition-transform"
            />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Citas
            </span>
          </button>

          {/* BOTÓN DIAGNÓSTICOS */}
          <button
            onClick={() => setSeccion("diagnosticos")}
            className={`w-full flex flex-col items-center justify-center py-4 rounded-3xl transition-all group ${
              seccion === "diagnosticos"
                ? "text-verde-vet bg-verde-vet/10 shadow-sm"
                : "text-slate-400 hover:text-verde-vet hover:bg-slate-50"
            }`}
          >
            <ClipboardList
              size={24}
              strokeWidth={2}
              className="mb-1 group-hover:scale-110 transition-transform"
            />
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
        <div className="h-full w-full overflow-y-auto">
          {/* Pantalla por defecto (Cuando seccion es null) */}
          {!seccion && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-slate-200 text-xl font-montserrat font-bold uppercase tracking-[10px] select-none text-center">
                Bienvenido
              </p>
            </div>
          )}

          {/* Renderizado Condicional de Módulos */}
          {seccion === "clientes" && <Clientes />}
          {seccion === "mascotas" && <Mascotas />}
          {seccion === "citas" && <Citas />}
          {seccion === "diagnosticos" && <Diagnosticos />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
