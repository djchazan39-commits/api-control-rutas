import { useState } from 'react';
import { useDatos } from '../../context/DatosContext';
import { Unidad } from '../../types';

export default function UnidadesPage() {
  const { datos, guardarCambios, setDatos } = useDatos();
  const [form, setForm] = useState<Partial<Unidad>>({ placa: '', modelo: '' });
  const [editId, setEditId] = useState<number | null>(null);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.placa || !form.modelo) return alert('Completa todos los campos');
    if (editId) {
      setDatos(prev => ({ ...prev, unidades: prev.unidades.map(u => u.id === editId ? { ...u, ...form } as Unidad : u) }));
    } else {
      setDatos(prev => ({ ...prev, unidades: [...prev.unidades, { ...form, id: Date.now() } as Unidad] }));
    }
    await guardarCambios();
    setForm({ placa: '', modelo: '' });
    setEditId(null);
  }

  function editar(u: Unidad) { setForm(u); setEditId(u.id); }
  async function eliminar(id: number) {
    if (!confirm('¿Eliminar?')) return;
    setDatos(prev => ({ ...prev, unidades: prev.unidades.filter(u => u.id !== id) }));
    await guardarCambios();
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-red-200 mb-4">🚛 Unidades</h2>
      <form onSubmit={guardar} className="space-y-3 mb-6">
        <input placeholder="Placa" value={form.placa} onChange={e => setForm({ ...form, placa: e.target.value })} className="w-full p-3 rounded-lg bg-black border border-red-800" />
        <input placeholder="Marca y Modelo" value={form.modelo} onChange={e => setForm({ ...form, modelo: e.target.value })} className="w-full p-3 rounded-lg bg-black border border-red-800" />
        <button type="submit" className="bg-green-700 hover:bg-green-600 px-6 py-2 rounded-lg font-bold">✅ Guardar</button>
      </form>
      <table className="w-full text-sm">
        <thead className="bg-red-900/40"><tr><th className="p-2 text-left">Placa</th><th>Modelo</th><th>Acciones</th></tr></thead>
        <tbody>
          {datos.unidades.map(u => (
            <tr key={u.id} className="border-t border-red-900/30">
              <td className="p-2">{u.placa}</td><td>{u.modelo}</td>
              <td><button onClick={() => editar(u)} className="text-blue-400 mr-2">✏️</button><button onClick={() => eliminar(u.id)} className="text-red-400">🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}