import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DatosApp, UsuarioActivo } from '../types';
import { cargarDatos, guardarDatos as guardarDatosApi } from '../config/api';

interface DatosContextType {
  datos: DatosApp;
  setDatos: React.Dispatch<React.SetStateAction<DatosApp>>;
  usuarioActivo: UsuarioActivo | null;
  cargarSistema: () => Promise<void>;
  guardarCambios: () => Promise<void>;
  cerrarSesion: () => void;
}

const DatosContext = createContext<DatosContextType | undefined>(undefined);

const inicialDatos: DatosApp = {
  usuarios: [{ id: 1, nombre: 'Administrador', rol: 'administrador', nick: 'admin', pass: '123456' }],
  operadores: [], unidades: [], clientes: [], rutas: [], entregas: [], combustible: [], ubicaciones: []
};

export function DatosProvider({ children }: { children: ReactNode }) {
  const [datos, setDatos] = useState<DatosApp>(inicialDatos);
  const [usuarioActivo, setUsuarioActivo] = useState<UsuarioActivo | null>(null);

  useEffect(() => {
    const guardado = localStorage.getItem('usuarioActivo');
    if (guardado) {
      setUsuarioActivo(JSON.parse(guardado));
      const local = localStorage.getItem('datosApp');
      if (local) setDatos(JSON.parse(local));
      cargarSistema();
    }
  }, []);

  async function cargarSistema() {
    const desdeServidor = await cargarDatos();
    if (desdeServidor) {
      setDatos(desdeServidor);
      localStorage.setItem('datosApp', JSON.stringify(desdeServidor));
    }
  }

  async function guardarCambios() {
    const ok = await guardarDatosApi(datos);
    localStorage.setItem('datosApp', JSON.stringify(datos));
    return ok;
  }

  function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    localStorage.removeItem('datosApp');
    setUsuarioActivo(null);
    window.location.href = '/login';
  }

  return (
    <DatosContext.Provider value={{ datos, setDatos, usuarioActivo, cargarSistema, guardarCambios, cerrarSesion }}>
      {children}
    </DatosContext.Provider>
  );
}

export function useDatos() {
  const ctx = useContext(DatosContext);
  if (!ctx) throw new Error('useDatos debe usarse dentro de DatosProvider');
  return ctx;
}