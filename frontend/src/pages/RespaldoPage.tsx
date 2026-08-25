import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDatos } from "../context/DatosContext";

export default function RespaldoPage() {
  const { usuarioActivo, datosApp, cerrarSesion } = useDatos();

  if (!usuarioActivo || usuarioActivo.rol !== "administrador") {
    return <Navigate to="/dashboard" replace />;
  }

  function descargar() {
    const blob = new Blob([JSON.stringify(datosApp, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `respaldo-rutas-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-950 text-white p-6">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logotipo" className="mx-auto h-24 w-auto object-contain mb-2" />
        <h2 className="text-xl font-bold text-red-200">💾 Respaldo de Información</h2>
      </div>

      <div className="max-w-2xl mx-auto bg-black/40 p-6 rounded-xl border border-red-500/30 text-center">
        <p className="text-lg text-gray-300 mb-6">Crea una copia de seguridad con toda la información del sistema</p>
        <button onClick={descargar} className="px-8 py-4 bg-green-700 hover:bg-green-600 rounded-lg text-xl font-bold">⬇️ Descargar Respaldo</button>
        <div className="mt-6 text-left p-4 bg-white/5 rounded-lg">
          <p className="text-sm text-gray-400 mb-2">📋 Información incluida:</p>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>👤 {datosApp?.usuarios?.length || 0} Usuarios</li>
            <li>👷 {datosApp?.operadores?.length || 0} Operadores</li>
            <li>🚛 {datosApp?.unidades?.length || 0} Unidades</li>
            <li>🏢 {datosApp?.clientes?.length || 0} Clientes</li>
            <li>📍 {datosApp?.rutas?.length || 0} Rutas</li>
            <li>⛽ {datosApp?.combustible?.length || 0} Registros de combustible</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-8 space-x-4">
        <Link to="/dashboard" className="inline-block bg-gray-700/70 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold">← Volver al Menú</Link>
        <button onClick={cerrarSesion} className="bg-red-800/70 hover:bg-red-700 px-6 py-3 rounded-lg font-bold">🚪 Cerrar Sesión</button>
      </div>
    </div>
  );
}