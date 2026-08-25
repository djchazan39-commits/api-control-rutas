import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDatos } from "../context/DatosContext";

// ✅ LICENCIAS POR ESTADO
const LICENCIAS: Record<string, string[]> = {
  QUERETARO: ["A", "B", "Cc", "Co", "Ct", "D"],
  ESTADO_MEXICO: ["A", "B", "C"],
  CDMX: ["A", "B", "C", "D", "E", "E1", "A_PERMANENTE"],
  FEDERALES_SCT: ["A", "B", "C", "D", "E", "F"]
};

export default function OperadoresPage() {
  const { usuarioActivo, datosApp, setDatosApp, guardarCambios, cerrarSesion } = useDatos();
  const lista = datosApp?.operadores || [];
  const [form, setForm] = useState({ nombre: "", licenciaTipo: "QUERETARO", licenciaClase: "", licenciaVence: "", telefono: "" });
  const [editId, setEditId] = useState<number | null>(null);

  if (!usuarioActivo) return <Navigate to="/" replace />;

  const limpiar = () => {
    setForm({ nombre: "", licenciaTipo: "QUERETARO", licenciaClase: "", licenciaVence: "", telefono: "" });
    setEditId(null);
  };

  const guardar = () => {
    if (!form.nombre.trim()) return alert("⚠️ Escribe el nombre");
    if (editId) {
      setDatosApp({
        ...datosApp,
        operadores: lista.map(o => o.id === editId ? { ...o, ...form } : o)
      });
    } else {
      setDatosApp({ ...datosApp, operadores: [...lista, { id: Date.now(), ...form } as any] });
    }
    guardarCambios();
    limpiar();
    alert("✅ Operador guardado");
  };

  const editar = (o: any) => {
    setEditId(o.id);
    setForm({ nombre: o.nombre, licenciaTipo: o.licenciaTipo || "QUERETARO", licenciaClase: o.licenciaClase || "", licenciaVence: o.licenciaVence || "", telefono: o.telefono || "" });
  };

  const eliminar = (id: number) => {
    if (!confirm("¿Eliminar este operador?")) return;
    setDatosApp({ ...datosApp, operadores: lista.filter(o => o.id !== id) });
    guardarCambios();
  };

  const clasesDisponibles = LICENCIAS[form.licenciaTipo] || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-950 text-white p-6">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logotipo" className="mx-auto h-24 w-auto object-contain mb-2" />
        <h2 className="text-xl font-bold text-red-200">👷 Gestión de Operadores</h2>
      </div>

      <div className="max-w-4xl mx-auto bg-black/40 p-6 rounded-xl border border-red-500/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nombre Completo</label>
            <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" placeholder="Nombre del operador" autoFocus />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Tipo de Licencia</label>
            <select value={form.licenciaTipo} onChange={e => setForm({...form, licenciaTipo: e.target.value, licenciaClase: ""})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white">
              <option value="QUERETARO">Querétaro</option>
              <option value="ESTADO_MEXICO">Estado de México</option>
              <option value="CDMX">CDMX</option>
              <option value="FEDERALES_SCT">Federales SCT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Clase / Categoría</label>
            <select value={form.licenciaClase} onChange={e => setForm({...form, licenciaClase: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white">
              <option value="">Selecciona clase</option>
              {clasesDisponibles.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Vencimiento</label>
            <input type="date" value={form.licenciaVence} onChange={e => setForm({...form, licenciaVence: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">Teléfono</label>
            <input type="text" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" placeholder="Teléfono" />
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={guardar} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold">
            {editId ? "✏️ Actualizar" : "✅ Guardar"}
          </button>
          {editId && <button onClick={limpiar} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg">Cancelar</button>}
        </div>

        <h3 className="font-bold text-lg mb-3">Lista de Operadores ({lista.length})</h3>
        <div className="space-y-2">
          {lista.map(o => (
            <div key={o.id} className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
              <div>
                <p className="font-bold">{o.nombre}</p>
                <p className="text-sm text-gray-400">
                Licencia: {(o as any).licenciaTipo} — {(o as any).licenciaClase || "Sin clase"} | Vence: {(o as any).licenciaVence || "Sin fecha"}
                </p>
                {o.telefono && <p className="text-sm text-gray-400">📞 {o.telefono}</p>}
              </div>
              <div className="space-x-2">
                <button onClick={() => editar(o)} className="text-yellow-400">✏️ Editar</button>
                <button onClick={() => eliminar(o.id)} className="text-red-400">🗑️ Eliminar</button>
              </div>
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