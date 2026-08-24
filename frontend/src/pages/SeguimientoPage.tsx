import { useState, useEffect } from "react";
import { useDatos } from "../context/DatosContext";

export default function SeguimientoPage() {
  const { datosApp } = useDatos();
  const [filtroOperador, setFiltroOperador] = useState("todos");
  const [entregasFiltradas, setEntregasFiltradas] = useState<any[]>([]);

  useEffect(() => {
    let lista = [...datosApp.entregas];
    if (filtroOperador !== "todos") {
      lista = lista.filter((e) => e.operador === filtroOperador);
    }
    setEntregasFiltradas(lista.reverse());
  }, [datosApp.entregas, filtroOperador]);

  const getColorEstado = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "pendiente": return "bg-yellow-700";
      case "en camino": return "bg-blue-700";
      case "entregado": return "bg-green-700";
      case "cancelado": return "bg-red-700";
      default: return "bg-gray-700";
    }
  };

  const puntosConCoords = datosApp.entregas
    .filter((e) => {
      const cliente = datosApp.clientes.find((c) => c.id === e.clienteId);
      return cliente && cliente.latitud && cliente.longitud;
    })
    .map((e) => {
      const cliente = datosApp.clientes.find((c) => c.id === e.clienteId);
      return { ...e, cliente };
    });

  const tieneCoordenadas = puntosConCoords.length > 0;
  const centroLat = tieneCoordenadas ? puntosConCoords[0].cliente.latitud : "20.5888";
  const centroLng = tieneCoordenadas ? puntosConCoords[0].cliente.longitud : "-100.3899";

  return (
    <div>
      <h2 className="text-xl font-bold text-amber-400 mb-4">👀 Seguimiento de Entregas</h2>

      {/* FILTRO */}
      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-300">Filtrar por Operador:</label>
        <select
          value={filtroOperador}
          onChange={(e) => setFiltroOperador(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white"
        >
          <option value="todos">Todos los operadores</option>
          {datosApp.operadores.map((op) => (
            <option key={op.id} value={op.nombre}>{op.nombre}</option>
          ))}
        </select>
      </div>

      {/* LISTA DE ENTREGAS */}
      <div className="space-y-3 mb-6">
        {entregasFiltradas.length === 0 ? (
          <p className="text-gray-400">No hay entregas registradas</p>
        ) : (
          entregasFiltradas.map((entrega, i) => {
            const cliente = datosApp.clientes.find((c) => c.id === entrega.clienteId);
            return (
              <div key={i} className="p-3 bg-black/40 rounded border border-gray-600">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{cliente?.nombre || "Cliente desconocido"}</p>
                    <p className="text-sm text-gray-300">{cliente?.direccion}</p>
                    <p className="text-sm">📅 {entrega.fecha} | 🚛 {entrega.operador}</p>
                    {entrega.observaciones && (
                      <p className="text-xs text-gray-400 mt-1">📝 {entrega.observaciones}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getColorEstado(entrega.estado)}`}>
                    {entrega.estado || "Pendiente"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 🗺️ MAPA DE SEGUIMIENTO */}
      <div className="mt-4 p-3 bg-black/50 rounded border border-blue-400">
        <h4 className="font-bold mb-2">🗺️ Mapa de Ubicaciones</h4>
        <iframe
          title="Mapa de Seguimiento"
          width="100%"
          height="380"
          style={{ border: 0, borderRadius: "8px" }}
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.32!2d${centroLng}!3d${centroLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d347d47d12345%3A0xabc123def!2sQuer%C3%A9taro!5e0!3m2!1ses!2smx!4v${Date.now()}`}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <p className="text-xs text-gray-400 mt-2">📍 El mapa muestra la zona de entregas. Agrega coordenadas a los clientes para ver su ubicación exacta.</p>
      </div>
    </div>
  );
}