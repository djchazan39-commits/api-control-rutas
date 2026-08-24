import { useState } from "react";
import { useNavigate } from "react-router-dom";
// ✅ SIN .tsx al final — ESTA ES LA ÚNICA LÍNEA QUE CAMBIA
import { useDatos } from "../context/DatosContext";

export default function LoginPage() {
  const navegar = useNavigate();
  const { iniciarSesion } = useDatos();
  const [credenciales, setCredenciales] = useState({ nick: "", pass: "" });
  const [error, setError] = useState("");

  const manejarEntrar = () => {
    if (iniciarSesion(credenciales.nick, credenciales.pass)) {
      navegar("/bienvenida");
    } else {
      setError("⚠️ Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950 to-red-900 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Grupo Sierra</h1>
      <div className="w-full max-w-sm bg-black/50 p-6 rounded-lg border border-white/20">
        <h2 className="text-xl text-white mb-6 text-center">Iniciar Sesión</h2>
        
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Usuario</label>
            <input
              type="text"
              value={credenciales.nick}
              onChange={(e) => setCredenciales({ ...credenciales, nick: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && document.getElementById("campo_pass")?.focus()}
              className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white"
              placeholder="Escribe tu usuario"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Contraseña</label>
            <input
              id="campo_pass"
              type="password"
              value={credenciales.pass}
              onChange={(e) => setCredenciales({ ...credenciales, pass: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && manejarEntrar()}
              className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white"
              placeholder="Escribe tu contraseña"
            />
          </div>
          
          <button
            onClick={manejarEntrar}
            className="w-full py-2 bg-green-600 hover:bg-green-700 rounded font-medium text-white mt-2"
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
}