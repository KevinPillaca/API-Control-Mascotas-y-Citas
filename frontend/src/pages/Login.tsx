import React, { useState, useEffect } from "react";
import { loginUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import fondoVeterinaria from "../assets/image/veterinaria_fondo.jpg";
import logo from "../assets/image/logo.png";

const Login = () => {
  // 1. Declaramos los estados (esto ya lo tienes)
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 2. INICIALIZAMOS EL NAVEGADOR (Esto es lo que te falta)
  const navigate = useNavigate();
  
  //segurida login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Si ya hay llave, lo mandamos al dashboard de una
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // 3. Ahora la lógica ya puede usar "navigate"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser({ usuario, password });
      localStorage.setItem("token", data.token);

      // ¡Ahora sí funcionará!
      navigate("/dashboard");
    } catch (err: any) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-opensans bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.42), rgba(37, 179, 103, 0.61)), url(${fondoVeterinaria})`,
      }}
    >
      {/* Este contenedor alinea el logo y el form uno encima del otro */}
      <div className="flex flex-col items-center w-full max-w-md">
        {/* LOGO: Ubicado afuera del recuadro */}
        <div className="mb-6">
          <img
            src={logo}
            alt="Logo Veterinaria"
            className="h-[220px] w-auto"
            style={{
              filter:
                "drop-shadow(0 0 15px white) drop-shadow(0 0 30px white) drop-shadow(0 0 50px rgba(255,255,255,0.5))",
            }}
          />
        </div>

        {/* RECUADRO DEL FORMULARIO */}
        <div className="bg-slate-800/20 p-8 rounded-xl shadow-2xl w-full border border-white/10 backdrop-blur-md">
          <h2 className="text-3xl font-montserrat font-bold text-white text-center mb-8">
            Iniciar Sesión
          </h2>

          {error && (
            <p className="bg-red-500/20 text-red-400 p-2 rounded mb-4 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-white block mb-2">Usuario</label>
              <input
                type="text"
                className="w-full bg-slate-700/50 border border-slate-600 p-3 rounded text-white focus:outline-none focus:border-cyan-400 transition-colors"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-white block mb-2">Contraseña</label>
              <input
                type="password"
                className="w-full bg-slate-700/50 border border-slate-600 p-3 rounded text-white focus:outline-none focus:border-cyan-400 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-verde-vet hover:bg-verde-vet/60 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02]"
            >
              INGRESAR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
