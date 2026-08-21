import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDatos } from '../context/DatosContext';

const menusPorRol: Record<string, { to: string; label: string }[]> = {
  administrador: [
    { to: "/dashboard/usuarios", label: "👤 Usuarios" },
    { to: "/dashboard/operadores", label: "👷 Operadores" },
    { to: "/dashboard/unidades", label: "🚛 Unidades" },
    { to: "/dashboard/clientes", label: "🏢 Clientes" },
    { to: "/dashboard/rutas", label: "📍 Rutas" },
    { to: "/dashboard/seguimiento", label: "👀 Seguimiento" },
    { to: "/dashboard/reportes", label: "📊 Reportes" },
    { to: "/dashboard/respaldo", label: "💾 Respaldo" }
  ],
  director: [
    { to: "/dashboard/usuarios", label: "👤 Usuarios" },
    { to: "/dashboard/operadores", label: "👷 Operadores" },
    { to: "/dashboard/unidades", label: "🚛 Unidades" },
    { to: "/dashboard/clientes", label: "🏢 Clientes" },
    { to: "/dashboard/rutas", label: "📍 Rutas" },
    { to: "/dashboard/seguimiento", label: "👀 Seguimiento" },
    { to: "/dashboard/reportes", label: "📊 Reportes" },
    { to: "/dashboard/respaldo", label: "💾 Respaldo" }
  ],
  logistica: [
    { to: "/dashboard/operadores", label: "👷 Operadores" },
    { to: "/dashboard/unidades", label: "🚛 Unidades" },
    { to: "/dashboard/clientes", label: "🏢 Clientes" },
    { to: "/dashboard/rutas", label: "📍 Rutas" },
    { to: "/dashboard/seguimiento", label: "👀 Seguimiento" },
    { to: "/dashboard/reportes", label: "📊 Reportes" }
  ],
  operador: [
    { to: "/dashboard/mi-ruta", label: "🚛 Mi Ruta" },
    { to: "/dashboard/combustible", label: "⛽ Combustible" }
  ]
};

export default function Layout() {
  const { usuarioActivo } = useDatos();
  const navigate = useNavigate();
  const location = useLocation();
  const menu = usuarioActivo ? menusPorRol[usuarioActivo.rol] || [] : [];
  const esMenuPrincipal = location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  function cerrarSesion() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace('/');
  }

  function volverAlMenu() {
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 to-black text-white flex flex-col">
      {/* LOGOTIPO ARRIBA */}
      <div className="text-center py-3 border-b border-red-800 bg-black/40">
        <img 
          src="/logo.png" 
          alt="Logotipo de la Empresa" 
          className="mx-auto h-16 w-auto object-contain mb-1"
        />
        <p className="text-sm text-gray-400">Control de Rutas Sierra Querétaro</p>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-6xl mx-auto p-4 w-full">
        {esMenuPrincipal ? (
          // ✅ MENÚ PRINCIPAL: Mensaje + BOTONES CENTRADOS EN 2 COLUMNAS
          <div className="flex flex-col justify-center py-8 h-full">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-red-200 mb-2">✅ Bienvenido, {usuarioActivo?.nombre}</h2>
              <p className="text-gray-300">Selecciona una opción para comenzar</p>
            </div>

            {/* ✅ BOTONES DEL MENÚ — CENTRADOS EN 2 COLUMNAS */}
            <nav className="grid grid-cols-2 gap-4 max-w-xl mx-auto w-full">
              {menu.map(item => (
                <Link 
                  key={item.to} 
                  to={item.to} 
                  className="bg-red-900/40 hover:bg-red-800/60 p-4 rounded-lg font-semibold transition text-center border border-red-800"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : (
          // ✅ FORMULARIO: Solo formulario + botón Volver
          <div>
            <div className="bg-black/40 border border-red-800 rounded-xl p-5 mb-4">
              <Outlet />
            </div>
            <button 
              onClick={volverAlMenu} 
              className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg font-semibold mb-3"
            >
              🏠 Volver al Menú Principal
            </button>
          </div>
        )}
      </main>

      {/* 🔽 SOLO CERRAR SESIÓN — ABAJO DEL TODO 🔽 */}
      {esMenuPrincipal && (
        <footer className="border-t border-red-800 bg-black/50 p-4">
          <button 
            onClick={cerrarSesion} 
            className="w-full max-w-xl mx-auto block bg-red-700 hover:bg-red-600 p-3 rounded-lg font-semibold"
          >
            🚪 Cerrar Sesión
          </button>
        </footer>
      )}
    </div>
  );
}