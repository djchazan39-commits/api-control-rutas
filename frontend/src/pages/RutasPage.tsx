import { useState, useEffect } from "react";
import { useDatos } from "../context/DatosContext";
import L from "leaflet";

// ✅ ZONAS PARA RUTAS
const ZONAS_RUTAS = ["CDMX", "MORELIA", "LEÓN", "FORÁNEO", "QUERÉTARO", "LOCAL"];

// ✅ Coordenadas por defecto (centro de Querétaro)
const CENTRO_QRO: [number, number] = [20.6297, -100.4022];

export default function RutasPage() {
  const { datosApp, setDatosApp, guardarCambios } = useDatos();
  const lista = datosApp?.rutas || [];
  const operadores = datosApp?.operadores || [];
  const unidades = datosApp?.unidades || [];
  const clientes = datosApp?.clientes || [];

  const [modo, setModo] = useState("lista");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    zona: "",
    operadorId: "",
    unidadId: "",
    ordenClientes: [] as number[]
  });
  const [mapaListo, setMapaListo] = useState(false);

  // ✅ Inicializar mapa cuando se abre el formulario
  useEffect(() => {
    if (modo === "form" && !mapaListo) {
      setTimeout(() => {
        const contenedor = document.getElementById("mapa-ruta-previo");
        if (contenedor && !contenedor.dataset.iniciado) {
          contenedor.dataset.iniciado = "si";
          const mapa = L.map("mapa-ruta-previo").setView(CENTRO_QRO, 11);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap"
          }).addTo(mapa);
          (window as any)._mapaRuta = mapa;
          setMapaListo(true);
        }
      }, 150);
    }
  }, [modo, mapaListo]);

  // ✅ Dibujar ruta cada vez que cambian los clientes seleccionados
  useEffect(() => {
    if (modo !== "form" || !mapaListo) return;
    const mapa = (window as any)._mapaRuta;
    if (!mapa) return;

    // Borrar marcadores y rutas anteriores
    mapa.eachLayer((capa: any) => {
      if (capa instanceof L.Marker || capa instanceof L.Polyline) mapa.removeLayer(capa);
    });

    const puntos: [number, number][] = [];

    // Dibujar cada cliente en orden
    form.ordenClientes.forEach((idCliente, indice) => {
      const cliente = clientes.find((c: any) => c.id === idCliente);
      if (cliente && cliente.latitud && cliente.longitud) {
        const lat = parseFloat(cliente.latitud);
        const lng = parseFloat(cliente.longitud);
        if (!isNaN(lat) && !isNaN(lng)) {
          puntos.push([lat, lng]);
          L.marker([lat, lng])
            .addTo(mapa)
            .bindPopup(`<b>${indice + 1}. ${cliente.nombre}</b><br>${cliente.direccion || ""}`);
        }
      }
    });

    // ✅ Dibujar línea de recorrido
    if (puntos.length >= 2) {
      L.polyline(puntos, { color: "#ef4444", weight: 4, opacity: 0.8 }).addTo(mapa);
      mapa.fitBounds(puntos, { padding: [30, 30] });
    } else if (puntos.length === 1) {
      mapa.setView(puntos[0], 13);
    }
  }, [form.ordenClientes, modo, mapaListo, clientes]);

  const manejarEnter = (e: React.KeyboardEvent, siguienteId: string | null) => {
    if (e.key === "Enter") {
      e.preventDefault();
      siguienteId ? document.getElementById(siguienteId)?.focus() : guardar();
    }
  };

  const limpiar = () => {
    setForm({ nombre: "", zona: "", operadorId: "", unidadId: "", ordenClientes: [] });
    setEditandoId(null);
    setModo("lista");
    setMapaListo(false);
  };

  // ✅ Agregar o quitar cliente del recorrido
  const toggleCliente = (idCliente: number) => {
    const ya = form.ordenClientes.includes(idCliente);
    setForm(p => ({
      ...p,
      ordenClientes: ya
        ? p.ordenClientes.filter(id => id !== idCliente)
        : [...p.ordenClientes, idCliente]
    }));
  };

  // ✅ Subir o bajar posición de un cliente en la ruta
  const moverCliente = (idCliente: number, direccion: "arriba" | "abajo") => {
    const pos = form.ordenClientes.indexOf(idCliente);
    if (pos === -1) return;
    const nuevaLista = [...form.ordenClientes];
    if (direccion === "arriba" && pos > 0) {
      [nuevaLista[pos], nuevaLista[pos - 1]] = [nuevaLista[pos - 1], nuevaLista[pos]];
    }
    if (direccion === "abajo" && pos < nuevaLista.length - 1) {
      [nuevaLista[pos], nuevaLista[pos + 1]] = [nuevaLista[pos + 1], nuevaLista[pos]];
    }
    setForm(p => ({ ...p, ordenClientes: nuevaLista }));
  };

  const guardar = () => {
    if (!form.nombre.trim() || !form.operadorId || !form.unidadId) {
      alert("⚠️ Completa Nombre, Operador y Unidad");
      return;
    }
    if (editandoId) {
      setDatosApp({
        ...datosApp,
        rutas: lista.map((r: any) =>
          r.id === editandoId ? { ...r, ...form, fechaCreacion: r.fechaCreacion } : r
        )
      });
    } else {
      setDatosApp({
        ...datosApp,
        rutas: [...lista, { ...form, id: Date.now(), fechaCreacion: new Date().toLocaleDateString() }]
      });
    }
    guardarCambios();
    limpiar();
    alert("✅ Ruta guardada correctamente");
  };

  const editar = (r: any) => {
    setEditandoId(r.id);
    setForm({
      nombre: r.nombre,
      zona: r.zona || "",
      operadorId: String(r.operadorId),
      unidadId: String(r.unidadId),
      ordenClientes: r.ordenClientes || []
    });
    setModo("form");
    setMapaListo(false);
  };

  const eliminar = (id: number) => {
    if (!confirm("¿Eliminar esta ruta?")) return;
    setDatosApp({ ...datosApp, rutas: lista.filter((r: any) => r.id !== id) });
    guardarCambios();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">📍 Gestión de Rutas</h2>

      {modo === "lista" ? (
        <>
          <button onClick={() => setModo("form")} className="mb-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">➕ Nueva Ruta</button>
          {lista.length === 0 ? (
            <p className="text-amber-300">Sin rutas registradas</p>
          ) : (
            <div className="space-y-3">
              {lista.map((r: any) => {
                const op = operadores.find((o: any) => String(o.id) === String(r.operadorId));
                const un = unidades.find((u: any) => String(u.id) === String(r.unidadId));
                return (
                  <div key={r.id} className="p-3 bg-black/40 rounded border border-white/10">
                    <p className="font-bold">{r.nombre} <span className="text-sm font-normal text-amber-300">— {r.zona || "Sin zona"}</span></p>
                    <p className="text-sm">👷 {op?.nombre || "Sin operador"} | 🚛 {un?.placa || "Sin unidad"}</p>
                    <p className="text-sm text-gray-400">📍 {r.ordenClientes?.length || 0} clientes en recorrido</p>
                    <div className="mt-2">
                      <button onClick={() => editar(r)} className="text-yellow-300 mr-2">✏️ Editar</button>
                      <button onClick={() => eliminar(r.id)} className="text-red-300">🗑️ Eliminar</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <h3 className="font-bold mb-4">{editandoId ? "✏️ Editar" : "➕ Nueva"} Ruta</h3>

          {/* 📋 DATOS DE LA RUTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Nombre de Ruta *</label>
              <input
                id="campo_nombre_ruta"
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                onKeyDown={(e) => manejarEnter(e, "campo_zona_ruta")}
                className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white"
                placeholder="Ej: Ruta Querétaro - CDMX"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Zona</label>
              <select
                id="campo_zona_ruta"
                value={form.zona}
                onChange={(e) => setForm({ ...form, zona: e.target.value })}
                onKeyDown={(e) => manejarEnter(e, "campo_op_ruta")}
                className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white"
              >
                <option value="" className="bg-gray-800">Selecciona zona</option>
                {ZONAS_RUTAS.map(zona => (
                  <option key={zona} value={zona} className="bg-gray-800">{zona}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Operador *</label>
              <select
                id="campo_op_ruta"
                value={form.operadorId}
                onChange={(e) => setForm({ ...form, operadorId: e.target.value })}
                onKeyDown={(e) => manejarEnter(e, "campo_un_ruta")}
                className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white"
              >
                <option value="">Selecciona...</option>
                {operadores.map((o: any) => (
                  <option key={o.id} value={o.id} className="bg-gray-800">{o.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Unidad *</label>
              <select
                id="campo_un_ruta"
                value={form.unidadId}
                onChange={(e) => setForm({ ...form, unidadId: e.target.value })}
                className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-white"
              >
                <option value="">Selecciona...</option>
                {unidades.map((u: any) => (
                  <option key={u.id} value={u.id} className="bg-gray-800">{u.placa} — {u.modelo}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 📍 CLIENTES EN ORDEN DE RECORRIDO */}
          <div className="mb-4">
            <label className="block text-sm mb-2 font-bold">
              📍 Orden de recorrido — {form.ordenClientes.length} clientes seleccionados
            </label>

            {/* ✅ Lista en orden con botones para mover */}
            {form.ordenClientes.length > 0 && (
              <div className="mb-3 p-2 bg-green-900/40 rounded border border-green-500/30">
                <p className="text-sm font-bold text-green-300 mb-2">✅ Orden actual de visita:</p>
                {form.ordenClientes.map((idCliente, indice) => {
                  const c = clientes.find((x: any) => x.id === idCliente);
                  return (
                    <div key={idCliente} className="flex items-center justify-between py-1 px-2 bg-black/40 rounded mb-1">
                      <span className="text-white text-sm">
                        <strong className="text-amber-400">{indice + 1}.</strong> {c?.nombre || "Cliente desconocido"}
                      </span>
                      <div className="flex gap-1">
                        <button onClick={() => moverCliente(idCliente, "arriba")} className="px-2 text-xs bg-gray-700 rounded">↑</button>
                        <button onClick={() => moverCliente(idCliente, "abajo")} className="px-2 text-xs bg-gray-700 rounded">↓</button>
                        <button onClick={() => toggleCliente(idCliente)} className="px-2 text-xs bg-red-700 rounded">✕</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Lista de clientes disponibles para agregar */}
            <div className="max-h-40 overflow-y-auto border rounded p-2 bg-black/30">
              {clientes.length === 0 ? (
                <p className="text-gray-400">Primero registra clientes con su ubicación</p>
              ) : (
                clientes.map((c: any) => {
                  const yaSeleccionado = form.ordenClientes.includes(c.id);
                  return (
                    <label key={c.id} className={`flex items-center gap-2 text-sm py-1 cursor-pointer ${yaSeleccionado ? "text-gray-400 line-through" : "text-white"}`}>
                      <input
                        type="checkbox"
                        checked={yaSeleccionado}
                        onChange={() => toggleCliente(c.id)}
                        disabled={yaSeleccionado}
                      />
                      {c.nombre} — {c.direccion}
                      {c.latitud && c.longitud && <span className="text-green-400 text-xs">✅ Con ubicación</span>}
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* 🗺️ MAPA DE PREVISUALIZACIÓN DE LA RUTA */}
          <div className="mb-4">
            <label className="block text-sm mb-2 font-bold text-amber-300">🗺️ Vista previa del recorrido</label>
            <div
              id="mapa-ruta-previo"
              className="w-full h-72 rounded border-2 border-amber-500/30"
              style={{ background: "#1a1a1a" }}
            />
            <p className="text-xs text-gray-400 mt-1">
              🔴 La línea roja muestra el recorrido en el orden establecido. Arrastra los clientes con ↑↓ para cambiar el orden.
            </p>
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 mt-4">
            <button onClick={limpiar} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">Cancelar</button>
            <button onClick={guardar} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-bold">💾 Guardar Ruta</button>
          </div>
        </>
      )}
    </div>
  );
}