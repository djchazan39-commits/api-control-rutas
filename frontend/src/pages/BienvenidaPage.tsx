import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BienvenidaPage() {
  const navegar = useNavigate();
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const temporizador = setInterval(() => {
      setProgreso(anterior => {
        if (anterior >= 100) {
          clearInterval(temporizador);
          setTimeout(() => navegar("/dashboard"), 600);
          return 100;
        }
        return anterior + 2;
      });
    }, 80);
    return () => clearInterval(temporizador);
  }, [navegar]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950 to-red-900 flex flex-col items-center justify-center p-6">
      <img src="/logo.png" alt="Grupo Sierra" className="w-36 h-36 object-contain mb-8 drop-shadow-lg"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      
      {/* ✅ EL MENSAJE EXACTO QUE PEDISTE */}
      <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
        ¡Bienvenido!
      </h1>
      <p className="text-lg md:text-xl text-amber-300 text-center mb-8 max-w-md">
        Estás ingresando al Sistema de Control de Rutas de Grupo Sierra
      </p>

      {/* ✅ BARRA QUE SIMULA LA CARGA */}
      <div className="w-full max-w-xs bg-white/20 rounded-full h-3 overflow-hidden mb-4">
        <div className="h-full bg-amber-400 transition-all duration-100 ease-linear rounded-full"
          style={{ width: `${progreso}%` }} />
      </div>
      <p className="text-white text-sm">Cargando... {progreso}%</p>
    </div>
  );
}