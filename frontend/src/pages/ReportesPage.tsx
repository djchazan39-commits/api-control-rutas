import { useState } from 'react';
import ... from "../context/DatosContext"
import ... from "../types"

export default function ReportesPage() {
  const { datos } = useDatos();
  const [ver, setVer] = useState({ usuarios: true, operadores: true, unidades: true, clientes: true, entregas: true, combustible: true });

  return (
    <div>
      <h2 className="text-xl font-bold text-red-200 mb-4">📊 Generar Reportes</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(ver).map(([k,v]) => (
          <label key={k} className="flex items-center gap-1">
            <input type="checkbox" checked={v} onChange={e => setVer({...ver, [k]: e.target.checked})} />
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </label>
        ))}
      </div>

      <div className="space-y-8">
        {ver.usuarios && <section>
          <h3 className="font-bold text-lg mb-2">👤 Usuarios</h3>
          <table className="w-full text-sm"><thead className="bg-red-900/40"><tr><th>Nombre</th><th>Usuario</th><th>Rol</th></tr></thead>
          <tbody>{datos.usuarios.map(u => <tr key={u.id}><td>{u.nombre}</td><td>{u.nick}</td><td>{u.rol}</td></tr>)}</tbody></table>
        </section>}

        {ver.operadores && <section>
          <h3 className="font-bold text-lg mb-2">👷 Operadores</h3>
          <table className="w-full text-sm"><thead className="bg-red-900/40"><tr><th>Nombre</th><th>Licencia</th><th>Vencimiento</th><th>Teléfono</th></tr></thead>
          <tbody>{datos.operadores.map(o => <tr key={o.id}><td>{o.nombre}</td><td>{o.licencia||'—'}</td><td>{o.vencimiento?new Date(o.vencimiento).toLocaleDateString('es-MX'):'—'}</td><td>{o.telefono||'—'}</td></tr>)}</tbody></table>
        </section>}

        {ver.unidades && <section>
          <h3 className="font-bold text-lg mb-2">🚛 Unidades</h3>
          <table className="w-full text-sm"><thead className="bg-red-900/40"><tr><th>Placa</th><th>Modelo</th></tr></thead>
          <tbody>{datos.unidades.map(u => <tr key={u.id}><td>{u.placa}</td><td>{u.modelo}</td></tr>)}</tbody></table>
        </section>}

        {ver.clientes && <section>
          <h3 className="font-bold text-lg mb-2">🏢 Clientes</h3>
          <table className="w-full text-sm"><thead className="bg-red-900/40"><tr><th>Nombre</th><th>Dirección</th><th>Coordenadas</th></tr></thead>
          <tbody>{datos.clientes.map(c => <tr key={c.id}><td>{c.nombre}</td><td>{c.direccion||'—'}</td><td>{c.lat?`${c.lat.toFixed(4)}, ${c.lon.toFixed(4)}`:'—'}</td></tr>)}</tbody></table>
        </section>}

        {ver.entregas && <section>
          <h3 className="font-bold text-lg mb-2">📦 Entregas Reportadas</h3>
          <table className="w-full text-sm"><thead className="bg-red-900/40"><tr><th>Fecha</th><th>Operador</th><th>Cliente</th><th>Estado</th><th>Obs.</th></tr></thead>
          <tbody>{datos.entregas.slice().reverse().map(e => {
            const op = datos.operadores.find(x=>x.id===e.idOperador);
            const cli = datos.clientes.find(x=>x.id===e.idCliente);
            return <tr key={e.id}><td>{new Date(e.fecha).toLocaleDateString('es-MX')}</td><td>{op?.nombre||'—'}</td><td>{cli?.nombre||'—'}</td><td>{e.estado}</td><td>{e.observaciones||'—'}</td></tr>;
          })}</tbody></table>
        </section>}

        {ver.combustible && <section>
          <h3 className="font-bold text-lg mb-2">⛽ Combustible</h3>
          <table className="w-full text-sm"><thead className="bg-red-900/40"><tr><th>Fecha</th><th>Operador</th><th>KM Ini</th><th>KM Fin</th><th>Litros</th><th>Costo</th><th>Rend.</th></tr></thead>
          <tbody>{datos.combustible.slice().reverse().map(c => {
            const op = datos.operadores.find(x=>x.id===c.idOperador);
            return <tr key={c.id}><td>{new Date(c.fecha).toLocaleDateString('es-MX')}</td><td>{op?.nombre||'—'}</td><td>{c.kmIni}</td><td>{c.kmFin}</td><td>{c.litros}</td><td>${c.costo.toFixed(2)}</td><td>{c.litros>0?((c.kmFin-c.kmIni)/c.litros).toFixed(2):'—'}</td></tr>;
          })}</tbody></table>
        </section>}
      </div>
    </div>
  );
}