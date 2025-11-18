import { Injectable, signal, computed } from '@angular/core';

// Tipo de ítems que se guardarán en el carrito
export type CartMode = 'venta' | 'alquiler';

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  modo: CartMode;
}

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly items = signal<CartItem[]>([]);

  // Computed signals
  readonly count = computed(() => this.items().length);
  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.precio, 0)
  );

  add(item: CartItem) {
    this.items.update(arr => [...arr, item]);
  }

  remove(id: string) {
    this.items.update(arr => arr.filter(i => i.id !== id));
  }

  clear() {
    this.items.set([]);
  }

  getAll() {
    return this.items();
  }
}
