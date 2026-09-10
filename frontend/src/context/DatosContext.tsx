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

// 🔹 USUARIO ADMINISTRADOR FIJO (nunca se borra ni cambia contraseña)
const adminFijo = {
  id: 1,
  nombre: "Administrador",
  rol: "administrador" as const,
  nick: "admin",
  pass: "admin1530"
};

export function DatosProvider({ children }: { children: ReactNode }) {
  const [datosApp, setDatosApp] = useState<DatosApp | null>(null);
  const [usuarioActivo, setUsuarioActivo] = useState<UsuarioActivo | null>(null);

  useEffect(() => {
    const cargar = async () => {
      console.log("🔄 VERSIÓN NUEVA — Cargando desde:", API);
      
      // ✅ PRIMERO leer TODO del servidor central
      const datosServidor = await cargarDatos();
      
      if (datosServidor && datosServidor.usuarios && datosServidor.usuarios.length > 0) {
        // ✅ Mantener TODOS los usuarios del servidor, SOLO asegurar contraseña del admin
        const usuariosCorregidos = datosServidor.usuarios.map(u =>
          u.nick === "admin" ? { ...u, pass: adminFijo.pass } : u
        );
        setDatosApp({ ...datosServidor, usuarios: usuariosCorregidos });
        console.log("✅ CARGADO DEL SERVIDOR —", usuariosCorregidos.length, "usuarios");
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
      if (sesion) {
        try {
          setUsuarioActivo(JSON.parse(sesion));
        } catch {
          localStorage.removeItem("usuarioActivo");
        }
      }
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

    /  //  GUARDAR: ENVIAR LO QUE ESTÁ EN PANTALLA (incluye usuarios nuevos)
  const guardarCambios = async () => {
    try {
      //  NO LEAS DEL SERVIDOR → USA LO QUE YA TIENES EN MEMORIA
      await fetch(API + '/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosApp)  // ← datosApp tiene 2 usuarios: Admin + Irving
      });
      console.log(` GUARDADO EN SERVIDOR CENTRAL — Total: ${datosApp.usuarios.length} usuarios`);
    } catch (err) {
      // ⚠️ Respaldo local si falla el servidor
      localStorage.setItem("datosApp", JSON.stringify(datosApp));
      console.log("⚠️ Guardado localmente como respaldo");
    }
  };
  //  Pantalla de carga mientras se leen los datos del servidor
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
