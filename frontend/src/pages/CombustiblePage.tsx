import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDatos } from "../context/DatosContext";


export default function CombustiblePage() {
  const { usuarioActivo, datosApp, setDatosApp, guardarCambios, cerrarSesion } = useDatos();
  const lista = datosApp?.combustible || [];
  const [form, setForm] = useState({ 
    fecha: "", unidadId: "", kmInicial: "", kmFinal: "", 
    litros: "", importe: "", rendimiento: "", registradoPor: "" 
  });


  if (!usuarioActivo) return <Navigate to="/" replace />;


  const guardar = () => {
    if (!form.fecha || !form.litros || !form.importe) 
      return alert("⚠️ Fecha, Litros e Importe son obligatorios");
    
    const nuevo = {
      id: Date.now(),
      ...form,
      fechaHora: new Date().toLocaleString()
    };
    
    setDatosApp({ 
      ...datosApp, 
      combustible: [...lista, nuevo] as any  // ✅ Agregado "as any"
    });
    guardarCambios();
    setForm({ 
      fecha: "", unidadId: "", kmInicial: "", kmFinal: "", 
      litros: "", importe: "", rendimiento: "", registradoPor: "" 
    });
    alert("✅ Registro guardado");
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-950 text-white p-6">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logotipo" className="mx-auto h-24 w-auto object-contain mb-2" />
        <h2 className="text-xl font-bold text-red-200">⛽ Registro de Combustible</h2>
      </div>


      <div className="max-w-4xl mx-auto bg-black/40 p-6 rounded-xl border border-red-500/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Fecha</label>
            <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" autoFocus />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Unidad</label>
            <select value={form.unidadId} onChange={e => setForm({...form, unidadId: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white">
              <option value="">Selecciona unidad</option>
              {datosApp?.unidades?.map((u: any) => (
                <option key={u.id} value={u.id}>{u.placa} — {u.modelo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Km Inicial</label>
            <input type="number" value={form.kmInicial} onChange={e => setForm({...form, kmInicial: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Km Final</label>
            <input type="number" value={form.kmFinal} onChange={e => setForm({...form, kmFinal: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Litros</label>
            <input type="number" step="0.01" value={form.litros} onChange={e => setForm({...form, litros: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Importe ($)</label>
            <input type="number" step="0.01" value={form.importe} onChange={e => setForm({...form, importe: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" placeholder="0.00" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">Registrado por</label>
            <input type="text" value={form.registradoPor} onChange={e => setForm({...form, registradoPor: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" placeholder="Tu nombre" />
          </div>
        </div>


        <button onClick={guardar} className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold mb-6">✅ Guardar Registro</button>


        <h3 className="font-bold text-lg mb-3">Historial ({lista.length} registros)</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {lista.slice().reverse().map((r: any) => (
            <div key={r.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="font-bold">{r.fecha} | {r.litros} L | ${r.importe}</p>
              <p className="text-sm text-gray-400">Km: {r.kmInicial} → {r.kmFinal} | {r.registradoPor || "Sin nombre"}</p>
            </div>
          ))}
        </div>
      </div>


      <div className="text-center mt-8 space-x-4">
        <Link to="/dashboard" className="inline-block bg-gray-700/70 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold">← Volver al Menú</Link>
        <button onClick={cerrarSesion} className="bg-red-800/70 hover:bg-red-700 px-6 py-3 rounded-lg font-bold">🚪 Cerrar Sesión</button>
      </div>
    </div>
  );
}