import { useState, useEffect } from "react";
import { useDatos } from "../context/DatosContext";

export default function MiRutaPage() {
  const { datosApp, usuarioActivo, enviarAlerta } = useDatos();
  const [rutaAsignada, setRutaAsignada] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuarioActivo) return;

    // Buscar ruta asignada al operador activo
    const ruta = datosApp.rutas.find(
      (r) => String(r.operadorId) === String(usuarioActivo.id)
    );

    if (ruta) {
      // Ordenar clientes según la ruta
      const clientesOrdenados = ruta.ordenClientes.map((idCliente: number) =>
        datosApp.clientes.find((c) => c.id === idCliente)
      ).filter(Boolean);

      setRutaAsignada({ ...ruta, clientes: clientesOrdenados });
    } else {
      enviarAlerta("No tienes ninguna ruta asignada actualmente");
    }
    setCargando(false);
  }, [datosApp, usuarioActivo]);

  if (cargando) return <div className="text-center p-8">Cargando tu ruta...</div>;

  if (!rutaAsignada) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-amber-400 mb-4">🚛 Mi Ruta</h2>
        <p className="text-gray-300">No tienes ninguna ruta asignada en este momento.</p>
      </div>
    );
  }

  const puntosRecorrido = rutaAsignada.clientes || [];
  const tieneCoordenadas = puntosRecorrido.some((c: any) => c.latitud && c.longitud);

  return (
    <div>
      <h2 className="text-xl font-bold text-amber-400 mb-4">🚛 Mi Ruta: {rutaAsignada.nombre}</h2>
      <p className="text-gray-300 mb-4">📍 Zona: {rutaAsignada.zona}</p>

      <h3 className="font-bold text-lg mb-2">Lista de Entregas:</h3>
      <div className="space-y-2 mb-6">
        {puntosRecorrido.length === 0 ? (
          <p className="text-gray-400">Sin clientes asignados a esta ruta</p>
        ) : (
          puntosRecorrido.map((cliente: any, i: number) => (
            <div key={i} className="p-3 bg-black/40 rounded border border-gray-600">
              <p className="font-bold">{i + 1}. {cliente?.nombre}</p>
              <p className="text-sm text-gray-300">{cliente?.direccion}</p>
              {cliente?.telefono && <p className="text-sm text-gray-400">📞 {cliente.telefono}</p>}
              {cliente?.latitud && cliente?.longitud && (
                <p className="text-xs text-green-400 mt-1">
                  📍 {cliente.latitud}, {cliente.longitud}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* 🗺️ MAPA INTERACTIVO */}
      {tieneCoordenadas && (
        <div className="mt-4 p-3 bg-black/50 rounded border border-blue-400">
          <h4 className="font-bold mb-2">🗺️ Mapa de Recorrido</h4>
          <iframe
            title="Mapa de Mi Ruta"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: "8px" }}
            src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBNtKfLgAO2KdQMstqQa9bDnXqP8Z7KdU&center=${puntosRecorrido[0]?.latitud || 20.5888},${puntosRecorrido[0]?.longitud || -100.3899}&zoom=12&language=es`}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <p className="text-xs text-gray-400 mt-2">📍 Ubicación de los puntos de entrega</p>
        </div>
      )}

      {!tieneCoordenadas && puntosRecorrido.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-900/40 rounded border border-yellow-500">
          ⚠️ Algunos clientes no tienen coordenadas registradas. Agrega su ubicación para ver el mapa.
        </div>
      )}
    </div>
  );
}