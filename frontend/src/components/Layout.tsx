import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDatos } from '../context/DatosContext';

const menusPorRol: Record<string, { to: string; label: string }[]> = {
  administrador: [
    { to: '/dashboard/usuarios', label: '👤 Usuarios' },
    { to: '/dashboard/operadores', label: '👷 Operadores' },
    { to: '/dashboard/unidades', label: '🚛 Unidades' },
    { to: '/dashboard/clientes', label: '🏢 Clientes' },
    { to: '/dashboard/rutas', label: '📍 Rutas' },
    { to: '/dashboard/seguimiento', label: '👀 Seguimiento' },
    { to: '/dashboard/reportes', label: '📊 Reportes' },
    { to: '/dashboard/respaldo', label: '💾 Respaldo' }
  ],
  director: [
    { to: '/dashboard/usuarios', label: '👤 Usuarios' },
    { to: '/dashboard/operadores', label: '👷 Operadores' },
    { to: '/dashboard/unidades', label: '🚛 Unidades' },
    { to: '/dashboard/clientes', label: '🏢 Clientes' },
    { to: '/dashboard/rutas', label: '📍 Rutas' },
    { to: '/dashboard/seguimiento', label: '👀 Seguimiento' },
    { to: '/dashboard/reportes', label: '📊 Reportes' },
    { to: '/dashboard/respaldo', label: '💾 Respaldo' }
  ],
  logistica: [
    { to: '/dashboard/operadores', label: '👷 Operadores' },
    { to: '/dashboard/unidades', label: '🚛 Unidades' },
    { to: '/dashboard/clientes', label: '🏢 Clientes' },
    { to: '/dashboard/rutas', label: '📍 Rutas' },
    { to: '/dashboard/seguimiento', label: '👀 Seguimiento' },
    { to: '/dashboard/reportes', label: '📊 Reportes' }
  ],
  operador: [
    { to: '/dashboard/mi-ruta', label: '🚛 Mi Ruta' },
    { to: '/dashboard/combustible', label: '⛽ Combustible' }
  ]
};

export default function Layout() {
  const { usuarioActivo, setDatos } = useDatos();
  const navigate = useNavigate();
  const menu = usuarioActivo ? menusPorRol[usuarioActivo.rol] || [] : [];

  function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 to-black text-white">
      <header className="bg-black/60 border-b border-red-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-red-200">🚛 Control de Rutas — {usuarioActivo?.nombre} ({usuarioActivo?.rol})</h1>
          <button onClick={cerrarSesion} className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold">🚪 Cerrar Sesión</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-4">
        <nav className="w-full md:w-56 space-y-2">
          {menu.map(item => (
            <Link key={item.to} to={item.to} className="block bg-red-900/40 hover:bg-red-800/60 p-3 rounded-lg font-semibold transition">
              {item.label}
            </Link>
          ))}
          <button onClick={() => navigate('/dashboard')} className="w-full mt-4 bg-gray-700 hover:bg-gray-600 p-2 rounded-lg">← Volver al Inicio</button>
        </nav>

        <main className="flex-1 bg-black/40 border border-red-800 rounded-xl p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}