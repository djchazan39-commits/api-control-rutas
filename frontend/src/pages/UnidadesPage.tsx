import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDatos } from "../context/DatosContext";

export default function UnidadesPage() {
  const { usuarioActivo, datosApp, setDatosApp, guardarCambios, cerrarSesion } = useDatos();
  const lista = datosApp?.unidades || [];
  const [form, setForm] = useState({ placa: "", marca: "", modelo: "", capacidad: "" });
  const [editId, setEditId] = useState<number | null>(null);

  if (!usuarioActivo) return <Navigate to="/" replace />;

  const limpiar = () => {
    setForm({ placa: "", marca: "", modelo: "", capacidad: "" });
    setEditId(null);
  };

  const guardar = () => {
    if (!form.placa.trim() || !form.modelo.trim()) return alert("⚠️ Placa y Modelo son obligatorios");
    if (editId) {
      setDatosApp({
        ...datosApp,
        unidades: lista.map(u => u.id === editId ? { ...u, ...form } : u)
      });
    } else {
      setDatosApp({ ...datosApp, unidades: [...lista, { id: Date.now(), ...form }] });
    }
    guardarCambios();
    limpiar();
    alert("✅ Unidad guardada");
  };

  const editar = (u: any) => {
    setEditId(u.id);
    setForm({ placa: u.placa, marca: u.marca, modelo: u.modelo, capacidad: u.capacidad });
  };

  const eliminar = (id: number) => {
    if (!confirm("¿Eliminar esta unidad?")) return;
    setDatosApp({ ...datosApp, unidades: lista.filter(u => u.id !== id) });
    guardarCambios();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-950 text-white p-6">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logotipo" className="mx-auto h-24 w-auto object-contain mb-2" />
        <h2 className="text-xl font-bold text-red-200">🚛 Gestión de Unidades</h2>
      </div>

      <div className="max-w-4xl mx-auto bg-black/40 p-6 rounded-xl border border-red-500/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Placa / Matrícula *</label>
            <input type="text" value={form.placa} onChange={e => setForm({...form, placa: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" placeholder="Placa" autoFocus />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Marca</label>
            <input type="text" value={form.marca} onChange={e => setForm({...form, marca: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" placeholder="Marca" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Modelo *</label>
            <input type="text" value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" placeholder="Modelo" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Capacidad / Toneladas</label>
            <input type="text" value={form.capacidad} onChange={e => setForm({...form, capacidad: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" placeholder="Capacidad" />
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={guardar} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold">
            {editId ? "✏️ Actualizar" : "✅ Guardar"}
          </button>
          {editId && <button onClick={limpiar} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg">Cancelar</button>}
        </div>

        <h3 className="font-bold text-lg mb-3">Lista de Unidades ({lista.length})</h3>
        <div className="space-y-2">
          {lista.map(u => (
            <div key={u.id} className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
              <div>
                <p className="font-bold">{(u as any).placa} — {(u as any).marca} {(u as any).modelo}</p>
{(u as any).capacidad && <p className="text-sm text-gray-400">Capacidad: {(u as any).capacidad}</p>}
              </div>
              <div className="space-x-2">
                <button onClick={() => editar(u)} className="text-yellow-400">✏️ Editar</button>
                <button onClick={() => eliminar(u.id)} className="text-red-400">🗑️ Eliminar</button>
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