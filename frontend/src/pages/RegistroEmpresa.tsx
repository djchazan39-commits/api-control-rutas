import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

export default function RegistroEmpresa() {
  const navegar = useNavigate();
  const [paso, setPaso] = useState(1);
  const [empresa, setEmpresa] = useState({ nombre: '', direccion: '', telefono: '', correo: '' });
  const [admin, setAdmin] = useState({ nombre: '', usuario: '', clave: '' });
  const [licencia, setLicencia] = useState({ clavePublica: '', clavePrivada: '', tipo: 'LOCAL' as 'LOCAL' | 'BPS' });

  async function registrar() {
    try {
      await axios.post(`${API}/registro-empresa`, {
        empresa,
        administrador: admin,
        licenciaClavePublica: licencia.clavePublica,
        licenciaClavePrivada: licencia.clavePrivada,
        licenciaTipo: licencia.tipo
      });
      alert('✅ ¡Empresa registrada! Ahora inicia sesión');
      navegar('/');
    } catch (e: any) {
      alert('❌ Error: ' + (e.response?.data?.error || e.message));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-red-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-red-300 mb-6">🚛 Registro de Empresa</h1>

        {paso === 1 && (<>
          <h2 className="text-lg font-semibold text-white mb-4">1. Datos de la Empresa</h2>
          <input className="w-full p-3 mb-3 bg-black border border-red-800 rounded-lg text-white" placeholder="Nombre de la empresa" value={empresa.nombre} onChange={e => setEmpresa({ ...empresa, nombre: e.target.value })} />
          <input className="w-full p-3 mb-3 bg-black border border-red-800 rounded-lg text-white" placeholder="Dirección" value={empresa.direccion} onChange={e => setEmpresa({ ...empresa, direccion: e.target.value })} />
          <input className="w-full p-3 mb-3 bg-black border border-red-800 rounded-lg text-white" placeholder="Correo" value={empresa.correo} onChange={e => setEmpresa({ ...empresa, correo: e.target.value })} />
          <button className="w-full bg-red-700 text-white p-3 rounded-lg font-bold hover:bg-red-600" onClick={() => setPaso(2)}>Continuar →</button>
        </>)}

        {paso === 2 && (<>
          <h2 className="text-lg font-semibold text-white mb-4">2. Usuario Administrador</h2>
          <input className="w-full p-3 mb-3 bg-black border border-red-800 rounded-lg text-white" placeholder="Nombre completo" value={admin.nombre} onChange={e => setAdmin({ ...admin, nombre: e.target.value })} />
          <input className="w-full p-3 mb-3 bg-black border border-red-800 rounded-lg text-white" placeholder="Usuario de acceso" value={admin.usuario} onChange={e => setAdmin({ ...admin, usuario: e.target.value })} />
          <input type="password" className="w-full p-3 mb-3 bg-black border border-red-800 rounded-lg text-white" placeholder="Contraseña" value={admin.clave} onChange={e => setAdmin({ ...admin, clave: e.target.value })} />
          <div className="flex gap-2">
            <button className="flex-1 bg-gray-700 text-white p-3 rounded-lg" onClick={() => setPaso(1)}>← Atrás</button>
            <button className="flex-1 bg-red-700 text-white p-3 rounded-lg font-bold hover:bg-red-600" onClick={() => setPaso(3)}>Continuar →</button>
          </div>
        </>)}

        {paso === 3 && (<>
          <h2 className="text-lg font-semibold text-white mb-4">3. Licencia de Uso</h2>
          <select className="w-full p-3 mb-3 bg-black border border-red-800 rounded-lg text-white" value={licencia.tipo} onChange={e => setLicencia({ ...licencia, tipo: e.target.value as any })}>
            <option value="LOCAL">🏠 Servicio Local</option>
            <option value="BPS">☁️ Servicio en la Nube</option>
          </select>
          <input className="w-full p-3 mb-3 bg-black border border-red-800 rounded-lg text-white" placeholder="Clave Pública" value={licencia.clavePublica} onChange={e => setLicencia({ ...licencia, clavePublica: e.target.value.toUpperCase() })} />
          <input className="w-full p-3 mb-3 bg-black border border-red-800 rounded-lg text-white" placeholder="Clave Privada" value={licencia.clavePrivada} onChange={e => setLicencia({ ...licencia, clavePrivada: e.target.value })} />
          <div className="flex gap-2">
            <button className="flex-1 bg-gray-700 text-white p-3 rounded-lg" onClick={() => setPaso(2)}>← Atrás</button>
            <button className="flex-1 bg-green-700 text-white p-3 rounded-lg font-bold hover:bg-green-600" onClick={registrar}>✅ Crear Empresa</button>
          </div>
        </>)}

        <p className="text-gray-400 text-center mt-4 text-sm">¿Ya tienes cuenta? <a href="/" className="text-red-400 underline">Iniciar Sesión</a></p>
      </div>
    </div>
  );
}