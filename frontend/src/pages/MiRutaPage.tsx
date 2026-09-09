import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useDatos } from "../context/DatosContext";
import L from "leaflet";

export default function MiRutaPage() {
  const { usuarioActivo, datosApp, cerrarSesion } = useDatos();
  const [rutaAsignada, setRutaAsignada] = useState<any>(null);
  const [mapaCargado, setMapaCargado] = useState(false);

  if (!usuarioActivo) return <Navigate to="/" replace />;

  // ✅ BUSCAR RUTA ASIGNADA AL OPERADOR
  useEffect(() => {
    setMapaCargado(false);
    // ✅ CORREGIDO: datosApp?.rutas con signo de interrogación
    let ruta = datosApp?.rutas?.find((r: any) => 
      String(r.operadorId) === String(usuarioActivo.id)
    );
    // Si no es operador y no tiene ruta asignada, muestra la primera
    if (!ruta && usuarioActivo.rol !== "operador") {
      ruta = datosApp?.rutas?.[0];
    }
    setRutaAsignada(ruta || null);
  }, [datosApp?.rutas, usuarioActivo]);

  // ✅ OBTENER CLIENTES EN ORDEN
  const clientesOrdenados = rutaAsignada?.ordenClientes?.map((id: number) =>
    datosApp?.clientes?.find((c: any) => c.id === id)
  ).filter(Boolean) || [];

  // ✅ DIBUJAR EL MAPA Y LA LÍNEA DE RUTA
  useEffect(() => {
    if (clientesOrdenados.length === 0 || mapaCargado) return;

    const puntos: [number, number][] = [];
    clientesOrdenados.forEach((cliente: any) => {
      if (cliente?.latitud && cliente?.longitud) {
        const lat = parseFloat(cliente.latitud);
        const lng = parseFloat(cliente.longitud);
        if (!isNaN(lat) && !isNaN(lng)) {
          puntos.push([lat, lng]);
        }
      }
    });

    if (puntos.length === 0) {
      console.log("⚠️ No hay coordenadas válidas para dibujar la ruta");
      return;
    }

    const contenedor = document.getElementById("mapa-mi-ruta");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    const mapa = L.map("mapa-mi-ruta").setView(puntos[0], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(mapa);

    if (puntos.length > 1) {
      L.polyline(puntos, {
        color: "red",
        weight: 5,
        opacity: 0.8
      }).addTo(mapa);
    }

    puntos.forEach((punto, i) => {
      const cliente = clientesOrdenados[i];
      L.marker(punto)
        .addTo(mapa)
        .bindPopup(`<b>${i + 1}. ${cliente?.nombre || "Cliente"}</b><br>${cliente?.direccion || ""}`);
    });

    mapa.fitBounds(puntos, { padding: [30, 30] });
    setMapaCargado(true);
  }, [clientesOrdenados, mapaCargado]);

  return (
    <div className="min-h-screen bg-gradient-to-t from-red-900 via-red-950 to-black p-6">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logotipo" className="mx-auto h-16 w-auto mb-2" />
        <h2 className="text-xl font-bold text-white">📋 Mi Ruta Asignada</h2>
      </div>
      <div className="max-w-3xl mx-auto bg-black/40 p-6 rounded-xl border border-red-500/30">
        {!rutaAsignada ? (
          <div className="text-center py-8">
            <p className="text-xl text-amber-300">⚠️ No tienes una ruta asignada aún</p>
            <p className="text-gray-400 mt-2">Consulta con el administrador para que te asignen una ruta.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <h3 className="text-xl font-bold text-white">{rutaAsignada.nombre}</h3>
              <p className="text-red-200">📍 Zona: {rutaAsignada.zona || "No especificada"}</p>
              <p className="text-gray-300 mt-1">
                👷 Operador: {datosApp?.operadores?.find((o: any) => o.id === rutaAsignada.operadorId)?.nombre || "Desconocido"}
                {" | "}
                🚛 Unidad: {datosApp?.unidades?.find((u: any) => u.id === rutaAsignada.unidadId)?.placa || "Desconocida"}
              </p>
            </div>

            {clientesOrdenados.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-white mb-3">🗺️ Mapa de la Ruta</h4>
                <div 
                  id="mapa-mi-ruta" 
                  className="w-full h-80 rounded-lg border border-red-500/30"
                ></div>
              </div>
            )}

            <h4 className="font-bold text-white mb-3">
              📝 Orden de Recorrido — {clientesOrdenados.length} puntos de entrega
            </h4>
            {clientesOrdenados.length === 0 ? (
              <p className="text-gray-400">No hay clientes asignados a esta ruta.</p>
            ) : (
              <div className="space-y-2">
                {clientesOrdenados.map((cliente: any, i: number) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-white">{cliente?.nombre}</p>
                      <p className="text-sm text-gray-400">{cliente?.direccion || "Sin dirección registrada"}</p>
                      {cliente?.latitud && cliente?.longitud && (
                        <p className="text-xs text-green-400 mt-1">
                          📍 {parseFloat(cliente.latitud).toFixed(6)}, {parseFloat(cliente.longitud).toFixed(6)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="text-center mt-8 space-x-4">
        <Link to="/dashboard" className="inline-block bg-gray-700/70 hover:bg-gray-600 px-6 py-3 rounded-lg text-white font-bold">
          ← Volver al Menú Principal
        </Link>
        <button onClick={cerrarSesion} className="bg-red-800/70 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-bold">
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
}