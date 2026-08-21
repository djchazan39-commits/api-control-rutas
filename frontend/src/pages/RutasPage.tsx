import { useState } from 'react';
import { useDatos } from "../context/DatosContext";
import { Ruta, Operador, Unidad, Cliente } from "../types";

export default function RutasPage() {
  const { datos, setDatos, guardarCambios } = useDatos();
  const [form, setForm] = useState<Partial<Ruta>>({ nombre: '', idOperador: 0, idUnidad: 0, ordenClientes: [] as number[] });
  const [editId, setEditId] = useState<number | null>(null);
  const [clientesSeleccionados, setClientesSeleccionados] = useState<number[]>([]);

  function seleccionarCliente(idCliente: number) {
    if (clientesSeleccionados.includes(idCliente)) {
      setClientesSeleccionados(clientesSeleccionados.filter(id => id !== idCliente));
    } else {
      setClientesSeleccionados([...clientesSeleccionados, idCliente]);
    }
    setForm({ ...form, ordenClientes: clientesSeleccionados });
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre || !form.idOperador || !form.idUnidad || clientesSeleccionados.length === 0) {
      return alert('Completa todos los campos y selecciona al menos un cliente');
    }

    if (editId) {
      setDatos(prev => ({
        ...prev,
        rutas: prev.rutas.map((r: Ruta) =>
          r.id === editId
            ? { ...r, nombre: form.nombre!, idOperador: form.idOperador!, idUnidad: form.idUnidad!, ordenClientes: clientesSeleccionados } as Ruta
            : r
        )
      }));
    } else {
      const nueva: Ruta = {
        id: Date.now(),
        nombre: form.nombre!,
        idOperador: form.idOperador!,
        idUnidad: form.idUnidad!,
        ordenClientes: clientesSeleccionados
      };
      setDatos(prev => ({ ...prev, rutas: [...prev.rutas, nueva] }));
    }

    await guardarCambios();
    setForm({ nombre: '', idOperador: 0, idUnidad: 0, ordenClientes: [] });
    setClientesSeleccionados([]);
    setEditId(null);
  }

  function editar(r: Ruta) {
    setForm(r);
    setClientesSeleccionados(r.ordenClientes);
    setEditId(r.id);
  }

  async function eliminar(id: number) {
    if (!confirm('¿Eliminar esta ruta?')) return;
    setDatos(prev => ({ ...prev, rutas: prev.rutas.filter((r: Ruta) => r.id !== id) }));
    await guardarCambios();
  }

  function getNombreOperador(id: number) {
    return datos.operadores.find((o: Operador) => o.id === id)?.nombre || '—';
  }

  function getNombreUnidad(id: number) {
    const u = datos.unidades.find((uni: Unidad) => uni.id === id);
    return u ? `${u.placa} - ${u.modelo}` : '—';
  }

  function getNombreCliente(id: number) {
    return datos.clientes.find((c: Cliente) => c.id === id)?.nombre || '—';
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-red-200 mb-4">🗺️ Gestión de Rutas</h2>

      <form onSubmit={guardar} className="space-y-3 mb-6">
        <input
          placeholder="Nombre de la ruta"
          value={form.nombre || ''}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          className="w-full p-3 rounded-lg bg-black border border-red-800"
        />

        <select
          value={form.idOperador || 0}
          onChange={e => setForm({ ...form, idOperador: Number(e.target.value) })}
          className="w-full p-3 rounded-lg bg-black border border-red-800"
        >
          <option value={0}>-- Selecciona Operador --</option>
          {datos.operadores.map((o: Operador) => (
            <option key={o.id} value={o.id}>{o.nombre}</option>
          ))}
        </select>

        <select
          value={form.idUnidad || 0}
          onChange={e => setForm({ ...form, idUnidad: Number(e.target.value) })}
          className="w-full p-3 rounded-lg bg-black border border-red-800"
        >
          <option value={0}>-- Selecciona Unidad --</option>
          {datos.unidades.map((u: Unidad) => (
            <option key={u.id} value={u.id}>{u.placa} — {u.modelo}</option>
          ))}
        </select>

        <div className="border border-red-800 rounded-lg p-3 bg-black">
          <p className="text-sm font-semibold mb-2">Selecciona los Clientes (orden de entrega):</p>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {datos.clientes.length === 0 ? (
              <p className="text-gray-400 text-sm">No hay clientes registrados aún</p>
            ) : (
              datos.clientes.map((c: Cliente) => (
                <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clientesSeleccionados.includes(c.id)}
                    onChange={() => seleccionarCliente(c.id)}
                  />
                  {c.nombre}
                </label>
              ))
            )}
          </div>
          {clientesSeleccionados.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">Seleccionados: {clientesSeleccionados.length} cliente(s)</p>
          )}
        </div>

        <button type="submit" className="bg-green-700 hover:bg-green-600 px-6 py-2 rounded-lg font-bold">
          {editId ? '✅ Actualizar' : '✅ Crear Ruta'}
        </button>
      </form>

      <table className="w-full text-sm">
        <thead className="bg-red-900/40">
          <tr>
            <th className="p-2 text-left">Nombre</th>
            <th>Operador</th>
            <th>Unidad</th>
            <th>Clientes en ruta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.rutas.map((r: Ruta) => (
            <tr key={r.id} className="border-t border-red-900/30">
              <td className="p-2">{r.nombre}</td>
              <td>{getNombreOperador(r.idOperador)}</td>
              <td>{getNombreUnidad(r.idUnidad)}</td>
              <td className="text-xs">
                {r.ordenClientes.map(id => getNombreCliente(id)).join(' → ')}
              </td>
              <td>
                <button onClick={() => editar(r)} className="text-blue-400 mr-2">✏️</button>
                <button onClick={() => eliminar(r.id)} className="text-red-400">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}