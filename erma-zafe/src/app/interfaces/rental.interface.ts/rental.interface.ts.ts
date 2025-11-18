export interface Rental {
  id: string;
  dressId: string;
  dressNombre: string;
  foto: string;
  desde: string;
  hasta: string;
  precioAlquiler: number;
  talla: string;
  color: string;
  estado?: 'activo' | 'pasado' | 'cancelado';
  createdAt?: string;
  clienteNombre?: string;  // ✅ AGREGAR
  clienteEmail?: string;   // ✅ AGREGAR
}
