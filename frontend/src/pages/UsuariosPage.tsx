import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDatos } from "../context/DatosContext";
import { API } from "../config/api";

export default function UsuariosPage() {
  // ✅ AGRESTA guardarEnServidor AQUÍ
  const { usuarioActivo, datosApp, setDatosApp, cerrarSesion, guardarEnServidor } = useDatos();
  const lista = datosApp?.usuarios || [];
  const [form, setForm] = useState({ nombre: "", rol: "", nick: "", pass: "" });
  const [editId, setEditId] = useState<number | null>(null);

  if (!usuarioActivo) return <Navigate to="/" replace />;

  const puedeGestionar = usuarioActivo.rol === "administrador" || usuarioActivo.rol === "director";

  const limpiar = () => {
    setForm({ nombre: "", rol: "", nick: "", pass: "" });
    setEditId(null);
  };

  const guardar = async () => {
    if (!form.nombre.trim() || !form.rol || !form.nick.trim() || !form.pass.trim()) {
      return alert("⚠️ Todos los campos son obligatorios");
    }

    if (editId) {
      // ✅ EDITAR — se mantiene tu lógica
      const listaActualizada = lista.map((u: any) => {
        if (u.id === editId) {
          if (u.esFijo) {
            alert("⚠️ El usuario administrador no se puede modificar");
            return u;
          }
          return { ...u, ...form };
        }
        return u;
      });
      const datosActualizados = { ...datosApp!, usuarios: listaActualizada };
      setDatosApp(datosActualizados);
      await fetch(API + '/datos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados)
      });
    } else {
      // ✅ CREAR NUEVO — EL SERVIDOR ASIGNA EL ID AUTOMÁTICAMENTE
      const resultado = await guardarEnServidor("usuarios", form);
      if (resultado?.ok) {
        console.log("✅ Usuario guardado en PostgreSQL");
      }
    }

    limpiar();
    alert("✅ Usuario guardado");
  };

  const editar = (u: any) => {
    if (u.esFijo) {
      return alert("⚠️ El usuario administrador no se puede modificar");
    }
    setEditId(u.id);
    setForm({ nombre: u.nombre, rol: u.rol, nick: u.nick, pass: u.pass });
  };

  const eliminar = async (id: number) => {
    const usuario = lista.find((u: any) => u.id === id);
    if (usuario && (usuario as any).esFijo) {
      return alert("⚠️ El usuario administrador no se puede eliminar");
    }
    if (!confirm("¿Eliminar este usuario?")) return;
    
    const listaActualizada = lista.filter((u: any) => u.id !== id);
    const datosActualizados = { ...datosApp!, usuarios: listaActualizada };
    setDatosApp(datosActualizados);
    await fetch(API + '/datos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosActualizados)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👤 Usuarios del Sistema</h1>
        <div className="space-x-3">
          <Link to="/dashboard" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">← Volver</Link>
          <button onClick={cerrarSesion} className="px-4 py-2 bg-red-700 rounded hover:bg-red-600">Cerrar Sesión</button>
        </div>
      </div>
      {puedeGestionar && (
        <div className="bg-gray-900 p-6 rounded-lg mb-8 max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-4">{editId ? "✏️ Editar Usuario" : "➕ Nuevo Usuario"}</h2>
          <div className="space-y-3">
            <label className="block">
              <span className="text-gray-300">Nombre Completo *</span>
              <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded" />
            </label>
            <label className="block">
              <span className="text-gray-300">Rol / Permisos *</span>
              <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded">
                <option value="">Selecciona un rol</option>
                <option value="administrador">👑 Administrador</option>
                <option value="director">🎩 Director</option>
                <option value="logistica">📦 Logística</option>
                <option value="operador">🚛 Operador</option>
              </select>
            </label>
            <label className="block">
              <span className="text-gray-300">Usuario / Nick *</span>
              <input type="text" value={form.nick} onChange={e => setForm({ ...form, nick: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded" />
            </label>
            <label className="block">
              <span className="text-gray-300">Contraseña *</span>
              <input type="password" value={form.pass} onChange={e => setForm({ ...form, pass: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded" />
            </label>
            <div className="flex space-x-3 pt-2">
              <button onClick={guardar}
                className="px-6 py-2 bg-green-700 rounded font-semibold hover:bg-green-600">✅ Guardar</button>
              {editId && <button onClick={limpiar}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Cancelar</button>}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">Lista de Usuarios ({lista.length})</h2>
        {lista.length === 0 ? (
          <p className="text-gray-400">No hay usuarios registrados</p>
        ) : (
          <div className="space-y-2">
            {lista.map((u: any) => (
              <div key={u.id} className="bg-gray-900 p-3 rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{u.nombre}</div>
                  <div className="text-sm text-gray-400">
                    {u.nick} | {u.rol === 'administrador' ? '👑 Administrador' :
                      u.rol === 'director' ? '🎩 Director' :
                      u.rol === 'logistica' ? '📦 Logística' : '🚛 Operador'}
                  </div>
                </div>
                {puedeGestionar && !(u as any).esFijo && (
                  <div className="space-x-2">
                    <button onClick={() => editar(u)} className="text-yellow-400 hover:text-yellow-300">✏️</button>
                    <button onClick={() => eliminar(u.id!)} className="text-red-400 hover:text-red-300">🗑️</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
