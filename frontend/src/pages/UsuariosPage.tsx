import { useState, useEffect } from 'react';
import { useDatos } from '../../context/DatosContext';
import { Usuario } from '../../types';

export default function UsuariosPage() {
  const { datos, setDatos, guardarCambios } = useDatos();
  const [form, setForm] = useState<Partial<Usuario>>({ nombre: '', rol: 'administrador', nick: '', pass: '' });
  const [editId, setEditId] = useState<number | null>(null);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre || !form.nick || !form.pass) return alert('Completa todos los campos');

    if (editId) {
      setDatos(prev => ({
        ...prev,
        usuarios: prev.usuarios.map(u => u.id === editId ? { ...u, ...form } as Usuario : u)
      }));
    } else {
      const nuevo: Usuario = { ...form, id: Date.now() } as Usuario;
      setDatos(prev => ({ ...prev, usuarios: [...prev.usuarios, nuevo] }));
    }
    await guardarCambios();
    setForm({ nombre: '', rol: 'administrador', nick: '', pass: '' });
    setEditId(null);
  }

  function editar(u: Usuario) {
    setForm(u);
    setEditId(u.id);
  }

  async function eliminar(id: number) {
    if (!confirm('¿Eliminar?')) return;
    setDatos(prev => ({ ...prev, usuarios: prev.usuarios.filter(u => u.id !== id) }));
    await guardarCambios();
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-red-200 mb-4">👤 Administrar Usuarios</h2>
      <form onSubmit={guardar} className="space-y-3 mb-6">
        <input placeholder="Nombre completo" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
          className="w-full p-3 rounded-lg bg-black border border-red-800" />
        <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value as any })}
          className="w-full p-3 rounded-lg bg-black border border-red-800">
          <option value="administrador">Administrador</option>
          <option value="director">Director</option>
          <option value="logistica">Logística</option>
          <option value="operador">Operador</option>
        </select>
        <input placeholder="Usuario de acceso" value={form.nick} onChange={e => setForm({ ...form, nick: e.target.value })}
          className="w-full p-3 rounded-lg bg-black border border-red-800" />
        <input placeholder="Contraseña" value={form.pass} onChange={e => setForm({ ...form, pass: e.target.value })}
          className="w-full p-3 rounded-lg bg-black border border-red-800" />
        <button type="submit" className="bg-green-700 hover:bg-green-600 px-6 py-2 rounded-lg font-bold">✅ Guardar</button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-red-900/40">
            <tr><th className="p-2 text-left">Nombre</th><th>Usuario</th><th>Rol</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {datos.usuarios.map(u => (
              <tr key={u.id} className="border-t border-red-900/30">
                <td className="p-2">{u.nombre}</td>
                <td>{u.nick}</td>
                <td>{u.rol}</td>
                <td>
                  <button onClick={() => editar(u)} className="text-blue-400 mr-2">✏️</button>
                  {u.nick !== 'admin' && <button onClick={() => eliminar(u.id)} className="text-red-400">🗑️</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}