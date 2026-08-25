import { Navigate, Link } from "react-router-dom";
import { useDatos } from "../context/DatosContext";
import { cargarDatos, API } from "../config/api";

export default function DashboardPage() {
  const { usuarioActivo, cerrarSesion } = useDatos();

  if (!usuarioActivo) {
    return <Navigate to="/" replace />;
  }

  // Definir botones según rol
  const rol = usuarioActivo.rol;
  const todosLosBotones = [
    { ruta: "/usuarios", etiqueta: "👤 Usuarios", permitir: ["administrador", "director"] },
    { ruta: "/operadores", etiqueta: "👷 Operadores", permitir: ["administrador", "director", "logistica"] },
    { ruta: "/unidades", etiqueta: "🚛 Unidades", permitir: ["administrador", "director", "logistica"] },
    { ruta: "/clientes", etiqueta: "🏪 Clientes", permitir: ["administrador", "director", "logistica"] },
    { ruta: "/rutas", etiqueta: "🗺️ Rutas", permitir: ["administrador", "director", "logistica"] },
    { ruta: "/mi-ruta", etiqueta: "📍 Mi Ruta", permitir: ["administrador", "director", "logistica", "operador"] },
    { ruta: "/combustible", etiqueta: "⛽ Combustible", permitir: ["administrador", "director", "logistica", "operador"] },
    { ruta: "/seguimiento", etiqueta: "👀 Seguimiento", permitir: ["administrador", "director", "logistica"] },
    { ruta: "/reportes", etiqueta: "📊 Reportes", permitir: ["administrador", "director", "logistica"] },
    { ruta: "/respaldo", etiqueta: "💾 Respaldo", permitir: ["administrador"] }
  ];

  const botonesPermitidos = todosLosBotones.filter(b => b.permitir.includes(rol));

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-950 text-white p-6">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logotipo" className="mx-auto h-24 w-auto object-contain mb-2" />
        <h2 className="text-xl font-bold text-red-200">✅ Bienvenido, {usuarioActivo.nombre}</h2>
        <p className="text-gray-300">Selecciona una opción</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4 mb-8">
        {botonesPermitidos.map((boton, i) => (
          <Link key={i} to={boton.ruta} className="bg-red-900/60 hover:bg-red-800/80 p-4 rounded-xl text-center text-lg font-bold border border-red-500/40 transition-all">
            {boton.etiqueta}
          </Link>
        ))}
      </div>

      <div className="text-center mt-6">
        <button onClick={cerrarSesion} className="bg-gray-800/70 hover:bg-gray-700 px-8 py-3 rounded-lg font-bold text-lg">
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
}