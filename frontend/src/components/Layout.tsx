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
    navigate("/");
  }

  function volverAlMenu() {
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 to-black text-white flex flex-col">
      {/* LOGOTIPO Y BARRA DE USUARIO — ARRIBA SIEMPRE */}
      <div className="text-center py-3 border-b border-red-800 bg-black/40">
        <img 
          src="/logo.png" 
          alt="Logotipo de la Empresa" 
          className="mx-auto h-16 w-auto object-contain mb-1"
        />
        <p className="text-sm text-gray-400">Control de Rutas Sierra Querétaro</p>
      </div>

      <header className="bg-black/60 border-b border-red-800 p-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="font-semibold text-sm">{usuarioActivo?.nombre} — {usuarioActivo?.rol}</p>
          <button 
            onClick={cerrarSesion} 
            className="bg-red-700 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </header>

      {/* CONTENIDO — Si es menú principal: mensaje + botones abajo | Si es formulario: formulario solo */}
      <main className="flex-1 max-w-6xl mx-auto p-4 w-full">
        {esMenuPrincipal ? (
          // ✅ MENÚ PRINCIPAL: Solo mensaje, los botones van ABAJO
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-red-200 mb-2">✅ Bienvenido, {usuarioActivo?.nombre}</h2>
            <p className="text-gray-300">Selecciona una opción del menú de abajo</p>
          </div>
        ) : (
          // ✅ FORMULARIO ABIERTO: Solo formulario + botón volver, SIN botones del menú
          <div className="bg-black/40 border border-red-800 rounded-xl p-5 mb-4">
            <Outlet />
          </div>
        )}

        {!esMenuPrincipal && (
          <button 
            onClick={volverAlMenu} 
            className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg font-semibold"
          >
            🏠 Volver al Menú Principal
          </button>
        )}
      </main>

      {/* 🔽 BOTONES DEL MENÚ — SOLO VISIBLES EN MENÚ PRINCIPAL 🔽 */}
      {esMenuPrincipal && (
        <footer className="border-t border-red-800 bg-black/50 p-4">
          <h3 className="text-lg font-bold text-center text-red-200 mb-3">📋 Menú Principal</h3>
          <nav className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {menu.map(item => (
              <Link 
                key={item.to} 
                to={item.to} 
                className="bg-red-900/40 hover:bg-red-800/60 p-3 rounded-lg font-semibold transition text-center border border-red-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </footer>
      )}
    </div>
  );
}