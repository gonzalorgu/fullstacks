import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string;
  nombre: string;
  imagen: string;
  precio: number;
  // Se elimina el tipo venta
  //tipo: 'venta' | 'alquiler';
  fechaDesde?: string;  // Fecha desde para alquiler
  fechaHasta?: string;  // Fecha hasta para alquiler
  talla?: string;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _items = signal<CartItem[]>([]);

  items = this._items.asReadonly();

  cartCount = computed(() => this._items().length);

  total = computed(() =>
    this._items().reduce((sum, item) => sum + item.precio, 0)
  );

  addToCart(item: CartItem) {
    const exists = this._items().some(i => i.id === item.id);

    if (!exists) {
      this._items.update(items => [...items, item]);
      console.log('✅ Agregado al carrito:', item.nombre);
    } else {
      console.log('⚠️ Ya existe en el carrito');
    }
  }

  removeFromCart(id: string) {
    this._items.update(items => items.filter(i => i.id !== id));
    console.log('🗑️ Eliminado del carrito:', id);
  }

  clearCart() {
    this._items.set([]);
    console.log('🗑️ Carrito vaciado');
  }

  isInCart(id: string): boolean {
    return this._items().some(item => item.id === id);
  }
}
