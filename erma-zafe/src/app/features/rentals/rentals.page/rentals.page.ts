import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalsStore } from '../rentals.store/rentals.store';
import { RentalCard } from '../rental-card/rental-card';

@Component({
  selector: 'app-rentals.page',
  standalone: true,
  imports: [RentalCard, CommonModule],
  templateUrl: './rentals.page.html',
  styleUrl: './rentals.page.scss'
})
export class RentalsPage {
  store = inject(RentalsStore);

  // ✅ BUSCAR POR NOMBRE
  onQ(e: Event) {
    this.store.setQ((e.target as HTMLInputElement).value);
  }

  // ✅ FILTRAR POR ESTADO
  onEstado(e: Event) {
    this.store.setEstado((e.target as HTMLSelectElement).value as any);
  }

  // ✅ RANGO DE FECHAS RÁPIDO (30 o 90 días)
  setQuickRange(kind: '30d' | '90d') {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const from = new Date(now);
    from.setDate(now.getDate() - (kind === '30d' ? 30 : 90));

    const iso = (d: Date) => d.toISOString().slice(0, 10);
    this.store.setDesde(iso(from));
    this.store.setHasta(iso(now));
  }

  // ✅ NUEVO: BOTÓN ACTUALIZAR - RECARGA LOS DATOS
  recargar() {
    console.log('🔄 Recargando alquileres...');
    this.store.recargar();
  }
}
