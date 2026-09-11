// ✅ AHORA (tu servidor central):
const API = 'https://sierra-queretaro.onrender.com/api';

export async function cargarDatos() {
  try {
    const resp = await fetch(API + '/datos');
    if (resp.ok) {
      const datos = await resp.json();
      // ✅ FORZAMOS LA CONTRASEÑA AQUÍ PARA QUE COINCIDA SIEMPRE
      datos.usuarios = datos.usuarios.map(u => {
        if (u.nick === 'admin') {
          return { ...u, pass: 'admin1530' };
        }
        return u;
      });
      return datos;
    }
  } catch {
    console.log('Servidor no disponible');
  }
  // ✅ DATOS POR DEFECTO — CONTRASEÑA FIJA
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

// ✅ FUNCIÓN DE GUARDAR — MISMA RUTA /api/datos
export async function guardarDatos(datos: any) {
  try {
    const resp = await fetch(API + '/datos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (resp.ok) {
      console.log("GUARDADO EN SERVIDOR CENTRAL — Total:", datos.usuarios.length, "usuarios");
      return true;
    }
  } catch {
    console.log('Servidor no disponible — guardado local');
    localStorage.setItem("datosApp", JSON.stringify(datos));
  }
  return false;
}

export { API };
