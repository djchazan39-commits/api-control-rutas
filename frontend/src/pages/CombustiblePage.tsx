import { useState } from 'react';
import { useDatos } from '../context/DatosContext';
import { Combustible, Operador } from '../types';


export default function CombustiblePage() {
  const { datos, setDatos, guardarCambios, usuarioActivo } = useDatos();
  const [form, setForm] = useState<{ kmIni: number; kmFin: number; litros: number; costo: number }>(
    { kmIni: 0, kmFin: 0, litros: 0, costo: 0 }
  );


  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!usuarioActivo) return;
   const idOp = datos.operadores.find((op) => (op as any).nick === usuarioActivo.nick)?.id;
    if (!idOp) return alert('No se identificó tu cuenta de operador');


    const nuevo: Combustible = {
      id: Date.now(),
      idOperador: idOp,
      kmIni: form.kmIni,
      kmFin: form.kmFin,
      litros: form.litros,
      costo: form.costo,
      fecha: new Date().toISOString()
    };
    setDatos(prev => ({ ...prev, combustible: [...prev.combustible, nuevo] }));
    await guardarCambios();
    setForm({ kmIni: 0, kmFin: 0, litros: 0, costo: 0 });
  }


  return (
    <div>
      <h2 className="text-xl font-bold text-red-200 mb-4">⛽ Registro de Combustible</h2>
      <form onSubmit={guardar} className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Kilometraje inicial" value={form.kmIni || ''}
            onChange={e => setForm({...form, kmIni: Number(e.target.value)})}
            className="p-3 rounded-lg bg-black border border-red-800" />
          <input type="number" placeholder="Kilometraje final" value={form.kmFin || ''}
            onChange={e => setForm({...form, kmFin: Number(e.target.value)})}
            className="p-3 rounded-lg bg-black border border-red-800" />
          <input type="number" step="0.01" placeholder="Litros cargados" value={form.litros || ''}
            onChange={e => setForm({...form, litros: Number(e.target.value)})}
            className="p-3 rounded-lg bg-black border border-red-800" />
          <input type="number" step="0.01" placeholder="Costo total ($)" value={form.costo || ''}
            onChange={e => setForm({...form, costo: Number(e.target.value)})}
            className="p-3 rounded-lg bg-black border border-red-800" />
        </div>
        <button type="submit" className="bg-green-700 hover:bg-green-600 px-6 py-2 rounded-lg font-bold">✅ Guardar Registro</button>
      </form>


      <h3 className="font-bold text-lg mb-3">Historial</h3>
      <table className="w-full text-sm">
        <thead className="bg-red-900/40"><tr><th className="p-2 text-left">Fecha</th><th>KM Ini</th><th>KM Fin</th><th>Recorrido</th><th>Litros</th><th>Costo</th><th>Rendimiento km/L</th></tr></thead>
        <tbody>
          {datos.combustible.slice().reverse().map((c: Combustible) => (
            <tr key={c.id} className="border-t border-red-900/30">
              <td className="p-2">{new Date(c.fecha).toLocaleDateString('es-MX')}</td>
              <td>{c.kmIni}</td><td>{c.kmFin}</td><td>{c.kmFin - c.kmIni}</td>
              <td>{c.litros}</td><td>${c.costo.toFixed(2)}</td>
              <td>{c.litros > 0 ? ((c.kmFin - c.kmIni) / c.litros).toFixed(2) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}