import { useState, useEffect } from 'react';
import { useDatos } from '../context/DatosContext';
import { Ruta } from '../types';
import L from 'leaflet';

export default function RutasPage() {
  const { datos, setDatos, guardarCambios } = useDatos();
  const [idOperador, setIdOperador] = useState<number | ''>('');
  const [idUnidad, setIdUnidad] = useState<number | ''>('');
  const [nombreRuta, setNombreRuta] = useState('');
  const [clientesSeleccionados, setClientesSeleccionados] = useState<number[]>([]);
  const [ordenClientes, setOrdenClientes] = useState<number[]>([]);
  const [mapa, setMapa] = useState<L.Map | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    if (!mapa) {
      const m = L.map('mapaRutas').setView([20.6297, -100.4022], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(m);
      setMapa(m);
    }
    return () => { if (mapa) mapa.remove() };
  }, []);

  const toggleCliente = (idCli: number) => {
    if (clientesSeleccionados.includes(idCli)) {
      const nuevos = clientesSeleccionados.filter(id => id !== idCli);
      setClientesSeleccionados(nuevos);
      setOrdenClientes(prev => prev.filter(id => id !== idCli));
    } else {
      setClientesSeleccionados([...clientesSeleccionados, idCli]);
      setOrdenClientes([...ordenClientes, idCli]);
    }
  };

  const dibujarRuta = () => {
    if (!mapa) return;
    mapa.eachLayer(l => l instanceof L.TileLayer || mapa.removeLayer(l));
    const coordenadas: [number, number][] = [];
    ordenClientes.forEach(idCli => {
      const cli = datos.clientes.find(c => c.id === idCli);
      if (cli && cli.lat && cli.lon) {
        coordenadas.push([cli.lat, cli.lon]);
        L.marker([cli.lat, cli.lon]).addTo(mapa)
          .bindPopup(`<b>${cli.nombre}</b>`);
      }
    });
    if (coordenadas.length >= 2) {
      L.polyline(coordenadas, { color: '#b91c1c', weight: 4 }).addTo(mapa);
      mapa.fitBounds(coordenadas);
    }
  };

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!idOperador || !idUnidad || !nombreRuta || ordenClientes.length === 0) {
      return alert('Completa todos los campos y selecciona al menos un cliente');
    }
    if (editId) {
      setDatos(prev => ({
        ...prev,
        rutas: prev.rutas.map(r => r.id === editId ? {
          ...r, idOperador, idUnidad, nombre: nombreRuta, ordenClientes
        } as Ruta : r)
      }));
    } else {
      const nueva: Ruta = {
        id: Date.now(), idOperador, idUnidad, nombre: nombreRuta, ordenClientes
      };
      setDatos(prev => ({ ...prev, rutas: [...prev.rutas, nueva] }));
    }
    await guardarCambios();
    setIdOperador(''); setIdUnidad(''); setNombreRuta('');
    setClientesSeleccionados([]); setOrdenClientes([]); setEditId(null);
  }

  function editar(r: Ruta) {
    setIdOperador(r.idOperador);
    setIdUnidad(r.idUnidad);
    setNombreRuta(r.nombre);
    setOrdenClientes(r.ordenClientes);
    setClientesSeleccionados(r.ordenClientes);
    setEditId(r.id);
  }

  async function eliminar(id: number) {
    if (!confirm('¿Eliminar esta ruta?')) return;
    setDatos(prev => ({ ...prev, rutas: prev.rutas.filter(r => r.id !== id) }));
    await guardarCambios();
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-red-200 mb-4">📍 Asignar Ruta</h2>
      <form onSubmit={guardar} className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <select value={idOperador} onChange={e => setIdOperador(Number(e.target.value) || '')}
            className="p-3 rounded-lg bg-black border border-red-800">
            <option value="">-- Selecciona Operador --</option>
            {datos.operadores.map(op => (
              <option key={op.id} value={op.id}>{op.nombre}</option>
            ))}
          </select>
          <select value={idUnidad} onChange={e => setIdUnidad(Number(e.target.value) || '')}
            className="p-3 rounded-lg bg-black border border-red-800">
            <option value="">-- Selecciona Unidad --</option>
            {datos.unidades.map(u => (
              <option key={u.id} value={u.id}>{u.placa} — {u.modelo}</option>
            ))}
          </select>
        </div>
        <input placeholder="Nombre de la ruta / zona" value={nombreRuta}
          onChange={e => setNombreRuta(e.target.value)}
          className="w-full p-3 rounded-lg bg-black border border-red-800" />
        
        <h3 className="font-semibold text-red-200 mt-4">Selecciona clientes (orden de recorrido):</h3>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-red-800 rounded-lg">
          {datos.clientes.map(cli => (
            <label key={cli.id} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={clientesSeleccionados.includes(cli.id)}
                onChange={() => toggleCliente(cli.id)} />
              {cli.nombre}
            </label>
          ))}
        </div>

        {ordenClientes.length > 0 && (
          <div className="bg-green-900/30 p-3 rounded-lg">
            <strong>✅ Orden de recorrido:</strong>
            <ol className="list-decimal list-inside mt-1">
              {ordenClientes.map(idCli => {
                const cli = datos.clientes.find(c => c.id === idCli);
                return cli ? <li key={idCli}>{cli.nombre}</li> : null;
              })}
            </ol>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <button type="button" onClick={dibujarRuta} className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg">🗺️ Ver Ruta</button>
          <button type="submit" className="bg-green-700 hover:bg-green-600 px-6 py-2 rounded-lg font-bold">💾 Guardar Ruta</button>
        </div>
      </form>

      <div id="mapaRutas" className="w-full h-80 rounded-lg border border-red-800 mb-6"></div>

      <h3 className="font-bold text-lg mt-8 mb-3">Rutas Guardadas</h3>
      <div className="space-y-2">
        {datos.rutas.length === 0 ? <p className="text-gray-400">Sin rutas registradas</p> :
          datos.rutas.map(r => {
            const op = datos.operadores.find(x => x.id === r.idOperador);
            const un = datos.unidades.find(x => x.id === r.idUnidad);
            return (
              <div key={r.id} className="p-3 border border-red-800 rounded-lg bg-black/40">
                <strong>{r.nombre}</strong><br />
                Operador: {op?.nombre || '—'} | Unidad: {un?.placa || '—'}<br />
                Clientes en ruta: {r.ordenClientes.length}
                <div className="mt-2">
                  <button onClick={() => editar(r)} className="text-blue-400 mr-3">✏️ Editar</button>
                  <button onClick={() => eliminar(r.id)} className="text-red-400">🗑️ Eliminar</button>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}