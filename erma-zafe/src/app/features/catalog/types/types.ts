export type Condition = 'nuevo' | 'como-nuevo' | 'usado';

export interface Dress {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;         // p.ej. 'novia' | 'gala' | 'quinceañera'
  talla: string[];           // Ej: ["S","M","L"]
  color: string;
  colors?: string[];         // Si deseas múltiples colores por cada vestido
  precioAlquiler: number;    // Solo alquiler
  fotos: string[];
  condition: Condition;
  disponible: boolean;
  etiquetas?: string[];
}
