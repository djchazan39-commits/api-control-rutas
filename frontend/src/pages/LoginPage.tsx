import { useState } from "react";
import { useDatos } from "../context/DatosContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { iniciarSesion } = useDatos();
  const navegar = useNavigate();
  const [credenciales, setCredenciales] = useState({ nick: "", pass: "" });
  const [error, setError] = useState("");

  const entrar = () => {
    setError("");
    if (!credenciales.nick.trim() || !credenciales.pass.trim()) {
      setError("⚠️ Escribe usuario y contraseña");
      return;
    }
    if (iniciarSesion(credenciales.nick, credenciales.pass)) {
      navegar("/bienvenida");
    } else {
      setError("❌ Usuario o contraseña incorrectos");
    }
  };

  const manejarEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") entrar();
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-red-900 via-red-950 to-black flex flex-col items-center justify-center p-6">
      {/* LOGO */}
      <div className="text-center mb-8">
        <img src="/logo.png" alt="Logotipo de la Empresa" className="mx-auto h-28 w-auto object-contain mb-3" />
        <h1 className="text-2xl font-bold text-white">Sistema de Control de Rutas</h1>
        <p className="text-red-200">Grupo Sierra Querétaro</p>
      </div>

      {/* FORMULARIO */}
      <div className="w-full max-w-md bg-black/40 p-6 rounded-xl border border-red-500/30">
        <h2 className="text-xl font-bold text-center text-white mb-6">Iniciar Sesión</h2>

        {error && <p className="text-amber-300 text-center mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Usuario</label>
            <input
              id="campo_usuario"
              type="text"
              value={credenciales.nick}
              onChange={(e) => setCredenciales({ ...credenciales, nick: e.target.value })}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  document.getElementById("campo_clave")?.focus();
                }
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Escribe tu usuario"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Contraseña</label>
            <input
              id="campo_clave"
              type="password"
              value={credenciales.pass}
              onChange={(e) => setCredenciales({ ...credenciales, pass: e.target.value })}
              onKeyDown={manejarEnter}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Escribe tu contraseña"
            />
          </div>

          <button
            onClick={entrar}
            className="w-full py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
          >
            ✅ Ingresar
          </button>
        </div>
      </div>
    </div>
  );
}