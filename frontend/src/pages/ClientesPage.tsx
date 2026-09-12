import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDatos } from "../context/DatosContext";
import { API } from "../config/api";  // ✅ AGRESTA ESTA LÍNEA

export default function ClientesPage() {
  // ✅ AGRESTA guardarEnServidor AQUÍ
  const { usuarioActivo, datosApp, setDatosApp, cerrarSesion, guardarEnServidor } = useDatos();
  const lista = datosApp?.clientes || [];
  const [modoCoord, setModoCoord] = useState<'gps' | 'manual'>('gps');
  
  const [form, setForm] = useState({ 
    nombre: "", 
    direccion: "", 
    telefono: "", 
    latitud: "", 
    longitud: "" 
  });
  const [editId, setEditId] = useState<number | null>(null);
  if (!usuarioActivo) return <Navigate to="/" replace />;
  
  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      alert("⚠️ Tu dispositivo no tiene GPS o no lo permite");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        const lat = posicion.coords.latitude;
        const lon = posicion.coords.longitude;
        setForm({
          ...form,
          latitud: String(lat),
          longitud: String(lon)
        });
        alert("✅ Ubicación obtenida correctamente");
      },
      (error) => {
        let mensaje = "No se pudo obtener ubicación: ";
        if (error.code === 1) mensaje += "Permiso denegado. Activa el GPS y los permisos de ubicación.";
        else if (error.code === 2) mensaje += "No se encontró la señal GPS.";
        else if (error.code === 3) mensaje += "Tiempo agotado. Intenta de nuevo.";
        alert("⚠️ " + mensaje);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };
  
  const limpiar = () => {
    setForm({ nombre: "", direccion: "", telefono: "", latitud: "", longitud: "" });
    setEditId(null);
  };

  // ✅ FUNCIÓN GUARDAR SIMPLIFICADA — USA LA FUNCIÓN ÚNICA
  const guardar = async () => {
    if (!datosApp) return;
    if (!form.nombre.trim()) return alert("⚠️ Escribe el nombre del cliente");
    if (!form.latitud || !form.longitud) return alert("⚠️ Obtén o escribe las coordenadas");

    if (editId) {
      // ✅ EDITAR — lógica se mantiene igual
      const listaActualizada = lista.map(c => c.id === editId ? { ...c, ...form } as any : c);
      const datosActualizados = {
        usuarios: datosApp.usuarios,
        operadores: datosApp.operadores,
        unidades: datosApp.unidades,
        clientes: listaActualizada,
        rutas: datosApp.rutas,
        entregas: datosApp.entregas,
        combustible: datosApp.combustible,
        ubicaciones: datosApp.ubicaciones
      };
      setDatosApp(datosActualizados);
      await fetch(API + '/datos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados)
      });
      alert("✅ Cliente actualizado");
    } else {
      // ✅ CREAR NUEVO — USAMOS LA FUNCIÓN ÚNICA
      const resultado = await guardarEnServidor("clientes", { ...form });
      if (resultado?.ok) alert("✅ Cliente guardado");
    }
    limpiar();
  };
  
  const editar = (c: any) => {
    setEditId(c.id);
    setForm({ 
      nombre: c.nombre, 
      direccion: c.direccion, 
      telefono: c.telefono, 
      latitud: c.latitud || "", 
      longitud: c.longitud || "" 
    });
  };

  // ✅ ELIMINAR — también se mantiene igual pero limpio
  const eliminar = async (id: number) => {
  if (!confirm("¿Eliminar este cliente?")) return;
  if (!datosApp) return;  // ✅ YA LA TIENES, PERO ASEGÚRALA

  const listaActualizada = lista.filter(c => c.id !== id);
  const datosActualizados = {
    usuarios: datosApp.usuarios,
    operadores: datosApp.operadores,
    unidades: datosApp.unidades,
    clientes: listaActualizada,
    rutas: datosApp.rutas,
    entregas: datosApp.entregas,
    combustible: datosApp.combustible,
    ubicaciones: datosApp.ubicaciones
  };
  setDatosApp(datosActualizados);
  await fetch(API + '/datos', {  // ✅ YA TIENES API IMPORTADO → SIN ROJO
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosActualizados)
  });
  alert("✅ Cliente eliminado");
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-950 text-white p-6">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logotipo" className="mx-auto h-24 w-auto object-contain mb-2" />
        <h2 className="text-xl font-bold text-red-200">🏢 Gestión de Clientes</h2>
      </div>
      <div className="max-w-4xl mx-auto bg-black/40 p-6 rounded-xl border border-red-500/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">Nombre del Cliente *</label>
            <input 
              type="text" 
              value={form.nombre} 
              onChange={e => setForm({...form, nombre: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" 
              placeholder="Nombre del cliente" 
              autoFocus 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">Dirección</label>
            <input 
              type="text" 
              value={form.direccion} 
              onChange={e => setForm({...form, direccion: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" 
              placeholder="Dirección completa" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">Teléfono</label>
            <input 
              type="text" 
              value={form.telefono} 
              onChange={e => setForm({...form, telefono: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" 
              placeholder="Teléfono" 
            />
          </div>
          <div className="md:col-span-2 p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="font-bold mb-2">📍 Ubicación / Coordenadas</p>
            <div className="flex gap-3 mb-3">
              <button 
                type="button" 
                onClick={() => setModoCoord('gps')} 
                className={`px-3 py-1 rounded ${modoCoord === 'gps' ? 'bg-green-600' : 'bg-gray-700'}`}
              >
                🌐 Obtener GPS
              </button>
              <button 
                type="button" 
                onClick={() => setModoCoord('manual')} 
                className={`px-3 py-1 rounded ${modoCoord === 'manual' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                ✏️ Manual
              </button>
            </div>
            {modoCoord === 'gps' && (
              <button 
                type="button" 
                onClick={obtenerUbicacion} 
                className="w-full py-2 bg-green-700 hover:bg-green-600 rounded-lg font-bold mb-2"
              >
                📍 OBTENER MI UBICACIÓN GPS
              </button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400">Latitud</label>
                <input 
                  type="text" 
                  value={form.latitud} 
                  onChange={e => setForm({...form, latitud: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" 
                  placeholder="20.XXXXXX" 
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400">Longitud</label>
                <input 
                  type="text" 
                  value={form.longitud} 
                  onChange={e => setForm({...form, longitud: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white" 
                  placeholder="-100.XXXXXX" 
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mb-6">
          <button onClick={guardar} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold">
            {editId ? "✏️ Actualizar" : "✅ Guardar"}
          </button>
          {editId && <button onClick={limpiar} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg">Cancelar</button>}
        </div>
        <h3 className="font-bold text-lg mb-3">Lista de Clientes ({lista.length})</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {lista.map((c: any) => (
            <div key={c.id} className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-start">
              <div>
                <p className="font-bold">{c.nombre}</p>
                {c.direccion && <p className="text-sm text-gray-400">{c.direccion}</p>}
                {c.telefono && <p className="text-sm text-gray-400">📞 {c.telefono}</p>}
                {c.latitud && c.longitud && (
                  <p className="text-xs text-green-400">📍 {c.latitud}, {c.longitud}</p>
                )}
              </div>
              <div className="space-x-2">
                <button onClick={() => editar(c)} className="text-yellow-400">✏️</button>
                <button onClick={() => eliminar(c.id)} className="text-red-400">🗑️</button>
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
