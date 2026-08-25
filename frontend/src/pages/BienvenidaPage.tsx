import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BienvenidaPage() {
  const navegar = useNavigate();
  const [cargando, setCargando] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setCargando(prev => {
        if (prev >= 100) {
          clearInterval(intervalo);
          setTimeout(() => navegar("/dashboard"), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 80);
    return () => clearInterval(intervalo);
  }, [navegar]);

  return (
    <div className="min-h-screen bg-gradient-to-t from-red-900 via-red-950 to-black flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <img src="/logo.png" alt="Logotipo" className="mx-auto h-32 w-auto mb-8" />
        
        <h1 className="text-3xl font-bold text-white mb-4">¡Bienvenido!</h1>
        <p className="text-xl text-red-200 mb-8">Estás ingresando al Sistema de Control de Rutas de Grupo Sierra Querétaro</p>

        {/* BARRA DE CARGA */}
        <div className="w-80 mx-auto bg-black/50 rounded-full h-6 border border-red-500/30 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-200 flex items-center justify-center"
            style={{ width: `${cargando}%` }}
          >
            {cargando > 15 && <span className="text-xs font-bold text-white">{cargando}%</span>}
          </div>
        </div>
        <p className="text-gray-300 mt-4">Cargando sistema...</p>
      </div>
    </div>
  );
}