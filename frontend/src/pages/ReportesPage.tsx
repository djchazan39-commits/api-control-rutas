import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDatos } from "../context/DatosContext";

export default function ReportesPage() {
  const { usuarioActivo, datosApp, cerrarSesion } = useDatos();
  const [ver, setVer] = useState({ usuarios: true, operadores: true, unidades: true, clientes: true, rutas: true, combustible: true });

  if (!usuarioActivo) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-950 text-white p-6">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logotipo" className="mx-auto h-24 w-auto object-contain mb-2" />
        <h2 className="text-xl font-bold text-red-200">📊 Generar Reportes</h2>
      </div>

      <div className="max-w-4xl mx-auto bg-black/40 p-6 rounded-xl border border-red-500/30">
        <div className="flex flex-wrap gap-4 mb-6">
          {Object.entries(ver).map(([clave, valor]) => (
            <label key={clave} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={valor} onChange={e => setVer({...ver, [clave]: e.target.checked})}
                className="accent-red-500 h-4 w-4" />
              {clave.charAt(0).toUpperCase() + clave.slice(1)}
            </label>
          ))}
        </div>

        <div className="space-y-4">
          {ver.usuarios && (
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-bold mb-2">👤 Usuarios: {datosApp?.usuarios?.length || 0}</h3>
              {datosApp?.usuarios?.map((u: any) => <p key={u.id} className="text-sm text-gray-300">{u.nombre} — {u.rol}</p>)}
            </div>
          )}
          {ver.operadores && (
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-bold mb-2">👷 Operadores: {datosApp?.operadores?.length || 0}</h3>
              {datosApp?.operadores?.map((o: any) => <p key={o.id} className="text-sm text-gray-300">{o.nombre} — {o.licenciaClase || "Sin licencia"}</p>)}
            </div>
          )}
          {ver.unidades && (
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-bold mb-2">🚛 Unidades: {datosApp?.unidades?.length || 0}</h3>
              {datosApp?.unidades?.map((u: any) => <p key={u.id} className="text-sm text-gray-300">{u.placa} — {u.modelo}</p>)}
            </div>
          )}
          {ver.clientes && (
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-bold mb-2">🏢 Clientes: {datosApp?.clientes?.length || 0}</h3>
              {datosApp?.clientes?.map((c: any) => <p key={c.id} className="text-sm text-gray-300">{c.nombre}</p>)}
            </div>
          )}
          {ver.rutas && (
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-bold mb-2">📍 Rutas: {datosApp?.rutas?.length || 0}</h3>
              {datosApp?.rutas?.map((r: any) => <p key={r.id} className="text-sm text-gray-300">{r.nombre} — {r.zona || "Sin zona"}</p>)}
            </div>
          )}
          {ver.combustible && (
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-bold mb-2">⛽ Combustible: {datosApp?.combustible?.length || 0} registros</h3>
              <p className="text-sm text-gray-300">Total Litros: {datosApp?.combustible?.reduce((s:number,r:any) => s + (Number(r.litros)||0), 0).toFixed(2)} L</p>
              <p className="text-sm text-gray-300">Total Importe: ${datosApp?.combustible?.reduce((s:number,r:any) => s + (Number(r.importe)||0), 0).toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-8 space-x-4">
        <Link to="/dashboard" className="inline-block bg-gray-700/70 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold">← Volver al Menú</Link>
        <button onClick={cerrarSesion} className="bg-red-800/70 hover:bg-red-700 px-6 py-3 rounded-lg font-bold">🚪 Cerrar Sesión</button>
      </div>
    </div>
  );
}