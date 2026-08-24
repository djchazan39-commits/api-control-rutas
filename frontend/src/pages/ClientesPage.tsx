import { useState, useEffect } from "react";
import { useDatos } from "../context/DatosContext";


export default function ClientesPage() {
  const { datosApp, setDatosApp, guardarCambios } = useDatos();
  const lista = datosApp?.clientes || [];
  const [modo, setModo] = useState("lista");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: "", direccion: "", telefono: "", latitud: "", longitud: "" });

  useEffect(() => { if (modo === "form") setTimeout(() => document.getElementById("campo_nombre")?.focus(), 50); }, [modo]);
  const manejarEnter = (e: React.KeyboardEvent, siguienteId: string | null) => {
    if (e.key === "Enter") { e.preventDefault(); siguienteId ? document.getElementById(siguienteId)?.focus() : guardar(); }
  };
  const limpiar = () => { setForm({ nombre: "", direccion: "", telefono: "", latitud: "", longitud: "" }); setEditandoId(null); setModo("lista"); };

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) { alert("❌ No disponible"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setForm(p => ({ ...p, latitud: String(pos.coords.latitude), longitud: String(pos.coords.longitude) })); },
      () => { alert("❌ No se pudo obtener ubicación"); }
    );
  };

  const guardar = () => {
    if (!form.nombre.trim()) { alert("⚠️ Escribe el nombre del cliente"); return; }
    if (editandoId) {
      setDatosApp({ ...datosApp, clientes: lista.map((c) => c.id === editandoId ? { ...c, ...form } : c) });
    } else {
      setDatosApp({ ...datosApp, clientes: [...lista, { ...form, id: Date.now() }] });
    }
    guardarCambios(); limpiar();
  };

  const editar = (c: any) => { setEditandoId(c.id); setForm({ nombre: c.nombre, direccion: c.direccion, telefono: c.telefono, latitud: c.latitud, longitud: c.longitud }); setModo("form"); };
  const eliminar = (id: number) => { if (!confirm("¿Eliminar cliente?")) return; setDatosApp({ ...datosApp, clientes: lista.filter(c => c.id !== id) }); guardarCambios(); };


  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">🏢 Gestión de Clientes</h2>
      {modo === "lista" ? (
        <>
          <button onClick={() => setModo("form")} className="mb-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded">➕ Nuevo Cliente</button>
          {lista.length === 0 ? <p className="text-amber-300">Sin clientes registrados</p> : (
            <div className="space-y-2">
              {lista.map((c: any) => (
                <div key={c.id} className="p-3 bg-black/40 rounded border border-white/10 flex justify-between items-start gap-3">
                  <div>
                    <p className="font-bold">{c.nombre}</p>
                    <p className="text-sm text-gray-300">{c.direccion}</p>
                    {c.telefono && <p className="text-sm">📞 {c.telefono}</p>}
                    {c.latitud && <p className="text-xs text-green-400">📍 {c.latitud}, {c.longitud}</p>}
                  </div>
                  <div className="shrink-0">
                    <button onClick={() => editar(c)} className="text-yellow-300 mr-2">Editar</button>
                    <button onClick={() => eliminar(c.id)} className="text-red-300">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h3 className="font-bold mb-4">{editandoId ? "Editar" : "Nuevo"} Cliente</h3>
          <div className="space-y-3">
            <div><label className="block text-sm mb-1">Nombre *</label><input id="campo_nombre" type="text" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} onKeyDown={e=>manejarEnter(e,"campo_direccion")} className="w-full px-3 py-2 bg-white/20 rounded border" /></div>
            <div><label className="block text-sm mb-1">Dirección</label><input id="campo_direccion" type="text" value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})} onKeyDown={e=>manejarEnter(e,"campo_telefono")} className="w-full px-3 py-2 bg-white/20 rounded border" /></div>
            <div><label className="block text-sm mb-1">Teléfono</label><input id="campo_telefono" type="tel" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})} onKeyDown={e=>manejarEnter(e,"campo_lat")} className="w-full px-3 py-2 bg-white/20 rounded border" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm mb-1">Latitud</label><input id="campo_lat" type="text" value={form.latitud} onChange={e=>setForm({...form,latitud:e.target.value})} onKeyDown={e=>manejarEnter(e,"campo_lng")} className="w-full px-3 py-2 bg-white/20 rounded border" /></div>
              <div><label className="block text-sm mb-1">Longitud</label><input id="campo_lng" type="text" value={form.longitud} onChange={e=>setForm({...form,longitud:e.target.value})} onKeyDown={e=>manejarEnter(e,null)} className="w-full px-3 py-2 bg-white/20 rounded border" /></div>
            </div>
            <button type="button" onClick={obtenerUbicacion} className="w-full py-2 bg-blue-700 rounded">📍 Usar mi ubicación actual</button>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={limpiar} className="px-4 py-2 bg-gray-600 rounded">Cancelar</button>
            <button onClick={guardar} className="px-4 py-2 bg-green-600 rounded">💾 Guardar Cliente</button>
          </div>
        </>
      )}
    </div>
  );
}