import { useState, useEffect } from 'react';
import ... from "../context/DatosContext"
import ... from "../types"
import L from 'leaflet';

export default function SeguimientoPage() {
  const { datos } = useDatos();
  const [idOperadorSel, setIdOperadorSel] = useState<number | ''>('');
  const [mapa, setMapa] = useState<L.Map | null>(null);

  useEffect(() => {
    const m = L.map('mapaSeguimiento').setView([20.6297, -100.4022], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(m);
    setMapa(m);
    return () => { m.remove() };
  }, []);

  useEffect(() => {
    if (!mapa || !idOperadorSel) return;
    mapa.eachLayer(l => l instanceof L.TileLayer || mapa.removeLayer(l));

    const ruta = datos.rutas.find(r => r.idOperador === idOperadorSel);
    if (ruta) {
      const coordenadas: [number, number][] = [];
      ruta.ordenClientes.forEach(idCli => {
        const cli = datos.clientes.find(c => c.id === idCli);
        if (cli && cli.lat && cli.lon) {
          coordenadas.push([cli.lat, cli.lon]);
          L.marker([cli.lat, cli.lon], { icon: L.divIcon({ html: '📍', className: 'text-2xl' }) })
            .addTo(mapa).bindPopup(cli.nombre);
        }
      });
      if (coordenadas.length >= 2) {
        L.polyline(coordenadas, { color: '#b91c1c', weight: 4 }).addTo(mapa);
        mapa.fitBounds(coordenadas);
      }
    }

    const ubicacion = datos.ubicaciones.slice().reverse().find(u => u.idOperador === idOperadorSel);
    if (ubicacion) {
      L.marker([ubicacion.lat, ubicacion.lon], { icon: L.divIcon({ html: '🚛', className: 'text-3xl' }) })
        .addTo(mapa).bindPopup(`Última ubicación: ${new Date(ubicacion.fecha).toLocaleString()}`).openPopup();
      mapa.setView([ubicacion.lat, ubicacion.lon], 13);
    }
  }, [idOperadorSel, mapa, datos]);

  return (
    <div>
      <h2 className="text-xl font-bold text-red-200 mb-4">👀 Seguimiento de Rutas</h2>
      <select value={idOperadorSel} onChange={e => setIdOperadorSel(Number(e.target.value) || '')}
        className="w-full p-3 rounded-lg bg-black border border-red-800 mb-4">
        <option value="">-- Selecciona un operador para ver su ruta y ubicación --</option>
        {datos.operadores.map(op => (
          <option key={op.id} value={op.id}>{op.nombre}</option>
        ))}
      </select>
      <div id="mapaSeguimiento" className="w-full h-96 rounded-lg border border-red-800"></div>
    </div>
  );
}