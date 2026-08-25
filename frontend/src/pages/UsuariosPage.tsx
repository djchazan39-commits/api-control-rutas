import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDatos } from "../context/DatosContext";


export default function UsuariosPage() {
  const { usuarioActivo, datosApp, setDatosApp, guardarCambios, cerrarSesion } = useDatos();
  const lista = datosApp?.usuarios || [];
  const [form, setForm] = useState({ nombre: "", rol: "", nick: "", pass: "" });
  const [editId, setEditId] = useState<number | null>(null);


  if (!usuarioActivo) return <Navigate to="/" replace />;

  // ✅ SOLO ADMINISTRADOR Y DIRECTOR PUEDEN GESTIONAR USUARIOS
  const puedeGestionar = usuarioActivo.rol === "administrador" || usuarioActivo.rol === "director";

  if (!puedeGestionar) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-red-950 text-white p-6 flex items-center justify-center">
        <div className="text-center p-8 bg-black/50 rounded-xl border border-red-500/30 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">🔒 Acceso Restringido</h2>
          <p className="text-gray-300 mb-6">No tienes permiso para gestionar usuarios</p>
          <Link to="/dashboard" className="inline-block bg-gray-700/70 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold">← Volver al Menú</Link>
        </div>
      </div>
    );
  }


  const limpiar = () => {
    setForm({ nombre: "", rol: "", nick: "", pass: "" });
    setEditId(null);
  };


  const guardar = () => {
    if (!form.nombre.trim() || !form.rol || !form.nick.trim() || !form.pass.trim()) {
      return alert("⚠️ Todos los campos son obligatorios");
    }

    if (editId) {
      setDatosApp({
        ...datosApp,
        usuarios: lista.map(u => {
          if (u.id === editId) {
            // ✅ No permitir editar el usuario ADMIN fijo
            if ((u as any).esFijo) {
              alert("⚠️ El usuario administrador no se puede modificar");
              return u;
            }
            return { ...u, ...form } as any;
          }
          return u;
        })
      });
    } else {
      setDatosApp({
        ...datosApp,
        usuarios: [...lista, { id: Date.now(), ...form } as any]
      });
    }

    guardarCambios();
    limpiar();
    alert("✅ Usuario guardado");
  };


  const editar = (u: any) => {
    // ✅ No permitir editar el usuario ADMIN fijo
    if ((u as any).esFijo) {
      return alert("⚠️ El usuario administrador no se puede modificar");
    }
    setEditId(u.id);
    setForm({ nombre: u.nombre, rol: u.rol, nick: u.nick, pass: u.pass });
  };


  const eliminar = (id: number) => {
    const usuario = lista.find(u => u.id === id);
    // ✅ No permitir eliminar el usuario ADMIN fijo
    if (usuario && (usuario as any).esFijo) {
      return alert("⚠️ El usuario administrador no se puede eliminar");
    }
    if (!confirm("¿Eliminar este usuario?")) return;
    setDatosApp({ ...datosApp, usuarios: lista.filter(u => u.id !== id) });
    guardarCambios();
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-950 text-white p-6">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logotipo" className="mx-auto h-24 w-auto object-contain mb-2" />
        <h2 className="text-xl font-bold text-red-200">👤 Gestión de Usuarios</h2>
      </div>


      <div className="max-w-4xl mx-auto bg-black/40 p-6 rounded-xl border border-red-500/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nombre Completo *</label>
            <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" placeholder="Nombre del usuario" autoFocus />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Rol / Permisos *</label>
            <select value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white">
              <option value="">Selecciona un rol</option>
              <option value="administrador">👑 Administrador</option>
              <option value="director">🎩 Director</option>
              <option value="logistica">📦 Logística</option>
              <option value="operador">🚛 Operador</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Usuario / Nick *</label>
            <input type="text" value={form.nick} onChange={e => setForm({...form, nick: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" placeholder="Nombre de usuario" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Contraseña *</label>
            <input type="text" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" placeholder="Contraseña" />
          </div>
        </div>


        <div className="flex gap-3 mb-6">
          <button onClick={guardar} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold">
            {editId ? "✏️ Actualizar" : "✅ Guardar"}
          </button>
          {editId && <button onClick={limpiar} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg">Cancelar</button>}
        </div>


        <h3 className="font-bold text-lg mb-3">Lista de Usuarios ({lista.length})</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {lista.map((u: any) => (
            <div key={u.id} className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
              <div>
                <p className="font-bold">
                  {u.nombre}
                  {(u as any).esFijo && <span className="text-green-400 text-sm ml-2">🔒 Fijo</span>}
                </p>
                <p className="text-sm text-gray-400">
                  {u.nick} | {u.rol === 'administrador' && '👑 Administrador'}
                  {u.rol === 'director' && '🎩 Director'}
                  {u.rol === 'logistica' && '📦 Logística'}
                  {u.rol === 'operador' && '🚛 Operador'}
                </p>
              </div>
              <div className="space-x-2">
                <button onClick={() => editar(u)} className="text-yellow-400">✏️</button>
                {!(u as any).esFijo && (
                  <button onClick={() => eliminar(u.id)} className="text-red-400">🗑️</button>
                )}
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