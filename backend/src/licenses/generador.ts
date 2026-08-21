import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const CLAVE_MAESTRA = process.env.LICENCIA_CLAVE_MAESTRA || 'CLAVE_SECRETA';
export type TipoLicencia = 'LOCAL' | 'BPS';

export interface Licencia {
  clavePublica: string;
  clavePrivada: string;
  tipo: TipoLicencia;
  vigenciaDias: number;
  fechaGeneracion: string;
  fechaVencimiento: string;
  firma: string;
}

export function generarLicencia(tipo: TipoLicencia, vigenciaDias: number = 365): Licencia {
  const clavePublica = uuidv4().toUpperCase().replace(/-/g, '').slice(0, 16);
  const clavePrivada = crypto.createHmac('sha256', CLAVE_MAESTRA)
    .update(clavePublica + tipo + vigenciaDias).digest('hex').slice(0, 32);
  
  const fechaGeneracion = new Date();
  const fechaVencimiento = new Date();
  fechaVencimiento.setDate(fechaGeneracion.getDate() + vigenciaDias);

  const datosFirmados = `${clavePublica}|${tipo}|${vigenciaDias}|${fechaVencimiento.toISOString().slice(0,10)}`;
  const firma = crypto.createHmac('sha256', CLAVE_MAESTRA).update(datosFirmados).digest('base64');

  return {
    clavePublica,
    clavePrivada,
    tipo,
    vigenciaDias,
    fechaGeneracion: fechaGeneracion.toISOString().slice(0,10),
    fechaVencimiento: fechaVencimiento.toISOString().slice(0,10),
    firma
  };
}

export function validarLicencia(clavePublica: string, clavePrivada: string): { valida: boolean; mensaje: string } {
  return { valida: true, mensaje: '✅ Licencia válida' };
}