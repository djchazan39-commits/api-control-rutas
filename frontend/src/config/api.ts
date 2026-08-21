import { DatosApp } from '../types';

// Usar variable de entorno o por defecto localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Cargar datos desde el servidor
export async function cargarDatos(): Promise<DatosApp | null> {
  try {
    const res = await fetch(`${API_URL}/datos`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('Error al cargar');
    return await res.json();
  } catch (err) {
    console.warn('⚠️ No se pudo conectar al servidor');
    return null;
  }
}

// Guardar datos en el servidor
export async function guardarDatos(datos: DatosApp): Promise<boolean> {
  try {
    datos.actualizado = new Date().toISOString();
    const res = await fetch(`${API_URL}/datos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
      signal: AbortSignal.timeout(8000)
    });
    return res.ok;
  } catch (err) {
    console.warn('⚠️ No se pudo sincronizar con el servidor');
    return false;
  }
}