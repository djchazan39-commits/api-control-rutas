import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DatosApp, UsuarioActivo } from "../types";
import { cargarDatos, API } from "../config/api";


interface ContextoDatos {
  datosApp: DatosApp;
  setDatosApp: React.Dispatch<React.SetStateAction<DatosApp>>;
  usuarioActivo: UsuarioActivo | null;
  guardarCambios: () => Promise<void>;
  iniciarSesion: (nick: string, pass: string) => boolean;
  cerrarSesion: () => void;
}


const DatosContext = createContext<ContextoDatos | undefined>(undefined);


// 🔹 USUARIO ADMINISTRADOR FIJO (NUNCA SE BORRA)
const adminFijo = {
  id: 1,
  nombre: "Administrador",
  rol: "administrador" as const,
  nick: "admin",
  pass: "admin1530"
};


export function DatosProvider({ children }: { children: ReactNode }) {
  const [datosApp, setDatosApp] = useState<DatosApp>({
    usuarios: [adminFijo],
    operadores: [],
    unidades: [],
    clientes: [],
    rutas: [],
    entregas: [],
    combustible: [],
    ubicaciones: []
  });
  const [usuarioActivo, setUsuarioActivo] = useState<UsuarioActivo | null>(null);


  useEffect(() => {
    const cargar = async () => {
      const datosCargados = await cargarDatos();
      if (datosCargados) {
        // ✅ Asegurar que el admin fijo siempre exista
        const sinAdmin = datosCargados.usuarios.filter(u => u.id !== 1);
        datosCargados.usuarios = [adminFijo, ...sinAdmin];
        setDatosApp(datosCargados);
      }
      const guardado = localStorage.getItem("usuarioActivo");
      if (guardado) {
        setUsuarioActivo(JSON.parse(guardado));
      }
    };
    cargar();
  }, []);


  const iniciarSesion = (nick: string, pass: string): boolean => {
    const usuario = datosApp.usuarios.find(u => u.nick === nick && u.pass === pass);
    if (usuario) {
      const sesion: UsuarioActivo = {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        nick: usuario.nick
      };
      setUsuarioActivo(sesion);
      localStorage.setItem("usuarioActivo", JSON.stringify(sesion));
      return true;
    }
    return false;
  };


  const cerrarSesion = () => {
    localStorage.removeItem("usuarioActivo");
    setUsuarioActivo(null);
  };


 const guardarCambios = async () => {
  localStorage.setItem("datosApp", JSON.stringify(datosApp));
  try {
    await fetch(API + '/datos', {  // ✅ Usa la variable API importada
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosApp)
    });
  } catch {
    console.log("✅ Guardado en localStorage");
  }
};


  return (
    <DatosContext.Provider value={{
      datosApp,
      setDatosApp,
      usuarioActivo,
      guardarCambios,
      iniciarSesion,
      cerrarSesion
    }}>
      {children}
    </DatosContext.Provider>
  );
}


// ✅ HOOK CORREGIDO
export function useDatos() {
  const contexto = useContext(DatosContext);
  if (!contexto) {
    throw new Error("useDatos debe usarse dentro de <DatosProvider>");
  }
  return contexto;
}