const API = 'http://localhost:10000/api';
export async function cargarDatos() {
  try {
    const resp = await fetch(API + '/datos');
    if (resp.ok) {
      return await resp.json();
    }
  } catch {
    console.log('Servidor no disponible');
  }

  const guardados = localStorage.getItem('datosApp');
  if (guardados) {
    return JSON.parse(guardados);
  }

  return {
    usuarios: [
      { id: 1, nombre: 'Administrador', rol: 'administrador', nick: 'admin', pass: 'admin1530' }
    ],
    operadores: [],
    unidades: [],
    clientes: [],
    rutas: [],
    entregas: [],
    combustible: [],
    ubicaciones: []
  };
}

export { API };