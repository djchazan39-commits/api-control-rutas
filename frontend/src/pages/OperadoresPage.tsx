import { useState } from 'react';
import { useDatos } from '../../context/DatosContext';
import { Operador } from '../../types';

export default function OperadoresPage() {
  const { datos, setDatos, guardarCambios } = useDatos();
  const [form, setForm] = useState<Partial<Operador>>({ nombre: '', licencia: '', vencimiento: '', telefono: '' });
  const [editId, setEditId] = useState<number | null>(null);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre) return alert('Escribe el nombre');
    if (editId) {
      setDatos(prev => ({ ...prev, operadores: prev.operadores.map(o => o.id === editId ? { ...o, ...form } as Operador : o) }));
    } else {
      setDatos(prev => ({ ...prev, operadores: [...prev.operadores, { ...form, id: Date.now() } as Operador] }));
    }
    await guardarCambios();
    setForm({ nombre: '', licencia: '', vencimiento: '', telefono: '' });
    setEditId(null);
  }

  function editar(o: Operador) { setForm(o); setEditId(o.id); }
  async function eliminar(id: number) {
    if (!confirm('¿Eliminar?')) return;
    setDatos(prev => ({ ...prev, operadores: prev.operadores.filter(o => o.id !== id) }));
    await guardarCambios();
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-red-200 mb-4">👷 Operadores</h2>
      <form onSubmit={guardar} className="space-y-3 mb-6">
        <input placeholder="Nombre completo" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full p-3 rounded-lg bg-black border border-red-800" />
        <input placeholder="Tipo de licencia" value={form.licencia} onChange={e => setForm({ ...form, licencia: e.target.value })} className="w-full p-3 rounded-lg bg-black border border-red-800" />
        <input type="date" value={form.vencimiento} onChange={e => setForm({ ...form, vencimiento: e.target.value })} className="w-full p-3 rounded-lg bg-black border border-red-800" />
        <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="w-full p-3 rounded-lg bg-black border border-red-800" />
        <button type="submit" className="bg-green-700 hover:bg-green-600 px-6 py-2 rounded-lg font-bold">✅ Guardar</button>
      </form>
      <table className="w-full text-sm">
        <thead className="bg-red-900/40"><tr><th className="p-2 text-left">Nombre</th><th>Licencia</th><th>Vence</th><th>Teléfono</th><th>Acciones</th></tr></thead>
        <tbody>
          {datos.operadores.map(o => (
            <tr key={o.id} className="border-t border-red-900/30">
              <td className="p-2">{o.nombre}</td><td>{o.licencia || '—'}</td>
              <td>{o.vencimiento ? new Date(o.vencimiento).toLocaleDateString('es-MX') : '—'}</td>
              <td>{o.telefono || '—'}</td>
              <td><button onClick={() => editar(o)} className="text-blue-400 mr-2">✏️</button><button onClick={() => eliminar(o.id)} className="text-red-400">🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}