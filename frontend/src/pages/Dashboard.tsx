import { useDatos } from "../context/DatosContext";

export default function Dashboard() {
  const { usuarioActivo } = useDatos();

  return (
    <div className="text-center py-6">
      <h2 className="text-xl font-bold text-red-200 mb-2">✅ Bienvenido, {usuarioActivo?.nombre}</h2>
      <p className="text-gray-300">Selecciona una opción del menú de abajo para comenzar</p>
    </div>
  );
}