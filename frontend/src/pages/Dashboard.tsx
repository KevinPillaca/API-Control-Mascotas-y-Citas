import { useNavigate, Outlet, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/image/logo.png";
import { Users, Dog, Calendar, ClipboardList, LogOut } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tendrás que ingresar tus credenciales nuevamente.",
      icon: "warning",
      iconColor: "#25b367",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        popup: "rounded-[40px] border-none shadow-2xl p-10",
        title: "text-azul-vet font-montserrat text-2xl font-bold",
        htmlContainer: "text-slate-500 font-opensans",
        confirmButton:
          "bg-verde-vet hover:opacity-90 text-white font-bold py-3 px-8 rounded-2xl ml-3 transition-all shadow-lg shadow-verde-vet/20",
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
      {/* 1. BARRA LATERAL */}
      <aside className="w-32 bg-white rounded-[40px] shadow-sm border border-slate-200 flex flex-col items-center py-10">
        <div className="mb-12 flex flex-col items-center justify-center">
          <NavLink
            to="/dashboard"
            className="w-20 h-20 flex items-center justify-center transition-transform hover:scale-110 duration-300"
          >
            <img
              src={logo}
              alt="Logo"
              className="w-full h-auto drop-shadow-[0_0_12px_rgba(37,179,103,0.4)]"
            />
          </NavLink>
        </div>

        <nav className="flex-1 w-full px-2 space-y-4">
          {/* USAMOS NAVLINK: Él solito sabe si está activo o no */}
          {[
            { to: "clientes", icon: <Users size={24} />, label: "Clientes" },
            { to: "mascotas", icon: <Dog size={24} />, label: "Mascotas" },
            { to: "citas", icon: <Calendar size={24} />, label: "Citas" },
            {
              to: "diagnosticos",
              icon: <ClipboardList size={24} />,
              label: "Diagnósticos",
            },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `w-full flex flex-col items-center justify-center py-4 rounded-3xl transition-all group ${
                  isActive
                    ? "text-verde-vet bg-verde-vet/10 shadow-sm"
                    : "text-slate-400 hover:text-verde-vet hover:bg-slate-50"
                }`
              }
            >
              <div className="group-hover:scale-110 transition-transform mb-1">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

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

      {/* 2. ÁREA DE CONTENIDO DINÁMICO */}
      <main className="flex-1 bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="h-full w-full overflow-y-auto">
          {/* AQUÍ ES DONDE APARECERÁN TUS MÓDULOS */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
