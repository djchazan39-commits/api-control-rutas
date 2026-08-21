import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsuarioActivo } from '../types';
import { cargarDatos } from '../config/api';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate();

  async function ingresar(e: React.FormEvent) {
    e.preventDefault();
    const datosServidor = await cargarDatos();
    if (!datosServidor) {
      return alert('❌ No hay conexión con el servidor');
    }

    let usuarioActivo: UsuarioActivo | null = null;

    // Buscar en usuarios del sistema
    const u = datosServidor.usuarios.find(x => x.nick === usuario && x.pass === clave);
    if (u) {
      usuarioActivo = { id: u.id, nombre: u.nombre, rol: u.rol, nick: u.nick };
    } else {
      // Buscar en operadores
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

  function salirCompleto() {
    localStorage.clear();
    alert('✅ Se cerró todo completamente');
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-red-950/80 border-2 border-red-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-red-200">🚛 Control de Rutas</h1>
        
        <form onSubmit={ingresar} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              className="w-full p-3 rounded-lg bg-black border border-red-800 focus:border-red-500 outline-none"
              placeholder="Escribe tu usuario"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Contraseña</label>
            <input
              type="password"
              value={clave}
              onChange={e => setClave(e.target.value)}
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
          
          <button
            type="button"
            onClick={salirCompleto}
            className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg font-semibold transition mt-2"
          >
            🚪 Salir completamente
          </button>
        </form>
      </div>
    </div>
  );
}