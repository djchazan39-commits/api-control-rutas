import { useState, useEffect } from 'react';
import ... from "../context/DatosContext"
import ... from "../types"
import L from 'leaflet';

export default function MiRutaPage() {
  const { datos, usuarioActivo, setDatos, guardarCambios } = useDatos();
  const [miUbicacion, setMiUbicacion] = useState<{lat:number, lon:number} | null>(null);
  const [mapa, setMapa] = useState<L.Map | null>(null);
  const [rutaAsignada, setRutaAsignada] = useState<typeof datos.rutas[0] | null>(null);
  const [idClienteActivo, setIdClienteActivo] = useState<number | null>(null);
  const [estadoEntrega, setEstadoEntrega] = useState<'entregado'|'incompleto'|'norecibido'>('entregado');
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    if (!usuarioActivo) return;
    const idOp = datos.operadores.find(op => op.nick === usuarioActivo.nick)?.id;
    if (idOp) {
      const ruta = datos.rutas.find(r => r.idOperador === idOp);
      setRutaAsignada(ruta || null);
    }
  }, [usuarioActivo, datos]);

  useEffect(() => {
    const m = L.map('mapaMiRuta').setView([20.6297, -100.4022], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(m);
    setMapa(m);
    return () => { m.remove() };
  }, []);

  const actualizarUbicacion = () => {
    if (!navigator.geolocation) return alert('GPS no disponible');
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setMiUbicacion({ lat, lon });

      if (usuarioActivo) {
        const idOp = datos.operadores.find(op => op.nick === usuarioActivo.nick)?.id;
        if (idOp) {
          setDatos(prev => ({
            ...prev,
            ubicaciones: [...prev.ubicaciones.filter(u => !(u.idOperador === idOp &&
              new Date(u.fecha).toDateString() === new Date().toDateString())),
              { idOperador: idOp, lat, lon, fecha: new Date().toISOString() }]
          }));
          await guardarCambios();
        }
      }

      if (mapa) {
        mapa.eachLayer(l => l instanceof L.TileLayer || mapa.removeLayer(l));
        L.marker([lat, lon], { icon: L.divIcon({ html: '📍', className: 'text-2xl' }) })
          .addTo(mapa).bindPopup('Tu ubicación actual').openPopup();
        mapa.setView([lat, lon], 14);

        if (rutaAsignada) {
          const coords: [number, number][] = [];
          rutaAsignada.ordenClientes.forEach(idCli => {
            const cli = datos.clientes.find(c => c.id === idCli);
            if (cli && cli.lat && cli.lon) {
              coords.push([cli.lat, cli.lon]);
              L.marker([cli.lat, cli.lon], { icon: L.divIcon({ html: '🏢', className: 'text-xl' }) })
                .addTo(mapa).bindPopup(cli.nombre);
            }
          });
          if (coords.length) L.polyline(coords, { color: '#b91c1c' }).addTo(mapa);
        }
      }
    });
  };

  async function enviarReporte() {
    if (!idClienteActivo || !usuarioActivo) return alert('Selecciona un cliente');
    const idOp = datos.operadores.find(op => op.nick === usuarioActivo.nick)?.id;
    setDatos(prev => ({
      ...prev,
      entregas: [...prev.entregas, {
        id: Date.now(), idOperador: idOp!, idCliente: idClienteActivo,
        estado: estadoEntrega, observaciones, fecha: new Date().toISOString(),
        lat: miUbicacion?.lat, lon: miUbicacion?.lon
      }]
    }));
    await guardarCambios();
    alert('✅ Reporte enviado al servidor');
    setIdClienteActivo(null); setObservaciones('');
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-red-200 mb-4">🚛 Mi Ruta y Ubicación</h2>

      <div className="bg-green-900/30 border-l-4 border-green-500 p-3 rounded-lg mb-4">
        <strong>📍 Tu ubicación en tiempo real:</strong><br />
        {miUbicacion ? `Lat: ${miUbicacion.lat.toFixed(6)}, Lon: ${miUbicacion.lon.toFixed(6)}` : 'Presiona el botón para obtenerla'}
      </div>
      <button onClick={actualizarUbicacion} className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg mb-6">🔄 Actualizar Ubicación y Enviar</button>

      {rutaAsignada ? (
        <div className="mb-6">
          <h3 className="font-bold text-lg">Ruta asignada: {rutaAsignada.nombre}</h3>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            {rutaAsignada.ordenClientes.map(idCli => {
              const cli = datos.clientes.find(c => c.id === idCli);
              const entrega = datos.entregas.slice().reverse().find(e => e.idCliente === idCli);
              return cli ? (
                <li key={idCli} className="flex justify-between items-center p-2 border-b border-red-900/30">
                  <span>{cli.nombre} {entrega && <span className="text-green-400">✅ {entrega.estado}</span>}</span>
                  {!entrega && <button onClick={() => setIdClienteActivo(idCli)} className="bg-yellow-700 hover:bg-yellow-600 px-3 py-1 rounded text-sm">Reporte</button>}
                </li>
              ) : null;
            })}
          </ol>
        </div>
      ) : <p className="text-gray-400 mb-6">No tienes ninguna ruta asignada aún</p>}

      {idClienteActivo && (
        <div className="p-4 bg-black/50 border border-red-800 rounded-lg mb-6">
          <h4 className="font-bold mb-2">✅ Reporte de Entrega</h4>
          <select value={estadoEntrega} onChange={e => setEstadoEntrega(e.target.value as any)}
            className="w-full p-2 rounded-lg bg-black border border-red-800 mb-2">
            <option value="entregado">✅ Entregado</option>
            <option value="incompleto">⚠️ Entrega incompleta</option>
            <option value="norecibido">❌ No recibido</option>
          </select>
          <textarea placeholder="Observaciones" value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
            className="w-full p-2 rounded-lg bg-black border border-red-800 mb-2" />
          <button onClick={enviarReporte} className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg">📤 Enviar Reporte</button>
        </div>
      )}

      <div id="mapaMiRuta" className="w-full h-96 rounded-lg border border-red-800"></div>
    </div>
  );
}