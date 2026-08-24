import { useDatos } from "../context/DatosContext";
import { Outlet, useLocation, Navigate, Link } from "react-router-dom";

const menusPorRol = {
  administrador: [
    { to: "/dashboard/usuarios", texto: "👤 Usuarios" },
    { to: "/dashboard/operadores", texto: "👷 Operadores" },
    { to: "/dashboard/unidades", texto: "🚛 Unidades" },
    { to: "/dashboard/clientes", texto: "🏢 Clientes" },
    { to: "/dashboard/rutas", texto: "📍 Rutas" },
    { to: "/dashboard/seguimiento", texto: "👀 Seguimiento" },
    { to: "/dashboard/reportes", texto: "📊 Reportes" },
    { to: "/dashboard/respaldo", texto: "💾 Respaldo" },
    { to: "/dashboard/mi-ruta", texto: "🚛 Mi Ruta" },
    { to: "/dashboard/combustible", texto: "⛽ Combustible" }
  ],
  director: [
    { to: "/dashboard/usuarios", texto: "👤 Usuarios" },
    { to: "/dashboard/operadores", texto: "👷 Operadores" },
    { to: "/dashboard/unidades", texto: "🚛 Unidades" },
    { to: "/dashboard/clientes", texto: "🏢 Clientes" },
    { to: "/dashboard/rutas", texto: "📍 Rutas" },
    { to: "/dashboard/seguimiento", texto: "👀 Seguimiento" },
    { to: "/dashboard/reportes", texto: "📊 Reportes" },
    { to: "/dashboard/respaldo", texto: "💾 Respaldo" },
    { to: "/dashboard/mi-ruta", texto: "🚛 Mi Ruta" },
    { to: "/dashboard/combustible", texto: "⛽ Combustible" }
  ],
  logistica: [
    { to: "/dashboard/operadores", texto: "👷 Operadores" },
    { to: "/dashboard/unidades", texto: "🚛 Unidades" },
    { to: "/dashboard/clientes", texto: "🏢 Clientes" },
    { to: "/dashboard/rutas", texto: "📍 Rutas" },
    { to: "/dashboard/seguimiento", texto: "👀 Seguimiento" },
    { to: "/dashboard/reportes", texto: "📊 Reportes" },
  ],
  operador: [
    { to: "/dashboard/mi-ruta", texto: "🚛 Mi Ruta" },
    { to: "/dashboard/combustible", texto: "⛽ Combustible" }
  ]
};

export default function Layout() {
  const { usuarioActivo, cerrarSesion } = useDatos();
  const location = useLocation();

  if (!usuarioActivo) return <Navigate to="/" replace />;
  const ruta = location.pathname;
  const esMenuPrincipal = ruta === "/dashboard" || ruta === "/dashboard/";
  const rol = usuarioActivo.rol as keyof typeof menusPorRol;
  const menu = menusPorRol[rol] || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="text-center py-4">
        <img src="/logo.png" alt="Logo" className="mx-auto h-24 w-auto object-contain" />
      </div>

      <main className="p-4 md:p-6 flex-grow">
        {esMenuPrincipal ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-amber-300 mb-2">✅ Bienvenido, {usuarioActivo.nombre}</h2>
              <p className="text-gray-300">Selecciona una opción del menú para comenzar</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {menu.map((item, i) => (
                <Link key={i} to={item.to} className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg text-center text-lg font-medium transition-colors block">
                  {item.texto}
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-gradient-to-b from-black via-red-950 to-red-900 p-4 md:p-6 rounded-lg max-w-4xl mx-auto">
            <Outlet />
          </div>
        )}
      </main>

      <footer className="p-4 md:p-6 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {!esMenuPrincipal ? (
            <Link to="/dashboard" className="w-full md:w-auto bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded font-medium transition-colors text-center">
              ← Volver al Menú Principal
            </Link>
          ) : <div />}
          <button onClick={cerrarSesion} className="w-full md:w-auto bg-red-700 hover:bg-red-800 px-6 py-3 rounded font-medium transition-colors">
            🚪 Cerrar Sesión
          </button>
        </div>
      </footer>
    </div>
  );
}