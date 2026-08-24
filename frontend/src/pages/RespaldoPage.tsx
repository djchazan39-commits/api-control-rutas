import { useState } from "react";
import { useDatos } from "../context/DatosContext";

export default function RespaldoPage() {
  const { datosApp, setDatosApp, guardarCambios } = useDatos();
  const [mensaje, setMensaje] = useState("");

  const descargarRespaldo = () => {
    if (!datosApp) { alert("No hay datos para respaldar"); return; }
    const archivo = new Blob([JSON.stringify(datosApp, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `respaldo-rutas-${new Date().toLocaleDateString().replace(/\//g,"-")}.json`;
    enlace.click();
    URL.revokeObjectURL(url);
    setMensaje("✅ Respaldo descargado correctamente");
    setTimeout(() => setMensaje(""), 4000);
  };

  const restaurarRespaldo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = (evento) => {
      try {
        const datosRestaurados = JSON.parse(evento.target?.result as string);
        if (!confirm("⚠️ Esto reemplazará TODOS los datos actuales. ¿Continuar?")) return;
        setDatosApp(datosRestaurados);
        guardarCambios();
        setMensaje("✅ Datos restaurados y sincronizados correctamente");
        setTimeout(() => setMensaje(""), 4000);
      } catch {
        alert("❌ El archivo no es válido");
      }
    };
    lector.readAsText(archivo);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">💾 Respaldo y Sincronización</h2>

      {mensaje && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-400 rounded text-center font-bold">
          {mensaje}
        </div>
      )}

      <div className="space-y-4">
        {/* DESCARGA DE RESPALDO */}
        <div className="p-4 bg-black/40 rounded border border-white/10">
          <h3 className="font-bold text-lg mb-2">⬇️ Descargar Respaldo Completo</h3>
          <p className="text-sm text-gray-300 mb-3">
            Descarga TODA la base de datos en un archivo seguro (.json). Incluye usuarios, operadores, unidades, clientes, rutas, entregas y combustible.
          </p>
          <button
            onClick={descargarRespaldo}
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded font-bold"
          >
            💾 Descargar Copia de Seguridad
          </button>
        </div>

        {/* RESTAURAR RESPALDO */}
        <div className="p-4 bg-black/40 rounded border border-white/10">
          <h3 className="font-bold text-lg mb-2">⬆️ Restaurar desde Archivo</h3>
          <p className="text-sm text-yellow-300 mb-3">
            ⚠️ Al restaurar, TODOS los datos actuales se reemplazarán por los del archivo seleccionado.
          </p>
          <label className="block w-full cursor-pointer">
            <div className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold text-center">
              📂 Seleccionar Archivo de Respaldo (.json)
            </div>
            <input
              type="file"
              accept=".json"
              onChange={restaurarRespaldo}
              className="hidden"
            />
          </label>
        </div>

        {/* INFORMACIÓN DE SINCRONIZACIÓN */}
        <div className="p-4 bg-black/40 rounded border border-blue-500/50">
          <h3 className="font-bold text-lg mb-2">🌐 Información de Conexión</h3>
          <ul className="text-sm space-y-1 text-gray-300">
            <li>🟦 Datos sincronizados centralmente</li>
            <li>📂 Guardado automático en almacenamiento local</li>
            <li>🔄 Compatible con servidor central</li>
            <li>📱 Funciona en navegador y dispositivos móviles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}