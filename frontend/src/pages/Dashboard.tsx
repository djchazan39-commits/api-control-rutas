import { useDatos } from "../context/DatosContext";
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { usuarioActivo } = useDatos();
  const navigate = useNavigate();

  function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-red-300">🚛 Panel de Control</h1>
            <p className="text-gray-400">Bienvenido, {usuarioActivo?.nombre} ({usuarioActivo?.rol})</p>
          </div>
          <button onClick={cerrarSesion} className="bg-red-800 hover:bg-red-700 px-4 py-2 rounded-lg">Cerrar Sesión</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/usuarios" className="p-5 bg-red-950 border border-red-800 rounded-xl hover:bg-red-900/50">
            <h3 className="font-bold text-lg">👤 Usuarios</h3>
            <p className="text-sm text-gray-400">Administrar accesos al sistema</p>
          </Link>
          <Link to="/operadores" className="p-5 bg-red-950 border border-red-800 rounded-xl hover:bg-red-900/50">
            <h3 className="font-bold text-lg">👷 Operadores</h3>
            <p className="text-sm text-gray-400">Choferes y personal</p>
          </Link>
          <Link to="/unidades" className="p-5 bg-red-950 border border-red-800 rounded-xl hover:bg-red-900/50">
            <h3 className="font-bold text-lg">🚛 Unidades</h3>
            <p className="text-sm text-gray-400">Vehículos de transporte</p>
          </Link>
          <Link to="/clientes" className="p-5 bg-red-950 border border-red-800 rounded-xl hover:bg-red-900/50">
            <h3 className="font-bold text-lg">🏢 Clientes</h3>
            <p className="text-sm text-gray-400">Puntos de entrega</p>
          </Link>
          <Link to="/rutas" className="p-5 bg-red-950 border border-red-800 rounded-xl hover:bg-red-900/50">
            <h3 className="font-bold text-lg">🗺️ Rutas</h3>
            <p className="text-sm text-gray-400">Asignación de recorridos</p>
          </Link>
          <Link to="/mi-ruta" className="p-5 bg-red-950 border border-red-800 rounded-xl hover:bg-red-900/50">
            <h3 className="font-bold text-lg">📍 Mi Ruta</h3>
            <p className="text-sm text-gray-400">Ver ruta y enviar ubicación</p>
          </Link>
          <Link to="/seguimiento" className="p-5 bg-red-950 border border-red-800 rounded-xl hover:bg-red-900/50">
            <h3 className="font-bold text-lg">👀 Seguimiento</h3>
            <p className="text-sm text-gray-400">Ver ubicación en tiempo real</p>
          </Link>
          <Link to="/reportes" className="p-5 bg-red-950 border border-red-800 rounded-xl hover:bg-red-900/50">
            <h3 className="font-bold text-lg">📊 Reportes</h3>
            <p className="text-sm text-gray-400">Consultas y estadísticas</p>
          </Link>
          <Link to="/respaldo" className="p-5 bg-red-950 border border-red-800 rounded-xl hover:bg-red-900/50">
            <h3 className="font-bold text-lg">💾 Respaldo</h3>
            <p className="text-sm text-gray-400">Descargar copia de seguridad</p>
          </Link>
        </div>
      </div>
    </div>
  );
}