import { useState, useEffect } from "react";
import { useDatos } from "../context/DatosContext";


export default function CombustiblePage() {
  const { datosApp, setDatosApp, guardarCambios, usuarioActivo } = useDatos();
  const lista = datosApp?.combustible || [];
  const unidades = datosApp?.unidades || [];
  const [modo, setModo] = useState("lista");
  const hoy = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    fecha: hoy,
    unidadId: "",
    kmInicial: "",
    kmFinal: "",
    litros: "",
    importe: "",
    rendimiento: "",
    registradoPor: usuarioActivo?.nombre || ""
  });

  // ✅ Cursor automático en primer campo
  useEffect(() => {
    if (modo === "form") {
      setTimeout(() => document.getElementById("campo_fecha")?.focus(), 50);
    }
  }, [modo]);

  // ✅ Navegar con Enter entre campos
  const manejarEnter = (e: React.KeyboardEvent, siguienteId: string | null) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (siguienteId) {
        document.getElementById(siguienteId)?.focus();
      } else {
        guardar();
      }
    }
  };

  // ✅ Calcular rendimiento automáticamente
  useEffect(() => {
    if (form.kmInicial && form.kmFinal && form.litros) {
      const km = Number(form.kmFinal) - Number(form.kmInicial);
      const lts = Number(form.litros);
      if (km > 0 && lts > 0) {
        setForm((p) => ({ ...p, rendimiento: (km / lts).toFixed(2) }));
      }
    }
  }, [form.kmInicial, form.kmFinal, form.litros]);

  const limpiar = () => {
    setForm({
      fecha: hoy,
      unidadId: "",
      kmInicial: "",
      kmFinal: "",
      litros: "",
      importe: "",
      rendimiento: "",
      registradoPor: usuarioActivo?.nombre || ""
    });
    setModo("lista");
  };

  const guardar = () => {
    if (!form.fecha || !form.unidadId || !form.kmInicial || !form.kmFinal || !form.litros) {
      alert("⚠️ Completa Fecha, Unidad, Kilometraje y Litros");
      return;
    }
    setDatosApp({
      ...datosApp,
      combustible: [...lista, { ...form, id: Date.now(), fechaHora: new Date().toLocaleString() }]
    });
    guardarCambios();
    limpiar();
  };


  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">⛽ Control de Combustible</h2>

      {modo === "lista" ? (
        <>
          <button
            onClick={() => {
              setForm({
                fecha: hoy,
                unidadId: "",
                kmInicial: "",
                kmFinal: "",
                litros: "",
                importe: "",
                rendimiento: "",
                registradoPor: usuarioActivo?.nombre || ""
              });
              setModo("form");
            }}
            className="mb-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            ➕ Nuevo Registro
          </button>

          {lista.length === 0 ? (
            <p className="text-amber-300">Sin registros</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-2 px-1 text-left">Fecha</th>
                    <th className="py-2 px-1 text-left">Unidad</th>
                    <th className="py-2 px-1 text-center">Km Ini</th>
                    <th className="py-2 px-1 text-center">Km Fin</th>
                    <th className="py-2 px-1 text-center">Litros</th>
                    <th className="py-2 px-1 text-center">$</th>
                    <th className="py-2 px-1 text-center">Km/L</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.slice().reverse().map((r: any) => {
                    const u = unidades.find((x) => String(x.id) === String(r.unidadId));
                    return (
                      <tr key={r.id} className="border-b border-white/10">
                        <td className="py-1 px-1">{r.fecha}</td>
                        <td className="py-1 px-1">{u?.placa || "—"}</td>
                        <td className="py-1 px-1 text-center">{r.kmInicial}</td>
                        <td className="py-1 px-1 text-center">{r.kmFinal}</td>
                        <td className="py-1 px-1 text-center">{r.litros}</td>
                        <td className="py-1 px-1 text-center">${r.importe}</td>
                        <td className="py-1 px-1 text-center font-bold text-green-400">{r.rendimiento}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          <h3 className="font-bold mb-4">⛽ Nuevo Abastecimiento</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Fecha *</label>
                <input
                  id="campo_fecha"
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  onKeyDown={(e) => manejarEnter(e, "campo_unidad")}
                  className="w-full px-3 py-2 bg-white/20 rounded border border-white/30"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Unidad *</label>
                <select
                  id="campo_unidad"
                  value={form.unidadId}
                  onChange={(e) => setForm({ ...form, unidadId: e.target.value })}
                  onKeyDown={(e) => manejarEnter(e, "campo_ini")}
                  className="w-full px-3 py-2 bg-white/20 rounded border border-white/30"
                >
                  <option value="">Selecciona...</option>
                  {unidades.map((u) => (
                    <option key={u.id} value={u.id}>{u.placa}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm mb-1">Km Inicial *</label>
                <input
                  id="campo_ini"
                  type="number"
                  value={form.kmInicial}
                  onChange={(e) => setForm({ ...form, kmInicial: e.target.value })}
                  onKeyDown={(e) => manejarEnter(e, "campo_fin")}
                  className="w-full px-3 py-2 bg-white/20 rounded border border-white/30"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Km Final *</label>
                <input
                  id="campo_fin"
                  type="number"
                  value={form.kmFinal}
                  onChange={(e) => setForm({ ...form, kmFinal: e.target.value })}
                  onKeyDown={(e) => manejarEnter(e, "campo_litros")}
                  className="w-full px-3 py-2 bg-white/20 rounded border border-white/30"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Litros *</label>
                <input
                  id="campo_litros"
                  type="number"
                  step="0.01"
                  value={form.litros}
                  onChange={(e) => setForm({ ...form, litros: e.target.value })}
                  onKeyDown={(e) => manejarEnter(e, "campo_importe")}
                  className="w-full px-3 py-2 bg-white/20 rounded border border-white/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Importe Pagado $</label>
                <input
                  id="campo_importe"
                  type="number"
                  step="0.01"
                  value={form.importe}
                  onChange={(e) => setForm({ ...form, importe: e.target.value })}
                  onKeyDown={(e) => manejarEnter(e, null)}
                  className="w-full px-3 py-2 bg-white/20 rounded border border-white/30"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Rendimiento Km/L</label>
                <input
                  type="text"
                  value={form.rendimiento}
                  readOnly
                  className="w-full px-3 py-2 bg-green-900/40 rounded border border-green-500 font-bold text-center"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={limpiar} className="px-4 py-2 bg-gray-600 rounded">Cancelar</button>
            <button onClick={guardar} className="px-4 py-2 bg-green-600 rounded">💾 Guardar Registro</button>
          </div>
        </>
      )}
    </div>
  );
}