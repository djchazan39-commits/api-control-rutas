import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { DatosApp, UsuarioActivo } from '../types';

interface ContextoDatos {
  datos: DatosApp;
  setDatos: React.Dispatch<React.SetStateAction<DatosApp>>;
  usuarioActivo: UsuarioActivo | null;
  guardarCambios: () => Promise<void>;
}

const DatosContext = createContext<ContextoDatos | undefined>(undefined);

// USUARIO ADMINISTRADOR POR DEFECTO — NUNCA SE BORRA ⬇️
const datosIniciales: DatosApp = {
  usuarios: [
    {
      id: 1,
      nombre: 'Administrador',
      rol: 'administrador',
      nick: 'admin',
      pass: 'admin1530'
    }
  ],
  operadores: [],
  unidades: [],
  clientes: [],
  rutas: [],
  entregas: [],
  combustible: [],
  ubicaciones: [],
  actualizado: new Date().toISOString()
};

export function DatosProvider({ children }: { children: ReactNode }) {
  const [datos, setDatos] = useState<DatosApp>(datosIniciales);
  const [usuarioActivo, setUsuarioActivo] = useState<UsuarioActivo | null>(null);

  useEffect(() => {
    const sesion = localStorage.getItem('usuarioActivo');
    const guardados = localStorage.getItem('datosApp');
    if (sesion) setUsuarioActivo(JSON.parse(sesion));
    if (guardados) {
      const parsed: DatosApp = JSON.parse(guardados);
      // ASEGURAR QUE EL ADMIN SIEMPRE EXISTA AL CARGAR ⬇️
      const existeAdmin = parsed.usuarios.some(u => u.nick === 'admin');
      if (!existeAdmin) {
        parsed.usuarios.unshift({ id: 1, nombre: 'Administrador', rol: 'administrador', nick: 'admin', pass: 'admin1530' });
      }
      setDatos(parsed);
    }
  }, []);

  const guardarCambios = async (): Promise<void> => {
    setDatos(prev => {
      const actualizado: DatosApp = {
        ...prev,
        actualizado: new Date().toISOString()
      };
      // PROTEGER EL USUARIO ADMIN SIEMPRE ⬇️
      const sinAdmin = actualizado.usuarios.filter(u => u.nick !== 'admin');
      actualizado.usuarios = [
        { id: 1, nombre: 'Administrador', rol: 'administrador', nick: 'admin', pass: 'admin1530' },
        ...sinAdmin
      ];
      localStorage.setItem('datosApp', JSON.stringify(actualizado));
      return actualizado;
    });
  };

  return (
    <DatosContext.Provider value={{ datos, setDatos, usuarioActivo, guardarCambios }}>
      {children}
    </DatosContext.Provider>
  );
}

export function useDatos() {
  const ctx = useContext(DatosContext);
  if (!ctx) throw new Error('Falta DatosProvider');
  return ctx;
}