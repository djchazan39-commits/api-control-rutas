import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  const { usuarioActivo } = useDatos();
  const navigate = useNavigate();
  const location = useLocation();
  const menu = usuarioActivo ? menusPorRol[usuarioActivo.rol] || [] : [];
  const esMenuPrincipal = location.pathname === '/dashboard';

  function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    navigate('/');
  }

  function volverAlMenu() {
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 to-black text-white">
      {/* LOGOTIPO ARRIBA CENTRADO EN TODA LA APLICACIÓN */}
      <div className="text-center py-4 border-b border-red-800 bg-black/40">
       <img src="/logo.png" alt="Logotipo" className="mx-auto h-24 w-auto object-contain mb-3" />
        <p className="text-sm text-gray-400">Control de Rutas Sierra Querétaro</p>
      </div>

      {/* Barra con usuario y botón cerrar sesión */}
      <header className="bg-black/60 border-b border-red-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="font-semibold">{usuarioActivo?.nombre} — {usuarioActivo?.rol}</p>
          <button 
            onClick={cerrarSesion} 
            className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        {/* MENÚ PRINCIPAL — SOLO visible en /dashboard */}
        {esMenuPrincipal && (
          <nav className="space-y-3 max-w-md mx-auto mt-6">
            <h2 className="text-xl font-bold text-center text-red-200 mb-4">📋 Menú Principal</h2>
            {menu.map(item => (
              <Link 
                key={item.to} 
                to={item.to} 
                className="block bg-red-900/40 hover:bg-red-800/60 p-4 rounded-lg font-semibold transition text-center text-lg"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* FORMULARIO — SOLO visible al elegir una opción */}
        {!esMenuPrincipal && (
          <div className="mt-4">
            <main className="bg-black/40 border border-red-800 rounded-xl p-6 mb-4">
              <Outlet />
            </main>
            <button 
              onClick={volverAlMenu} 
              className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg font-semibold"
            >
              🏠 Volver al Menú Principal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}