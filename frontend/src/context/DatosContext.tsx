import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface DatosApp {
  usuarios: Array<{
    id: number;
    nombre: string;
    rol: string;
    nick: string;
    pass: string;
    esFijo?: boolean;
  }>;
  operadores: Array<{
    id: number;
    nombre: string;
    licenciaTipo: string;
    licenciaClase: string;
    licenciaVence: string;
    telefono: string;
  }>;
  unidades: Array<{
    id: number;
    placa: string;
    marca: string;
    modelo: string;
    capacidad: string;
  }>;
  clientes: Array<{
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    latitud: string;
    longitud: string;
  }>;
  rutas: Array<{
    id: number;
    nombre: string;
    zona: string;
    operadorId: string | number;
    unidadId: string | number;
    ordenClientes: Array<number>;
    fechaCreacion?: string;
  }>;
  entregas: Array<{
    id: number;
    clienteId: number;
    fecha: string;
    operador: string;
    estado: string;
    pago: string;
    observaciones: string;
  }>;
  combustible: Array<{
    id: number;
    fecha: string;
    unidadId: string | number;
    kmInicial: string;
    kmFinal: string;
    litros: string;
    importe: string;
    rendimiento: string;
    registradoPor: string;
    fechaHora: string;
  }>;
}

interface ContextoDatos {
  datosApp: DatosApp;
  setDatosApp: (datos: DatosApp | ((prev: DatosApp) => DatosApp)) => void;
  guardarCambios: () => void;
  usuarioActivo: any;
  iniciarSesion: (nick: string, pass: string) => boolean;
  cerrarSesion: () => void;
  cargarDatos: () => void;
  enviarAlerta: (mensaje: string) => void;
  puedeVer: (modulo: string) => boolean;
}

// 🔑 USUARIO ADMINISTRADOR FIJO — NUNCA SE BORRA NI SE EDITA
const USUARIO_ADMIN_FIJO = {
  id: 1,
  nombre: "Administrador Principal",
  rol: "administrador",
  nick: "admin",
  pass: "admin1530",
  esFijo: true
};

const DATOS_INICIALES: DatosApp = {
  usuarios: [USUARIO_ADMIN_FIJO],
  operadores: [],
  unidades: [],
  clientes: [],
  rutas: [],
  entregas: [],
  combustible: []
};

const Contexto = createContext<ContextoDatos | undefined>(undefined);

export function ProveedorDatos({ children }: { children: ReactNode }) {
  const [datosApp, setDatosApp] = useState<DatosApp>(DATOS_INICIALES);
  const [usuarioActivo, setUsuarioActivo] = useState<any>(null);

  // ✅ PERMISOS POR ROL
  const permisos = {
    administrador: ["usuarios", "operadores", "unidades", "clientes", "rutas", "seguimiento", "mi-ruta", "combustible", "reportes", "respaldo"],
    director: ["usuarios", "operadores", "unidades", "clientes", "rutas", "seguimiento", "mi-ruta", "combustible", "reportes", "respaldo"],
    logistica: ["operadores", "unidades", "clientes", "rutas", "seguimiento", "mi-ruta", "combustible", "reportes"],
    operador: ["mi-ruta", "combustible"]
  };

  const puedeVer = (modulo: string) => {
    if (!usuarioActivo) return false;
    return permisos[usuarioActivo.rol as keyof typeof permisos]?.includes(modulo) ?? false;
  };

  const cargarDatos = () => {
    try {
      const guardado = localStorage.getItem("datosApp");
      if (guardado) {
        const datosGuardados = JSON.parse(guardado);
        // ✅ ASEGURA QUE EL ADMIN FIJO SIEMPRE EXISTA
        const sinAdmin = datosGuardados.usuarios.filter((u: any) => !u.esFijo && u.id !== 1);
        datosGuardados.usuarios = [USUARIO_ADMIN_FIJO, ...sinAdmin];
        setDatosApp(datosGuardados);
      }
    } catch (err) {
      console.error("⚠️ Error al cargar datos:", err);
    }
  };

  const guardarCambios = () => {
    try {
      // ✅ EVITA QUE SE BORRE O MODIFIQUE EL ADMIN FIJO
      setDatosApp((prev) => {
        const sinAdmin = prev.usuarios.filter((u) => !u.esFijo && u.id !== 1);
        const nuevosUsuarios = [USUARIO_ADMIN_FIJO, ...sinAdmin];
        const datosGuardar = { ...prev, usuarios: nuevosUsuarios };
        localStorage.setItem("datosApp", JSON.stringify(datosGuardar));
        return prev;
      });
    } catch (err) {
      console.error("⚠️ Error al guardar:", err);
    }
  };

  const enviarAlerta = (mensaje: string) => {
    console.log("🔔 ALERTA DEL SISTEMA:", mensaje);
    alert("🔔 NOTIFICACIÓN:\n" + mensaje);
  };

  const iniciarSesion = (nick: string, pass: string): boolean => {
    const usuario = datosApp.usuarios.find(
      (u) => u.nick === nick && u.pass === pass
    );
    if (usuario) {
      setUsuarioActivo(usuario);
      return true;
    }
    return false;
  };

  const cerrarSesion = () => {
    setUsuarioActivo(null);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    try {
      const sinAdmin = datosApp.usuarios.filter((u) => !u.esFijo && u.id !== 1);
      const datosGuardar = { ...datosApp, usuarios: [USUARIO_ADMIN_FIJO, ...sinAdmin] };
      localStorage.setItem("datosApp", JSON.stringify(datosGuardar));
    } catch (err) {}
  }, [datosApp]);

  return (
    <Contexto.Provider
      value={{
        datosApp,
        setDatosApp,
        guardarCambios,
        usuarioActivo,
        iniciarSesion,
        cerrarSesion,
        cargarDatos,
        enviarAlerta,
        puedeVer
      }}
    >
      {children}
    </Contexto.Provider>
  );
}

export function useDatos() {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useDatos debe usarse dentro de ProveedorDatos");
  }
  return contexto;
}