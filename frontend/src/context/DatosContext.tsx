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

// 🔹 USUARIO ADMINISTRADOR FIJO (NUNCA SE BORRA NI SE PIERDE CONTRASEÑA)
const adminFijo = {
  id: 1,
  nombre: "Administrador",
  rol: "administrador" as const,
  nick: "admin",
  pass: "admin1530",
  esFijo: true
};

export function DatosProvider({ children }: { children: ReactNode }) {
  // ✅ INICIA VACÍO — DESPUÉS LO CARGA DEL SERVIDOR
  const [datosApp, setDatosApp] = useState<DatosApp | null>(null);
  const [usuarioActivo, setUsuarioActivo] = useState<UsuarioActivo | null>(null);

  useEffect(() => {
    const cargar = async () => {
      console.log("🔄 Cargando datos desde el servidor...");
      const datosCargados = await cargarDatos();

      if (datosCargados && datosCargados.usuarios) {
        // ✅ Mantener todos los usuarios, SOLO asegurar el admin con su contraseña
        const sinAdmin = datosCargados.usuarios.filter(u => u.id !== 1);
        datosCargados.usuarios = [adminFijo, ...sinAdmin];
        setDatosApp(datosCargados);
        console.log("✅ Datos cargados del servidor — usuarios:", datosCargados.usuarios.length);
      } else {
        // ✅ Si el servidor está vacío → iniciar con el administrador
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
        console.log("⚠️ Servidor vacío — iniciando con administrador");
      }

      const guardado = localStorage.getItem("usuarioActivo");
      if (guardado) {
        setUsuarioActivo(JSON.parse(guardado));
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

  const guardarCambios = async () => {
    if (!datosApp) return;

    try {
      // ✅ ANTES DE GUARDAR: Asegurar que el admin SIEMPRE tenga su contraseña correcta
      const datosAGuardar = { ...datosApp };
      const sinAdmin = datosAGuardar.usuarios.filter(u => u.id !== 1);
      datosAGuardar.usuarios = [adminFijo, ...sinAdmin];

      // ✅ Enviar al SERVIDOR CENTRAL
      const respuesta = await fetch(API + '/datos', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosAGuardar)
      });

      if (respuesta.ok) {
        console.log("✅ GUARDADO EXITOSAMENTE EN EL SERVIDOR CENTRAL");
      } else {
        console.log("⚠️ El servidor respondió con error:", respuesta.status);
      }
    } catch (error) {
      // ✅ Si no hay internet, guarda en respaldo local
      localStorage.setItem("datosApp", JSON.stringify(datosApp));
      console.log("⚠️ Guardado temporalmente en el dispositivo (sin internet)");
    }
  };

  // ✅ No mostrar nada hasta que los datos estén cargados
  if (!datosApp) {
    return <div style={{color:'white',padding:'2rem',textAlign:'center'}}>Cargando sistema...</div>;
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

// ✅ HOOK CORREGIDO
export function useDatos() {
  const contexto = useContext(DatosContext);
  if (!contexto) {
    throw new Error("useDatos debe usarse dentro de <DatosProvider>");
  }
  return contexto;
}