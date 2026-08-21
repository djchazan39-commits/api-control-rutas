import { useEffect } from 'react';
import { useDatos } from '../context/DatosContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { usuarioActivo, cargarSistema } = useDatos();

  useEffect(() => {
    if (!usuarioActivo) window.location.href = '/login';
  }, [usuarioActivo]);

  if (!usuarioActivo) return null;

  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold text-red-200">Bienvenido, {usuarioActivo.nombre}</h2>
      <p className="text-gray-300">Selecciona una opción del menú para comenzar</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {usuarioActivo.rol === 'operador' ? (
          <>
            <Link to="mi-ruta" className="bg-green-900/40 hover:bg-green-800/50 p-6 rounded-xl text-xl font-bold">🚛 Mi Ruta y GPS</Link>
            <Link to="combustible" className="bg-yellow-900/40 hover:bg-yellow-800/50 p-6 rounded-xl text-xl font-bold">⛽ Combustible</Link>
          </>
        ) : (
          <>
            <Link to="usuarios" className="bg-blue-900/40 hover:bg-blue-800/50 p-6 rounded-xl text-xl font-bold">👤 Usuarios</Link>
            <Link to="operadores" className="bg-purple-900/40 hover:bg-purple-800/50 p-6 rounded-xl text-xl font-bold">👷 Operadores</Link>
            <Link to="unidades" className="bg-gray-800/40 hover:bg-gray-700/50 p-6 rounded-xl text-xl font-bold">🚛 Unidades</Link>
            <Link to="clientes" className="bg-orange-900/40 hover:bg-orange-800/50 p-6 rounded-xl text-xl font-bold">🏢 Clientes</Link>
            <Link to="rutas" className="bg-red-900/40 hover:bg-red-800/50 p-6 rounded-xl text-xl font-bold">📍 Asignar Rutas</Link>
            <Link to="seguimiento" className="bg-teal-900/40 hover:bg-teal-800/50 p-6 rounded-xl text-xl font-bold">👀 Seguimiento</Link>
            <Link to="reportes" className="bg-indigo-900/40 hover:bg-indigo-800/50 p-6 rounded-xl text-xl font-bold">📊 Reportes</Link>
            <Link to="respaldo" className="bg-emerald-900/40 hover:bg-emerald-800/50 p-6 rounded-xl text-xl font-bold">💾 Respaldo</Link>
          </>
        )}
      </div>
    </div>
  );
}