import { useState, useEffect } from "react";
import { useDatos } from "../context/DatosContext";

// ✅ LISTA COMPLETA DE LICENCIAS POR ESTADO
const LICENCIAS = {
  queretaro: { nombre: "Querétaro", tipos: ["A", "B", "Cc", "Co", "Ct", "D"] },
  mexico: { nombre: "Estado de México", tipos: ["A", "B", "C"] },
  cdmx: { nombre: "CDMX", tipos: ["A", "B", "C", "D", "E", "E1", "A Permanente"] },
  federales: { nombre: "Federales SCT", tipos: ["A", "B", "C", "D", "E", "F"] }
};

export default function OperadoresPage() {
  const { datosApp, setDatosApp, guardarCambios } = useDatos();
  const lista = datosApp?.operadores || [];
  const [modo, setModo] = useState("lista");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    entidadLicencia: "",
    licenciaTipo: "",
    licenciaClase: "",
    licenciaVence: "",
    telefono: ""
  });

  useEffect(() => {
    if (modo === "form") setTimeout(() => document.getElementById("campo_nombre")?.focus(), 50);
  }, [modo]);

  const manejarEnter = (e: React.KeyboardEvent, siguienteId: string | null) => {
    if (e.key === "Enter") {
      e.preventDefault();
      siguienteId ? document.getElementById(siguienteId)?.focus() : guardar();
    }
  };

  const limpiar = () => {
    setForm({ nombre: "", entidadLicencia: "", licenciaTipo: "", licenciaClase: "", licenciaVence: "", telefono: "" });
    setEditandoId(null);
    setModo("lista");
  };

  const guardar = () => {
    if (!form.nombre.trim()) { alert("⚠️ Escribe el nombre del operador"); return; }
    if (editandoId) {
      setDatosApp({ ...datosApp, operadores: lista.map((u: any) => u.id === editandoId ? { ...u, ...form } : u) });
    } else {
      setDatosApp({ ...datosApp, operadores: [...lista, { ...form, id: Date.now() }] });
    }
    guardarCambios();
    limpiar();
  };

  const editar = (u: any) => {
    setEditandoId(u.id);
    setForm({
      nombre: u.nombre,
      entidadLicencia: u.entidadLicencia || "",
      licenciaTipo: u.licenciaTipo || "",
      licenciaClase: u.licenciaClase || "",
      licenciaVence: u.licenciaVence || "",
      telefono: u.telefono || ""
    });
    setModo("form");
  };

  const eliminar = (id: number) => {
    if (!confirm("¿Eliminar este operador?")) return;
    setDatosApp({ ...datosApp, operadores: lista.filter((u: any) => u.id !== id) });
    guardarCambios();
  };

  const tiposDisponibles = form.entidadLicencia ? LICENCIAS[form.entidadLicencia as keyof typeof LICENCIAS]?.tipos || [] : [];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">👷 Gestión de Operadores</h2>

      {modo === "lista" ? (
        <>
          <button onClick={() => setModo("form")} className="mb-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">➕ Nuevo Operador</button>
          {lista.length === 0 ? <p className="text-amber-300">Sin registros</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-2 px-2 text-left">Nombre</th>
                    <th className="py-2 px-2 text-left">Entidad</th>
                    <th className="py-2 px-2 text-left">Tipo / Clase</th>
                    <th className="py-2 px-2 text-left">Vence</th>
                    <th className="py-2 px-2 text-left">Teléfono</th>
                    <th className="py-2 px-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((u: any) => (
                    <tr key={u.id} className="border-b border-white/10">
                      <td className="py-2 px-2">{u.nombre}</td>
                      <td className="py-2 px-2">{LICENCIAS[u.entidadLicencia as keyof typeof LICENCIAS]?.nombre || "—"}</td>
                      <td className="py-2 px-2">{u.licenciaTipo} — {u.licenciaClase || "—"}</td>
                      <td className="py-2 px-2">{u.licenciaVence}</td>
                      <td className="py-2 px-2">{u.telefono}</td>
                      <td className="py-2 px-2 text-right">
                        <button onClick={() => editar(u)} className="text-yellow-300 mr-2">Editar</button>
                        <button onClick={() => eliminar(u.id)} className="text-red-300">Eliminar</button>
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
          <h3 className="font-bold mb-4">{editandoId ? "Editar" : "Nuevo"} Operador</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Nombre Completo *</label>
              <input id="campo_nombre" type="text" value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                onKeyDown={(e) => manejarEnter(e, "campo_entidad")}
                className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white"
                placeholder="Nombre y apellidos" />
            </div>

            <div>
              <label className="block text-sm mb-1">Entidad que expide la Licencia</label>
              <select id="campo_entidad" value={form.entidadLicencia}
                onChange={(e) => setForm({ ...form, entidadLicencia: e.target.value, licenciaTipo: "" })}
                onKeyDown={(e) => manejarEnter(e, "campo_tipo_lic")}
                className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white">
                <option value="" className="bg-gray-800">Selecciona estado o tipo</option>
                <option value="queretaro" className="bg-gray-800">✅ Querétaro</option>
                <option value="mexico" className="bg-gray-800">✅ Estado de México</option>
                <option value="cdmx" className="bg-gray-800">✅ CDMX</option>
                <option value="federales" className="bg-gray-800">✅ Federales SCT</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Tipo de Licencia</label>
                <select id="campo_tipo_lic" value={form.licenciaTipo}
                  onChange={(e) => setForm({ ...form, licenciaTipo: e.target.value })}
                  onKeyDown={(e) => manejarEnter(e, "campo_clase_lic")}
                  disabled={!form.entidadLicencia}
                  className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white disabled:opacity-50">
                  <option value="" className="bg-gray-800">Primero selecciona entidad</option>
                  {tiposDisponibles.map(tipo => (
                    <option key={tipo} value={tipo} className="bg-gray-800">{tipo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Clase / Subtipo</label>
                <input id="campo_clase_lic" type="text" value={form.licenciaClase}
                  onChange={(e) => setForm({ ...form, licenciaClase: e.target.value })}
                  onKeyDown={(e) => manejarEnter(e, "campo_vence")}
                  className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white"
                  placeholder="Opcional" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Fecha de Vencimiento</label>
                <input id="campo_vence" type="date" value={form.licenciaVence}
                  onChange={(e) => setForm({ ...form, licenciaVence: e.target.value })}
                  onKeyDown={(e) => manejarEnter(e, "campo_telefono")}
                  className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white" />
              </div>
              <div>
                <label className="block text-sm mb-1">Teléfono</label>
                <input id="campo_telefono" type="tel" value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  onKeyDown={(e) => manejarEnter(e, null)}
                  className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={limpiar} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">Cancelar</button>
            <button onClick={guardar} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium">💾 Guardar Operador</button>
          </div>
        </>
      )}
    </div>
  );
}