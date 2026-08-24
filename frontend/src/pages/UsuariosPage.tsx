import { useState, useEffect } from "react";
import { useDatos } from "../context/DatosContext";


export default function UsuariosPage() {
  const { datosApp, setDatosApp, guardarCambios } = useDatos();
  const lista = datosApp?.usuarios || [];
  const [modo, setModo] = useState("lista");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: "", rol: "", nick: "", pass: "" });

  // ✅ Cursor en el primer campo al abrir formulario
  useEffect(() => {
    if (modo === "form") {
      setTimeout(() => document.getElementById("campo_nombre")?.focus(), 50);
    }
  }, [modo]);

  // ✅ Navegar con Enter entre campos
  const manejarEnter = (e: React.KeyboardEvent, campoSiguienteId: string | null) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (campoSiguienteId) {
        document.getElementById(campoSiguienteId)?.focus();
      } else {
        guardar(); // ← Último campo: Enter = Guardar
      }
    }
  };

  const limpiarForm = () => {
    setForm({ nombre: "", rol: "", nick: "", pass: "" });
    setEditandoId(null);
    setModo("lista");
  };

  const guardar = () => {
    if (!form.nombre.trim() || !form.nick.trim() || !form.pass.trim()) {
      alert("⚠️ Completa Nombre, Usuario y Contraseña");
      return;
    }
    if (editandoId) {
      const actualizado = lista.map((u: any) => u.id === editandoId ? { ...u, ...form } : u);
      setDatosApp({ ...datosApp, usuarios: actualizado });
    } else {
      const nuevo = { ...form, id: Date.now() };
      setDatosApp({ ...datosApp, usuarios: [...lista, nuevo] });
    }
    guardarCambios();
    limpiarForm();
  };

  const editar = (u: any) => {
    if (u.esFijo || u.id === 1) {
      alert("⚠️ El Administrador Principal solo puede cambiarse la contraseña por seguridad");
    }
    setEditandoId(u.id);
    setForm({ nombre: u.nombre, rol: u.rol, nick: u.nick, pass: u.pass || "" });
    setModo("form");
  };

  const eliminar = (id: number) => {
    if (id === 1) { 
      alert("❌ El Administrador Principal NO se puede eliminar"); 
      return; 
    }
    if (!confirm("¿Eliminar este usuario?")) return;
    const filtrada = lista.filter((u: any) => u.id !== id);
    setDatosApp({ ...datosApp, usuarios: filtrada });
    guardarCambios();
  };


  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">👤 Gestión de Usuarios</h2>

      {modo === "lista" ? (
        <>
          <button
            onClick={() => setModo("form")}
            className="mb-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            ➕ Nuevo Usuario
          </button>

          {lista.length === 0 ? (
            <p className="text-amber-300 py-4">No hay usuarios registrados</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-2 px-2">Nombre Completo</th>
                    <th className="py-2 px-2">Rol / Permiso</th>
                    <th className="py-2 px-2">Usuario</th>
                    <th className="py-2 px-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((u: any) => (
                    <tr key={u.id} className="border-b border-white/10">
                      <td className="py-2 px-2">{u.nombre}</td>
                      <td className="py-2 px-2 capitalize font-medium">{u.rol}</td>
                      <td className="py-2 px-2">{u.nick}</td>
                      <td className="py-2 px-2 text-right">
                        <button onClick={() => editar(u)} className="text-yellow-300 hover:underline mr-2">Editar</button>
                        <button onClick={() => eliminar(u.id)} className="text-red-300 hover:underline">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          <h3 className="font-bold mb-4">{editandoId ? "Editar Usuario" : "Nuevo Usuario"}</h3>
          <div className="space-y-3">
            <div>
              <label className="block mb-1 text-sm">Nombre Completo *</label>
              <input
                id="campo_nombre"
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                onKeyDown={(e) => manejarEnter(e, "campo_rol")}
                className="w-full px-3 py-2 bg-white/20 text-white rounded border border-white/30 focus:outline-none focus:border-amber-400"
                placeholder="Nombre y apellidos"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Rol / Nivel de Acceso *</label>
              <select
                id="campo_rol"
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                onKeyDown={(e) => manejarEnter(e, "campo_nick")}
                className="w-full px-3 py-2 bg-white/20 text-white rounded border border-white/30 focus:outline-none focus:border-amber-400"
              >
                <option value="" className="bg-gray-800">Selecciona un rol</option>
                <option value="administrador" className="bg-gray-800">🔴 Administrador — Todo el sistema</option>
                <option value="director" className="bg-gray-800">🔵 Director — Igual que administrador</option>
                <option value="logistica" className="bg-gray-800">🟡 Logística — Todo menos Usuarios y Respaldo</option>
                <option value="operador" className="bg-gray-800">🟢 Operador — Solo Mi Ruta y Combustible</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm">Nombre de Usuario (Nick) *</label>
              <input
                id="campo_nick"
                type="text"
                value={form.nick}
                onChange={(e) => setForm({ ...form, nick: e.target.value })}
                onKeyDown={(e) => manejarEnter(e, "campo_pass")}
                className="w-full px-3 py-2 bg-white/20 text-white rounded border border-white/30 focus:outline-none focus:border-amber-400"
                placeholder="Ej: admin"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Contraseña *</label>
              <input
                id="campo_pass"
                type="text"
                value={form.pass}
                onChange={(e) => setForm({ ...form, pass: e.target.value })}
                onKeyDown={(e) => manejarEnter(e, null)} // ← Enter = Guardar
                className="w-full px-3 py-2 bg-white/20 text-white rounded border border-white/30 focus:outline-none focus:border-amber-400"
                placeholder="Escribe contraseña"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={limpiarForm} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">Cancelar</button>
            <button onClick={guardar} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium">💾 Guardar Usuario</button>
          </div>
        </>
      )}
    </div>
  );
}