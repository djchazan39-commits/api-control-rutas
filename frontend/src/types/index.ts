export interface Usuario {
  id: number;
  nombre: string;
  rol: 'administrador' | 'director' | 'logistica' | 'operador';
  nick: string;
  pass: string;
}

export interface Operador {
  id: number;
  nombre: string;
  licencia?: string;
  vencimiento?: string;
  telefono?: string;
  nick: string;
  pass: string;
}

export interface Unidad {
  id: number;
  placa: string;
  modelo: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  direccion?: string;
  lat: number;
  lon: number;
}

export interface Ruta {
  id: number;
  nombre: string;
  idOperador: number;
  idUnidad: number;
  ordenClientes: number[];
}

export interface Entrega {
  id: number;
  idOperador: number;
  idCliente: number;
  estado: 'entregado' | 'incompleto' | 'norecibido';
  observaciones?: string;
  fecha: string;
  lat?: number;
  lon?: number;
}

export interface Combustible {
  id: number;
  idOperador: number;
  kmIni: number;
  kmFin: number;
  litros: number;
  costo: number;
  fecha: string;
}

export interface DatosApp {
  usuarios: Usuario[];
  operadores: Operador[];
  unidades: Unidad[];
  clientes: Cliente[];
  rutas: Ruta[];
  entregas: Entrega[];
  combustible: Combustible[];
  ubicaciones: { idOperador: number; lat: number; lon: number; fecha: string }[];
  actualizado?: string;
}

export interface UsuarioActivo {
  id: number;
  nombre: string;
  rol: string;
  nick: string;
}