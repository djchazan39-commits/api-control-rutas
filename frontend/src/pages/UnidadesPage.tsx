import { useState, useEffect } from "react";
import { useDatos } from "../context/DatosContext";


export default function UnidadesPage() {
  const { datosApp, setDatosApp, guardarCambios } = useDatos();
  const lista = datosApp?.unidades || [];
  const [modo, setModo] = useState("lista");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState({ placa: "", marca: "", modelo: "", capacidad: "" });

  useEffect(() => { if (modo === "form") setTimeout(() => document.getElementById("campo_placa")?.focus(), 50); }, [modo]);
  const manejarEnter = (e: React.KeyboardEvent, siguienteId: string | null) => {
    if (e.key === "Enter") { e.preventDefault(); siguienteId ? document.getElementById(siguienteId)?.focus() : guardar(); }
  };
  const limpiar = () => { setForm({ placa: "", marca: "", modelo: "", capacidad: "" }); setEditandoId(null); setModo("lista"); };

  const guardar = () => {
    if (!form.placa.trim()) { alert("⚠️ Escribe las placas"); return; }
    if (editandoId) {
      setDatosApp({ ...datosApp, unidades: lista.map((u) => u.id === editandoId ? { ...u, ...form } : u) });
    } else {
      setDatosApp({ ...datosApp, unidades: [...lista, { ...form, id: Date.now() }] });
    }
    guardarCambios(); limpiar();
  };

  const editar = (u: any) => { setEditandoId(u.id); setForm({ placa: u.placa, marca: u.marca, modelo: u.modelo, capacidad: u.capacidad }); setModo("form"); };
  const eliminar = (id: number) => { if (!confirm("¿Eliminar unidad?")) return; setDatosApp({ ...datosApp, unidades: lista.filter(u => u.id !== id) }); guardarCambios(); };


  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">🚛 Gestión de Unidades</h2>
      {modo === "lista" ? (
        <>
          <button onClick={() => setModo("form")} className="mb-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded">➕ Nueva Unidad</button>
          {lista.length === 0 ? <p className="text-amber-300">Sin unidades registradas</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="py-2 px-2 text-left">Placas</th><th className="py-2 px-2 text-left">Marca</th><th className="py-2 px-2 text-left">Modelo</th><th className="py-2 px-2 text-left">Capacidad</th><th className="py-2 px-2 text-right">Acciones</th></tr></thead>
                <tbody>
                  {lista.map((u: any) => (
                    <tr key={u.id} className="border-b border-white/10">
                      <td className="py-2 px-2 font-bold">{u.placa}</td>
                      <td className="py-2 px-2">{u.marca}</td>
                      <td className="py-2 px-2">{u.modelo}</td>
                      <td className="py-2 px-2">{u.capacidad}</td>
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
          <h3 className="font-bold mb-4">{editandoId ? "Editar" : "Nueva"} Unidad</h3>
          <div className="space-y-3">
            <div><label className="block text-sm mb-1">Placas *</label><input id="campo_placa" type="text" value={form.placa} onChange={e=>setForm({...form,placa:e.target.value})} onKeyDown={e=>manejarEnter(e,"campo_marca")} className="w-full px-3 py-2 bg-white/20 rounded border" /></div>
            <div><label className="block text-sm mb-1">Marca</label><input id="campo_marca" type="text" value={form.marca} onChange={e=>setForm({...form,marca:e.target.value})} onKeyDown={e=>manejarEnter(e,"campo_modelo")} className="w-full px-3 py-2 bg-white/20 rounded border" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm mb-1">Modelo / Año</label><input id="campo_modelo" type="text" value={form.modelo} onChange={e=>setForm({...form,modelo:e.target.value})} onKeyDown={e=>manejarEnter(e,"campo_capacidad")} className="w-full px-3 py-2 bg-white/20 rounded border" /></div>
              <div><label className="block text-sm mb-1">Capacidad</label><input id="campo_capacidad" type="text" value={form.capacidad} onChange={e=>setForm({...form,capacidad:e.target.value})} onKeyDown={e=>manejarEnter(e,null)} className="w-full px-3 py-2 bg-white/20 rounded border" placeholder="3 toneladas..." /></div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={limpiar} className="px-4 py-2 bg-gray-600 rounded">Cancelar</button>
            <button onClick={guardar} className="px-4 py-2 bg-green-600 rounded">💾 Guardar</button>
          </div>
        </>
      )}
    </div>
  );
}