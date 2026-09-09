import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DatosApp, UsuarioActivo } from "../types";
import { cargarDatos, API } from "../config/api";

interface ContextoDatos {
  datosApp: DatosApp | null;
  setDatosApp: React.Dispatch<React.SetStateAction<DatosApp | null>>;
  usuarioActivo: UsuarioActivo | null;
  guardarCambios: () => Promise<void>;
  iniciarSesion: (nick: string, pass: string) => boolean;
  cerrarSesion: () => void;
}

const DatosContext = createContext<ContextoDatos | undefined>(undefined);

// 🔹 USUARIO ADMINISTRADOR FIJO
const adminFijo = {
  id: 1,
  nombre: "Administrador",
  rol: "administrador" as const,
  nick: "admin",
  pass: "admin1530"
};

export function DatosProvider({ children }: { children: ReactNode }) {
  // ✅ INICIAR VACÍO — NO borrar nada mientras carga
  const [datosApp, setDatosApp] = useState<DatosApp | null>(null);
  const [usuarioActivo, setUsuarioActivo] = useState<UsuarioActivo | null>(null);

  useEffect(() => {
    const cargar = async () => {
      console.log("🔄 Cargando desde:", API);
      
      // ✅ PRIMERO leer del servidor
      const datosServidor = await cargarDatos();

      if (datosServidor && datosServidor.usuarios) {
        // ✅ El servidor tiene datos → USARLOS SIN BORRAR A NADIE
        const sinAdmin = datosServidor.usuarios.filter(u => u.id !== 1);
        datosServidor.usuarios = [adminFijo, ...sinAdmin];
        setDatosApp(datosServidor);
        console.log("✅ CARGADO DEL SERVIDOR —", datosServidor.usuarios.length, "usuarios");
      } else {
        // ⚠️ Servidor vacío → iniciar solo con administrador
        const inicial: DatosApp = {
          usuarios: [adminFijo],
          operadores: [],
          unidades: [],
          clientes: [],
          rutas: [],
          entregas: [],
          combustible: [],
          ubicaciones: []
        };
        setDatosApp(inicial);
        console.log("⚠️ Iniciando con datos por defecto");
      }

      // ✅ Recuperar sesión guardada
      const sesion = localStorage.getItem("usuarioActivo");
      if (sesion) setUsuarioActivo(JSON.parse(sesion));
    };

    cargar();
  }, []);

  const iniciarSesion = (nick: string, pass: string): boolean => {
    if (!datosApp) return false;
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
    if (!datosApp) return;

    try {
      // ✅ Asegurar contraseña del admin antes de guardar
      const datosAGuardar = { ...datosApp };
      const sinAdmin = datosAGuardar.usuarios.filter(u => u.id !== 1);
      datosAGuardar.usuarios = [adminFijo, ...sinAdmin];

      // ✅ Enviar al SERVIDOR CENTRAL
      const resp = await fetch(API + '/datos', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosAGuardar)
      });

      if (resp.ok) {
        console.log("✅ GUARDADO EN SERVIDOR CENTRAL");
      }
    } catch (err) {
      localStorage.setItem("datosApp", JSON.stringify(datosApp));
      console.log("⚠️ Guardado localmente");
    }
  };

  // ✅ No mostrar nada hasta que los datos estén cargados
  if (!datosApp) {
    return <div style={{color:'white',padding:'3rem',textAlign:'center',fontSize:'1.2rem'}}>⏳ Cargando sistema...</div>;
  }

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

// ✅ HOOK
export function useDatos() {
  const contexto = useContext(DatosContext);
  if (!contexto) {
    throw new Error("useDatos debe usarse dentro de <DatosProvider>");
  }
  return contexto;
}