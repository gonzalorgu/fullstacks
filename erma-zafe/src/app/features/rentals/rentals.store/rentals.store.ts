import { Injectable, computed, signal, inject } from '@angular/core';
import { Rental, RentalService } from '../../../services/rental.service/rental.service';

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

@Injectable({
  providedIn: 'root'
})
export class RentalsStore {
  private rentalService = inject(RentalService);

  private all = signal<Rental[]>([]);
  private pending = signal<Rental[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  q = signal('');
  estado = signal<'todos' | 'activos' | 'pasados' | 'pendientes' | 'cancelados'>('todos');
  desde = signal<string>('');
  hasta = signal<string>('');

  // ✅ COMPUTED: FILTRADOS
  filtered = computed(() => {
    const term = this.q().trim().toLowerCase();
    const est = this.estado();
    const fDesde = this.desde();
    const fHasta = this.hasta();

    const allRentals = [...this.all(), ...this.pending()];

    return allRentals.filter(r => {
      if (term && !`${r.dressNombre} ${r.color ?? ''} ${r.talla ?? ''}`.toLowerCase().includes(term)) {
        return false;
      }
      if (est === 'activos' && r.estado !== 'activo') return false;
      if (est === 'pasados' && r.estado !== 'pasado') return false;
      if (est === 'pendientes' && r.estado !== 'pendiente') return false;
      if (est === 'cancelados' && r.estado !== 'cancelado') return false;
      if (fDesde && r.desde && r.desde < fDesde) return false;
      if (fHasta && r.hasta && r.hasta > fHasta) return false;
      return true;
    });
  });

  // ✅ COMPUTED: POR ESTADO
  activos = computed(() => this.all().filter(r => r.estado === 'activo'));
  pasados = computed(() => this.all().filter(r => r.estado === 'pasado'));
  cancelados = computed(() => this.all().filter(r => r.estado === 'cancelado'));
  pendientes = computed(() => this.pending().filter(r => r.estado === 'pendiente'));

  // ✅ COMPUTED: STATS
  totalActivos = computed(() => this.activos().length);
  totalPasados = computed(() => this.pasados().length);
  totalPendientes = computed(() => this.pendientes().length);
  totalCancelados = computed(() => this.cancelados().length);

  isLoading = computed(() => this.loading());
  errorMsg = computed(() => this.error());

  constructor() {
    this.loadRentals();
    this.loadPendingRentals();
  }

  // ✅ CARGAR ALQUILERES ACTIVOS/PASADOS - RESPETA ESTADO EXISTENTE
  private loadRentals(): void {
    this.loading.set(true);
    this.error.set(null);

    this.rentalService.getMyRentals().subscribe({
      next: (rentals: Rental[]) => {
        console.log('✅ Alquileres cargados:', rentals);

        // ✅ NUEVO: RESPETAR ESTADO EXISTENTE
        const withStatus = rentals.map((r: Rental) => {
          // Si ya tiene estado, mantenlo (pendiente, activo, cancelado, pasado)
          if (r.estado) {
            return r;
          }

          // Si NO tiene estado, calcularlo automáticamente
          const today = todayISO();
          let calculatedState: 'activo' | 'pasado' = 'pasado';

          if (r.hasta && r.hasta >= today) {
            calculatedState = 'activo';
          }

          return {
            ...r,
            estado: calculatedState
          };
        });

        this.all.set(withStatus);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('❌ Error cargando alquileres:', err);
        this.error.set('Error al cargar alquileres');
        this.loading.set(false);
      }
    });
  }

  // ✅ CARGAR ALQUILERES PENDIENTES
  private loadPendingRentals(): void {
    console.log('📍 Cargando alquileres pendientes...');
    this.rentalService.getPendingRentals().subscribe({
      next: (rentals: Rental[]) => {
        console.log('✅ Alquileres pendientes cargados:', rentals);
        this.pending.set(rentals);
      },
      error: (err: any) => {
        console.error('❌ Error cargando alquileres pendientes:', err);
      }
    });
  }

  // ✅ ACCIONES
  setQ(v: string) {
    this.q.set(v);
  }

  setEstado(v: 'todos' | 'activos' | 'pasados' | 'pendientes' | 'cancelados') {
    this.estado.set(v);
  }

  setDesde(v: string) {
    this.desde.set(v);
  }

  setHasta(v: string) {
    this.hasta.set(v);
  }

  cancelarAlquiler(id: string): void {
    this.rentalService.cancelRental(id).subscribe({
      next: () => {
        console.log('✅ Alquiler cancelado');
        this.loadRentals();
      },
      error: (err: any) => {
        console.error('❌ Error cancelando alquiler:', err);
        this.error.set('Error al cancelar alquiler');
      }
    });
  }

  // ✅ RECARGAR TODO
  recargar(): void {
    console.log('🔄 Recargando alquileres...');
    this.loadRentals();
    this.loadPendingRentals();
  }
}
