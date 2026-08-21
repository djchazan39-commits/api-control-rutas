import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsuarioActivo } from '../types';
import { cargarDatos } from '../config/api';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate();
  const usuarioRef = useRef<HTMLInputElement>(null);
  const claveRef = useRef<HTMLInputElement>(null);

  // ✅ Cursor empieza automáticamente en el primer campo
  useEffect(() => {
    usuarioRef.current?.focus();
  }, []);

  // ✅ Enter pasa al siguiente campo
  function pasarAlSiguiente(e: React.KeyboardEvent<HTMLInputElement>, siguiente?: React.RefObject<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      siguiente?.current?.focus();
    }
  }

  // ✅ Función para ingresar
  async function ingresar(e: React.FormEvent) {
    e.preventDefault();
    const datosServidor = await cargarDatos();
    if (!datosServidor) {
      return alert('❌ No hay conexión con el servidor');
    }

    let usuarioActivo: UsuarioActivo | null = null;
    const u = datosServidor.usuarios.find(x => x.nick === usuario && x.pass === clave);
    if (u) {
      usuarioActivo = { id: u.id, nombre: u.nombre, rol: u.rol, nick: u.nick };
    } else {
      const op = datosServidor.operadores.find(x => x.nick === usuario && x.pass === clave);
      if (op) {
        usuarioActivo = { id: op.id, nombre: op.nombre, rol: 'operador', nick: op.nick };
      }
    }

    if (!usuarioActivo) {
      return alert('❌ Usuario o contraseña incorrectos');
    }

    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
    localStorage.setItem('datosApp', JSON.stringify(datosServidor));
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-red-950/80 border-2 border-red-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        
        {/* LOGOTIPO */}
        <div className="text-center mb-6">
          <img 
            src="/logo.png" 
            alt="Logotipo de la Empresa" 
            className="mx-auto h-24 w-auto object-contain mb-3"
          />
          <p className="text-sm text-gray-400">Control de Rutas Sierra Querétaro</p>
        </div>

        {/* ✅ SOLO USUARIO, CONTRASEÑA E INGRESAR — SIN BOTÓN DE SALIR */}
        <form onSubmit={ingresar} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Usuario</label>
            <input
              ref={usuarioRef}
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              onKeyDown={(e) => pasarAlSiguiente(e, claveRef)}
              className="w-full p-3 rounded-lg bg-black border border-red-800 focus:border-red-500 outline-none"
              placeholder="Escribe tu usuario"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Contraseña</label>
            <input
              ref={claveRef}
              type="password"
              value={clave}
              onChange={e => setClave(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ingresar(e as any)}
              className="w-full p-3 rounded-lg bg-black border border-red-800 focus:border-red-500 outline-none"
              placeholder="Escribe tu contraseña"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-600 p-3 rounded-lg font-bold transition"
          >
            🔑 Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}