import ... from "../context/DatosContext"
import ... from "../types";

export default function RespaldoPage() {
  const { datos } = useDatos();

  function descargar() {
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `respaldo-rutas-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-red-200 mb-4">💾 Respaldo de Información</h2>
      <p className="mb-4">Descarga una copia de seguridad completa de todos los datos almacenados en el sistema.</p>
      <button onClick={descargar} className="bg-green-700 hover:bg-green-600 px-6 py-3 rounded-lg font-bold">⬇️ Descargar Archivo de Respaldo</button>
      <p className="text-sm text-gray-400 mt-4">El archivo se descargará con formato JSON y contiene: usuarios, operadores, unidades, clientes, rutas, entregas, combustible y ubicaciones.</p>
    </div>
  );
}