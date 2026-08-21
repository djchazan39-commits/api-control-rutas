import { useState } from 'react';
import { Cliente } from "../types";
import { useDatos } from "../context/DatosContext";


export default function ClientesPage() {
  const { datos, guardarCambios, setDatos } = useDatos();
  const [form, setForm] = useState<Partial<Cliente>>({ nombre: '', direccion: '', lat: 0, lon: 0 });
  const [editId, setEditId] = useState<number | null>(null);


  function obtenerGPS() {
    if (!navigator.geolocation) return alert('GPS no disponible');
    navigator.geolocation.getCurrentPosition(pos => {
      setForm(prev => ({ ...prev, lat: pos.coords.latitude, lon: pos.coords.longitude }));
    });
  }


  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre) return alert('Escribe el nombre');
    if (editId) {
      setDatos(prev => ({ ...prev, clientes: prev.clientes.map((c: Cliente) => c.id === editId ? { ...c, ...form } as Cliente : c) }));
    } else {
      setDatos(prev => ({ ...prev, clientes: [...prev.clientes, { ...form, id: Date.now() } as Cliente] }));
    }
    await guardarCambios();
    setForm({ nombre: '', direccion: '', lat: 0, lon: 0 });
    setEditId(null);
  }


  function editar(c: Cliente) { setForm(c); setEditId(c.id); }
  async function eliminar(id: number) {
    if (!confirm('¿Eliminar?')) return;
    setDatos(prev => ({ ...prev, clientes: prev.clientes.filter((c: Cliente) => c.id !== id) }));
    await guardarCambios();
  }


  return (
    <div>
      <h2 className="text-xl font-bold text-red-200 mb-4">🏢 Clientes</h2>
      <form onSubmit={guardar} className="space-y-3 mb-6">
        <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full p-3 rounded-lg bg-black border border-red-800" />
        <input placeholder="Dirección" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} className="w-full p-3 rounded-lg bg-black border border-red-800" />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Latitud" value={form.lat || ''} onChange={e => setForm({ ...form, lat: Number(e.target.value) })} className="p-3 rounded-lg bg-black border border-red-800" />
          <input placeholder="Longitud" value={form.lon || ''} onChange={e => setForm({ ...form, lon: Number(e.target.value) })} className="p-3 rounded-lg bg-black border border-red-800" />
        </div>
        <button type="button" onClick={obtenerGPS} className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg">📍 Obtener GPS</button>
        <button type="submit" className="bg-green-700 hover:bg-green-600 px-6 py-2 rounded-lg font-bold ml-2">✅ Guardar</button>
      </form>
      <table className="w-full text-sm">
        <thead className="bg-red-900/40"><tr><th className="p-2 text-left">Nombre</th><th>Dirección</th><th>Coordenadas</th><th>Acciones</th></tr></thead>
        <tbody>
          {datos.clientes.map((c: Cliente) => (
            <tr key={c.id} className="border-t border-red-900/30">
              <td className="p-2">{c.nombre}</td><td>{c.direccion || '—'}</td>
              <td>{c.lat && c.lon ? `${c.lat.toFixed(4)}, ${c.lon.toFixed(4)}` : '—'}</td>
              <td><button onClick={() => editar(c)} className="text-blue-400 mr-2">✏️</button><button onClick={() => eliminar(c.id)} className="text-red-400">🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}