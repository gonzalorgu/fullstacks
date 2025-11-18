import { Injectable, signal, WritableSignal } from '@angular/core';

export interface Vestido {
  id?: number;
  name?: string;
  size?: string[];
  color?: string;
  colors?: string[];
  status?: string;
  rental_price?: number;
  description?: string;
  imagen?: string;
  quantity?: number;
  isActive?: boolean; // ✅ Campo agregado
  catalog_id?: number;
  created_at?: Date;
  update_at?: Date;
  disponible?: boolean;
  categoria?: string;
  precioVenta?: number;
}

@Injectable({ providedIn: 'root' })
export class VestidosStore {
  private _vestidos: WritableSignal<Vestido[]> = signal([]);
  private _loading: WritableSignal<boolean> = signal(false);

  vestidos = this._vestidos.asReadonly();
  loading = this._loading.asReadonly();

  setVestidos(vestidos: Vestido[]): void {
    this._vestidos.set(vestidos);
    this._loading.set(false);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  addVestido(vestido: Vestido): void {
    this._vestidos.update(vestidos => [...vestidos, vestido]);
  }

  updateVestido(id: number, changes: Partial<Vestido>): void {
    this._vestidos.update(vestidos =>
      vestidos.map(v => v.id === id ? { ...v, ...changes } : v)
    );
  }

  removeVestido(id: number): void {
    this._vestidos.update(vestidos => vestidos.filter(v => v.id !== id));
  }

  // ✅ NUEVO: Obtener vestido por ID
  getVestidoById(id: number): Vestido | undefined {
    return this._vestidos().find(v => v.id === id);
  }
}
