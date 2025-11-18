// ✅ TIPOS PARA VESTIDOS (sin lógica de venta directa)
export interface Dress {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  talla: string[];
  color: string;
  colors?: string[];  // ✅ Si quieres manejar múltiples colores
  precioAlquiler: number;
  fotos: string[];
  condition: 'como-nuevo' | 'muy-buen-estado' | 'buen-estado';
  disponible: boolean;
  etiquetas: string[];
}

// ✅ TIPOS PARA ALQUILERES
export type EstadoRental = 'activo' | 'pasado' | 'cancelado' | 'pendiente' | 'retrasado';

export interface Rental {
  // ✅ CAMPO ID COMPATIBLE (acepta string, number o undefined)
  id?: string | number;

  // Campos principales
  dressId?: string;
  dressNombre?: string;
  foto?: string;
  desde?: string;
  hasta?: string;
  precioAlquiler?: number;
  estado?: EstadoRental;
  talla?: string;
  color?: string;

  // ✅ Campos adicionales del backend
  user_id?: number;
  user?: {
    id?: number;
    email?: string;
    name?: string;
  };
  clienteNombre?: string;
  clienteEmail?: string;
  dress_id?: number;
  start_date?: string;
  end_date?: string;
  total_cost?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  cliente?: string;
  clienteId?: number;
  vestido?: string;
  vestidoId?: number;
  precio?: number;
  fechaCreacion?: Date;
  notas?: string;

  // ✅ NUEVOS CAMPOS PARA PENALIZACIÓN
  diasRetraso?: number;
  penalizacion?: number;
  fechaDevolucionReal?: string;
}

// ✅ TIPOS PARA USUARIO
export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
}
