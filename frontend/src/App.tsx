import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";

// Importamos los módulos (asegúrate de que las rutas sean correctas)
import Clientes from "./pages/modules/Clientes";
import Mascotas from "./pages/modules/Mascotas";
import Citas from "./pages/modules/Citas";
import Diagnosticos from "./pages/modules/Diagnosticos";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      {/* LOGIN PROTEGIDO */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* DASHBOARD PROTEGIDO CON RUTAS ANIDADAS */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* 1. Lo que se ve apenas entras a /dashboard */}
        <Route index element={
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-200 text-xl font-montserrat font-bold uppercase tracking-[10px] select-none text-center">
              Bienvenido
            </p>
          </div>
        } />

        {/* 2. Las sub-secciones que se cargarán en el <Outlet /> de Dashboard */}
        <Route path="clientes" element={<Clientes />} />
        <Route path="mascotas" element={<Mascotas />} />
        <Route path="citas" element={<Citas />} />
        <Route path="diagnosticos" element={<Diagnosticos />} />
      </Route>

      {/* Redirección por si escriben cualquier otra cosa */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;