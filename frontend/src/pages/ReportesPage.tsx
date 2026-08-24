import { useState } from "react";
import { useDatos } from "../context/DatosContext";

export default function ReportesPage() {
  const { datosApp } = useDatos();
  const { usuarios = [], operadores = [], unidades = [], clientes = [], entregas = [], combustible = [] } = datosApp || {};

  const [seleccion = {
    usuarios: true,
    operadores: true,
    unidades: true,
    clientes: true,
    entregas: true,
    combustible: true,
  }, setSeleccion] = useState<any>({
    usuarios: true,
    operadores: true,
    unidades: true,
    clientes: true,
    entregas: true,
    combustible: true,
  });

  const toggleSeccion = (clave: string) => {
    setSeleccion({ ...seleccion, [clave]: !seleccion[clave] });
  };

  const imprimir = () => {
    window.print();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">📊 Generador de Reportes</h2>

      {/* SELECCIÓN DE CONTENIDO */}
      <div className="mb-6 p-3 bg-black/40 rounded border border-white/10">
        <p className="text-sm font-bold mb-3">✅ Selecciona lo que deseas incluir en el reporte:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { clave: "usuarios", etiqueta: "👤 Usuarios" },
            { clave: "operadores", etiqueta: "👷 Operadores" },
            { clave: "unidades", etiqueta: "🚛 Unidades" },
            { clave: "clientes", etiqueta: "🏢 Clientes" },
            { clave: "entregas", etiqueta: "📦 Entregas Reportadas" },
            { clave: "combustible", etiqueta: "⛽ Combustible" },
          ].map((item) => (
            <label key={item.clave} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={seleccion[item.clave]}
                onChange={() => toggleSeccion(item.clave)}
                className="w-5 h-5"
              />
              <span className="text-white">{item.etiqueta}</span>
            </label>
          ))}
        </div>
      </div>

      {/* VISTA PREVIA */}
      <div className="mb-6">
        <h3 className="font-bold mb-3 text-amber-300">📄 Vista Previa del Reporte</h3>
        <div className="p-4 bg-black/40 rounded border border-white/10 space-y-6">
          {seleccion.usuarios && (
            <div>
              <h4 className="font-bold text-lg border-b border-white/20 pb-1 mb-2">👤 Usuarios ({usuarios.length})</h4>
              {usuarios.length === 0 ? (
                <p className="text-sm text-gray-400">Sin registros</p>
              ) : (
                <table className="w-full text-sm">
                  <thead><tr className="text-left"><th>Nombre</th><th>Rol</th><th>Usuario</th></tr></thead>
                  <tbody>
                    {usuarios.map((u: any) => (
                      <tr key={u.id} className="border-t border-white/10">
                        <td className="py-1">{u.nombre}</td>
                        <td>{u.rol}</td>
                        <td>{u.nick}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {seleccion.operadores && (
            <div>
              <h4 className="font-bold text-lg border-b border-white/20 pb-1 mb-2">👷 Operadores ({operadores.length})</h4>
              {operadores.length === 0 ? (
                <p className="text-sm text-gray-400">Sin registros</p>
              ) : (
                <table className="w-full text-sm">
                  <thead><tr className="text-left"><th>Nombre</th><th>Licencia</th><th>Vencimiento</th><th>Teléfono</th></tr></thead>
                  <tbody>
                    {operadores.map((o: any) => (
                      <tr key={o.id} className="border-t border-white/10">
                        <td className="py-1">{o.nombre}</td>
                        <td>{o.licenciaTipo?.toUpperCase()} — {o.licenciaClase}</td>
                        <td>{o.licenciaVence || "No registrado"}</td>
                        <td>{o.telefono || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {seleccion.unidades && (
            <div>
              <h4 className="font-bold text-lg border-b border-white/20 pb-1 mb-2">🚛 Unidades ({unidades.length})</h4>
              {unidades.length === 0 ? (
                <p className="text-sm text-gray-400">Sin registros</p>
              ) : (
                <table className="w-full text-sm">
                  <thead><tr className="text-left"><th>Placa</th><th>Marca</th><th>Modelo</th><th>Capacidad</th></tr></thead>
                  <tbody>
                    {unidades.map((u: any) => (
                      <tr key={u.id} className="border-t border-white/10">
                        <td className="py-1 font-bold">{u.placa}</td>
                        <td>{u.marca}</td>
                        <td>{u.modelo}</td>
                        <td>{u.capacidad || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {seleccion.clientes && (
            <div>
              <h4 className="font-bold text-lg border-b border-white/20 pb-1 mb-2">🏢 Clientes ({clientes.length})</h4>
              {clientes.length === 0 ? (
                <p className="text-sm text-gray-400">Sin registros</p>
              ) : (
                <table className="w-full text-sm">
                  <thead><tr className="text-left"><th>Nombre</th><th>Dirección</th><th>Teléfono</th><th>Coordenadas</th></tr></thead>
                  <tbody>
                    {clientes.map((c: any) => (
                      <tr key={c.id} className="border-t border-white/10">
                        <td className="py-1">{c.nombre}</td>
                        <td>{c.direccion || "-"}</td>
                        <td>{c.telefono || "-"}</td>
                        <td className="text-xs">{c.latitud ? `${c.latitud}, ${c.longitud}` : "Sin GPS"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {seleccion.entregas && (
            <div>
              <h4 className="font-bold text-lg border-b border-white/20 pb-1 mb-2">📦 Entregas Reportadas ({entregas.length})</h4>
              {entregas.length === 0 ? (
                <p className="text-sm text-gray-400">Sin registros</p>
              ) : (
                <table className="w-full text-sm">
                  <thead><tr className="text-left"><th>Fecha</th><th>Operador</th><th>Estado</th><th>Pago</th><th>Observaciones</th></tr></thead>
                  <tbody>
                    {entregas.map((e: any, i: number) => (
                      <tr key={i} className="border-t border-white/10">
                        <td className="py-1">{e.fecha}</td>
                        <td>{e.operador}</td>
                        <td className={e.estado === "Entregado" ? "text-green-400" : "text-yellow-400"}>{e.estado}</td>
                        <td>{e.pago}</td>
                        <td className="text-xs">{e.observaciones || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {seleccion.combustible && (
            <div>
              <h4 className="font-bold text-lg border-b border-white/20 pb-1 mb-2">⛽ Combustible ({combustible.length})</h4>
              {combustible.length === 0 ? (
                <p className="text-sm text-gray-400">Sin registros</p>
              ) : (
                <table className="w-full text-sm">
                  <thead><tr className="text-left"><th>Fecha</th><th>Litros</th><th>Importe</th><th>Km Recorridos</th><th>Rendimiento</th></tr></thead>
                  <tbody>
                    {combustible.map((c: any, i: number) => (
                      <tr key={i} className="border-t border-white/10">
                        <td className="py-1">{c.fecha}</td>
                        <td>{c.litros} L</td>
                        <td>${c.importe}</td>
                        <td>{parseFloat(c.kmFinal) - parseFloat(c.kmInicial)} km</td>
                        <td className="font-bold text-green-300">{c.rendimiento} km/L</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BOTÓN DE IMPRESIÓN */}
      <button
        onClick={imprimir}
        className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold text-lg"
      >
        🖨️ Imprimir Reporte
      </button>
    </div>
  );
}