import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDatos } from "../context/DatosContext";
import L from "leaflet";


export default function SeguimientoPage() {
  const { usuarioActivo, datosApp, cerrarSesion } = useDatos();
  const [idOperadorSel, setIdOperadorSel] = useState<number | ''>('');
  const [mapa, setMapa] = useState<L.Map | null>(null);


  if (!usuarioActivo) return <Navigate to="/" replace />;


  useEffect(() => {
    const m = L.map('mapaSeguimiento').setView([20.6297, -100.4022], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(m);
    setMapa(m);
    return () => { m.remove() };
  }, []);


  useEffect(() => {
    if (!mapa) return;
    mapa.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) mapa.removeLayer(l); });

    const clientes = datosApp?.clientes || [];
    const rutas = datosApp?.rutas || [];
    const puntos: [number, number][] = []; // ✅ Declarada aquí arriba


    if (idOperadorSel === '') {
      clientes.forEach(c => {
        if ((c as any).latitud && (c as any).longitud) {
          const lat = parseFloat((c as any).latitud);
          const lng = parseFloat((c as any).longitud);
          if (!isNaN(lat) && !isNaN(lng)) {
            L.marker([lat, lng]).addTo(mapa).bindPopup(`<b>${c.nombre}</b><br>${c.direccion||''}`);
          }
        }
      });
      return;
    }


    const ruta = rutas.find((r: any) => String(r.operadorId) === String(idOperadorSel));
    if (ruta) {
      ruta.ordenClientes?.forEach((idCli: number) => {
        const c = clientes.find((cli: any) => cli.id === idCli);
        if (c && (c as any).latitud && (c as any).longitud) {
          const lat = parseFloat((c as any).latitud);
          const lng = parseFloat((c as any).longitud);
          if (!isNaN(lat) && !isNaN(lng)) {
            puntos.push([lat, lng]);
            L.marker([lat, lng]).addTo(mapa).bindPopup(`<b>${c.nombre}</b><br>Orden: ${puntos.length}`);
          }
        }
      });

      // ✅ Ahora sí está dentro del mismo bloque donde existe "puntos"
      if (puntos.length > 0) {
        L.polyline(puntos, { color: 'red', weight: 4 }).addTo(mapa);
        mapa.fitBounds(puntos);
      }
    }
  }, [mapa, idOperadorSel, datosApp]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-950 text-white p-6">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logotipo" className="mx-auto h-24 w-auto object-contain mb-2" />
        <h2 className="text-xl font-bold text-red-200">👀 Seguimiento de Rutas</h2>
      </div>


      <div className="max-w-5xl mx-auto bg-black/40 p-6 rounded-xl border border-red-500/30">
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">Seleccionar Operador</label>
          <select
            value={idOperadorSel}
            onChange={e => setIdOperadorSel(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white"
          >
            <option value="">— Ver todos los clientes —</option>
            {datosApp?.operadores?.map((op: any) => (
              <option key={op.id} value={op.id}>{op.nombre}</option>
            ))}
          </select>
        </div>

        <div id="mapaSeguimiento" className="w-full h-[500px] rounded-lg border border-white/20"></div>
      </div>


      <div className="text-center mt-8 space-x-4">
        <Link to="/dashboard" className="inline-block bg-gray-700/70 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold">← Volver al Menú</Link>
        <button onClick={cerrarSesion} className="bg-red-800/70 hover:bg-red-700 px-6 py-3 rounded-lg font-bold">🚪 Cerrar Sesión</button>
      </div>
    </div>
  );
}