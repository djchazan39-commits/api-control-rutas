import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useDatos } from "../context/DatosContext";

export default function MiRutaPage() {
  const { usuarioActivo, datosApp, cerrarSesion } = useDatos();
  const [rutaAsignada, setRutaAsignada] = useState<any>(null);

  if (!usuarioActivo) return <Navigate to="/" replace />;

  useEffect(() => {
    // ✅ TAL COMO LO TENÍAS — BUSCA LA RUTA DEL OPERADOR
    let ruta = datosApp.rutas.find((r: any) => String(r.operadorId) === String(usuarioActivo.id));
    if (!ruta && usuarioActivo.rol !== "operador") {
      ruta = datosApp.rutas[0];
    }
    setRutaAsignada(ruta || null);
  }, [datosApp.rutas, usuarioActivo]);

  const clientesOrdenados = rutaAsignada?.ordenClientes?.map((id: number) =>
    datosApp.clientes.find(c => c.id === id)
  ).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-gradient-to-t from-red-900 via-red-950 to-black p-6">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logotipo" className="mx-auto h-16 w-auto mb-2" />
        <h2 className="text-xl font-bold text-white">📋 Mi Ruta Asignada</h2>
      </div>

      <div className="max-w-3xl mx-auto bg-black/40 p-6 rounded-xl border border-red-500/30">
        {!rutaAsignada ? (
          <div className="text-center py-8">
            <p className="text-xl text-amber-300">⚠️ No tienes una ruta asignada aún</p>
            <p className="text-gray-400 mt-2">Consulta con el administrador para que te asignen una ruta.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <h3 className="text-xl font-bold text-white">{rutaAsignada.nombre}</h3>
              <p className="text-red-200">📍 Zona: {rutaAsignada.zona || "No especificada"}</p>
              <p className="text-gray-300 mt-1">
                👷 Operador: {datosApp.operadores.find(o => o.id === rutaAsignada.idOperador)?.nombre || "Desconocido"}
                {" | "}
                🚛 Unidad: {datosApp.unidades.find(u => u.id === rutaAsignada.idUnidad)?.placa || "Desconocida"}
              </p>
            </div>

            <h4 className="font-bold text-white mb-3">Orden de Recorrido — {clientesOrdenados.length} puntos de entrega</h4>

            {clientesOrdenados.length === 0 ? (
              <p className="text-gray-400">No hay clientes asignados a esta ruta.</p>
            ) : (
              <div className="space-y-2">
                {clientesOrdenados.map((cliente: any, i: number) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-white">{cliente.nombre}</p>
                      <p className="text-sm text-gray-400">{cliente.direccion || "Sin dirección registrada"}</p>
                      {cliente.lat && cliente.lon && (
                        <p className="text-xs text-green-400 mt-1">
                          📍 {Number(cliente.lat).toFixed(6)}, {Number(cliente.lon).toFixed(6)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="text-center mt-8 space-x-4">
        <Link to="/dashboard" className="inline-block bg-gray-700/70 hover:bg-gray-600 px-6 py-3 rounded-lg text-white font-bold">
          ← Volver al Menú Principal
        </Link>
        <button onClick={cerrarSesion} className="bg-red-800/70 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-bold">
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
}