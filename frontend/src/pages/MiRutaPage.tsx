import { useState } from 'react';
import { useDatos } from "../context/DatosContext";
import { useNavigate } from 'react-router-dom';

export default function MiRutaPage() {
  const { usuarioActivo } = useDatos();
  const navigate = useNavigate();
  const [vista, setVista] = useState<'menu' | 'ruta' | 'combustible'>('menu');

  function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    navigate('/');
  }

  function volverAlMenuPrincipal() {
    navigate('/dashboard');
  }

  function volverAlMenuOperador() {
    setVista('menu');
  }

  // 🏠 MENÚ DEL OPERADOR
  if (vista === 'menu') {
    return (
      <div>
  {/* LOGOTIPO */}
       <div className="text-center mb-6">
        <img src="/logo.png" alt="Logotipo de la Empresa" className="mx-auto h-24 w-auto object-contain mb-3" />
        <p className="text-sm text-gray-400">Control de Rutas Sierra Querétaro</p>
       </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-red-200">🚛 Menú del Operador</h2>
          <button onClick={cerrarSesion} className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold">
            🚪 Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto mt-8">
          <button 
            onClick={() => setVista('ruta')}
            className="p-6 bg-red-900/40 hover:bg-red-800/60 border border-red-800 rounded-xl transition"
          >
            <div className="text-3xl mb-2">📍</div>
            <h3 className="font-bold text-lg">Mi Ruta</h3>
            <p className="text-sm text-gray-400">Ver recorrido y reportar entregas</p>
          </button>

          <button 
            onClick={() => setVista('combustible')}
            className="p-6 bg-red-900/40 hover:bg-red-800/60 border border-red-800 rounded-xl transition"
          >
            <div className="text-3xl mb-2">⛽</div>
            <h3 className="font-bold text-lg">Combustible</h3>
            <p className="text-sm text-gray-400">Registrar consumo y kilometraje</p>
          </button>
        </div>

        <div className="mt-8 text-center">
          <button onClick={volverAlMenuPrincipal} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg">
            🏠 Volver al Menú Principal
          </button>
        </div>
      </div>
    );
  }

  // 📋 PANTALLA DE RUTA
  if (vista === 'ruta') {
    return (
      <div>
        {/* LOGOTIPO */}
        <div className="text-center mb-6 pb-4 border-b border-red-800">
          <img src="/LOGOEMPRESA.png" alt="Logotipo de la Empresa" className="mx-auto h-16 w-auto object-contain mb-1" />
          <p className="text-sm text-gray-400">Control de Rutas Sierra Querétaro</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-red-200">📍 Mi Ruta</h2>
          <button onClick={cerrarSesion} className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold">
            🚪 Cerrar Sesión
          </button>
        </div>

        <div className="bg-green-900/30 border-l-4 border-green-500 p-4 rounded-lg mb-6">
          <p className="font-semibold">Aquí se mostrará tu ruta asignada</p>
          <p className="text-sm text-gray-300 mt-1">Pronto podrás ver el mapa y reportar entregas</p>
        </div>

        <button onClick={volverAlMenuOperador} className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg font-semibold">
          🏠 Volver al Menú del Operador
        </button>
      </div>
    );
  }

  // ⛽ PANTALLA DE COMBUSTIBLE
  return (
    <div>
      {/* LOGOTIPO */}
      <div className="text-center mb-6 pb-4 border-b border-red-800">
        <img src="/LOGOEMPRESA.png" alt="Logotipo de la Empresa" className="mx-auto h-16 w-auto object-contain mb-1" />
        <p className="text-sm text-gray-400">Control de Rutas Sierra Querétaro</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-red-200">⛽ Registro de Combustible</h2>
        <button onClick={cerrarSesion} className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold">
          🚪 Cerrar Sesión
        </button>
      </div>

      <div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
        <p className="font-semibold">Aquí registrarás el consumo de combustible</p>
        <p className="text-sm text-gray-300 mt-1">Formulario próximamente disponible</p>
      </div>

      <button onClick={volverAlMenuOperador} className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg font-semibold">
        🏠 Volver al Menú del Operador
      </button>
    </div>
  );
}