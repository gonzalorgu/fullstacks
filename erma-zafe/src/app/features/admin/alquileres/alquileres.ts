import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { RentalService, Rental } from '../../../services/rental';
import { AlquileresForm } from './alquileres.form/alquileres.form';
import { forkJoin } from 'rxjs';
import { UserService } from '../../../services/user.service/user.service';
import { DressService } from '../../../services/dress';
import { VestidosStore } from '../vestidos/vestidos.store/vestidos.store';
import { ConfirmService } from '../../../services/confirm/confirm'; // <-- Agregado

@Component({
  selector: 'app-alquileres',
  imports: [CommonModule, FormsModule],
  templateUrl: './alquileres.html',
  styleUrls: ['./alquileres.scss']
})
export class Alquileres implements OnInit {
  private rentalService = inject(RentalService);
  private dialog = inject(Dialog);
  private userService = inject(UserService);
  private dressService = inject(DressService);
  private vestidosStore = inject(VestidosStore);
  private confirmService = inject(ConfirmService); // <-- Agregado

  Math = Math;
  readonly PENALIZACION_POR_DIA = 10;

  rows = signal<Rental[]>([]);
  alquileresFiltrados = signal<Rental[]>([]);
  searchTerm = signal('');
  filtroEstado = signal<string>('todos');
  ordenPor = signal<'fecha' | 'cliente' | 'estado'>('fecha');
  cargando = signal(false);
  error = signal<string | null>(null);

  private clientesCache = signal<any[]>([]);
  private vestidosCache = signal<any[]>([]);

  paginaActual = signal(1);
  itemsPorPagina = signal(10);

  totalPaginas = computed(() => {
    return Math.ceil(this.alquileresFiltrados().length / this.itemsPorPagina());
  });

  alquileresPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina();
    const fin = inicio + this.itemsPorPagina();
    return this.alquileresFiltrados().slice(inicio, fin);
  });

  paginasVisibles = computed(() => {
    const total = this.totalPaginas();
    const actual = this.paginaActual();
    const paginas: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        paginas.push(i);
      }
    } else {
      if (actual <= 4) {
        paginas.push(1, 2, 3, 4, 5);
      } else if (actual >= total - 3) {
        paginas.push(total - 4, total - 3, total - 2, total - 1, total);
      } else {
        paginas.push(actual - 2, actual - 1, actual, actual + 1, actual + 2);
      }
    }

    return paginas;
  });

  estadosDisponibles = [
    { value: 'todos', label: 'Todos los estados', color: '#6c757d' },
    { value: 'activo', label: 'Activo', color: '#28a745' },
    { value: 'pendiente', label: '🔔 Pendiente', color: '#ff9800' },
    { value: 'retrasado', label: '⚠️ Retrasado', color: '#e74c3c' },
    { value: 'pasado', label: 'Pasado', color: '#ffc107' },
    { value: 'cancelado', label: 'Cancelado', color: '#dc3545' }
  ];

  alquileresRetrasados = computed(() => {
    return this.rows().filter(a => this.estaRetrasado(a) || a.estado === 'retrasado');
  });

  totalPenalizaciones = computed(() => {
    return this.alquileresRetrasados().reduce((total, a) => {
      return total + (a.penalizacion || 0);
    }, 0);
  });

  ngOnInit(): void {
    this.cargarAlquileres();
    this.precargarDatos();
    this.verificarRetrasosAutomaticamente();
  }

  verificarRetrasosAutomaticamente(): void {
    setInterval(() => {
      this.detectarYMarcarRetrasos();
    }, 5 * 60 * 1000);
  }

  precargarDatos(): void {
    forkJoin({
      clientes: this.userService.getAll(),
      vestidos: this.dressService.getAll()
    }).subscribe({
      next: ({ clientes, vestidos }) => {
        this.clientesCache.set(clientes);
        this.vestidosCache.set(vestidos);
        console.log('✅ Datos precargados:', { clientes: clientes.length, vestidos: vestidos.length });
      },
      error: (err) => {
        console.error('❌ Error precargando datos:', err);
      }
    });
  }

  cargarAlquileres(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.rentalService.getAllAdmin().subscribe({
      next: (data: Rental[]) => {
        console.log('✅ Alquileres cargados (ADMIN):', data);

        const alquileresFormateados: Rental[] = data.map(r => {
          const estadoReal = r.estado || r.status || 'activo';

          const alquiler: Rental = {
            ...r,
            id: r.id || undefined,
            cliente: r.clienteNombre || r.clienteEmail || r.user?.email || `Cliente ${r.user_id || ''}`,
            clienteId: r.user_id,
            vestido: r.vestido || r.dressNombre || `Vestido ${r.dress_id || ''}`,
            vestidoId: r.dress_id || (r.dressId ? parseInt(r.dressId) : undefined),
            desde: r.start_date || r.desde,
            hasta: r.end_date || r.hasta,
            talla: r.talla || '-',
            color: r.color || '-',
            estado: estadoReal,
            precio: r.total_cost || r.precioAlquiler || r.precio || 0,
            fechaCreacion: r.created_at ? new Date(r.created_at) : new Date(),
            notas: r.notas || '',
            penalizacion: r.penalizacion || 0,
            diasRetraso: r.diasRetraso || 0
          };

          if (this.estaRetrasado(alquiler)) {
            alquiler.diasRetraso = this.calcularDiasRetraso(alquiler.hasta);
            alquiler.penalizacion = alquiler.diasRetraso * this.PENALIZACION_POR_DIA;
          }

          return alquiler;
        });

        this.rows.set(alquileresFormateados);
        this.aplicarFiltros();
        this.detectarYMarcarRetrasos();
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('❌ Error:', err);
        this.error.set('Error al cargar alquileres');
        this.cargando.set(false);
      }
    });
  }

  estaRetrasado(alquiler: Rental): boolean {
    if (!alquiler.hasta || alquiler.estado === 'cancelado' || alquiler.estado === 'pasado') {
      return false;
    }

    const fechaHasta = new Date(alquiler.hasta);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaHasta.setHours(0, 0, 0, 0);

    return hoy > fechaHasta && (alquiler.estado === 'activo' || alquiler.estado === 'pendiente' || alquiler.estado === 'retrasado');
  }

  calcularDiasRetraso(hasta: string | undefined): number {
    if (!hasta) return 0;

    const fechaHasta = new Date(hasta);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaHasta.setHours(0, 0, 0, 0);

    const diff = hoy.getTime() - fechaHasta.getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

    return dias > 0 ? dias : 0;
  }

  detectarYMarcarRetrasos(): void {
    const retrasados = this.rows().filter(a => this.estaRetrasado(a) && a.estado !== 'retrasado');

    if (retrasados.length > 0) {
      console.log(`⚠️ Detectados ${retrasados.length} alquileres retrasados`);

      retrasados.forEach(alquiler => {
        if (alquiler.id) {
          const diasRetraso = this.calcularDiasRetraso(alquiler.hasta);
          const penalizacion = diasRetraso * this.PENALIZACION_POR_DIA;

          this.rentalService.updateAdmin(alquiler.id, {
            estado: 'retrasado',
            diasRetraso,
            penalizacion
          }).subscribe({
            next: () => {
              console.log(`✅ Alquiler ${alquiler.id} marcado como retrasado (+S/ ${penalizacion})`);
            },
            error: (err) => {
              console.error(`❌ Error al marcar retraso:`, err);
            }
          });
        }
      });

      setTimeout(() => this.cargarAlquileres(), 2000);
    }
  }

  aplicarFiltros(): void {
    let resultado = [...this.rows()];

    const search = this.searchTerm().toLowerCase();
    if (search) {
      resultado = resultado.filter(a =>
        (a.cliente?.toLowerCase().includes(search)) ||
        (a.vestido?.toLowerCase().includes(search)) ||
        (a.id?.toString().includes(search))
      );
    }

    if (this.filtroEstado() !== 'todos') {
      const filtro = this.filtroEstado().toLowerCase();
      resultado = resultado.filter(a => {
        const estado = (a.estado || 'sin-estado').toLowerCase();
        return estado === filtro;
      });
    }

    resultado.sort((a, b) => {
      if (this.ordenPor() === 'cliente') {
        return (a.cliente || '').localeCompare(b.cliente || '');
      } else if (this.ordenPor() === 'estado') {
        return (a.estado || '').localeCompare(b.estado || '');
      } else {
        return new Date(b.desde || '').getTime() - new Date(a.desde || '').getTime();
      }
    });

    this.alquileresFiltrados.set(resultado);
    this.paginaActual.set(1);
  }

  onSearchChange(e: Event): void {
    this.searchTerm.set((e.target as HTMLInputElement).value);
    this.aplicarFiltros();
  }

  onFiltroEstadoChange(e: Event): void {
    this.filtroEstado.set((e.target as HTMLSelectElement).value);
    this.aplicarFiltros();
  }

  onOrdenChange(e: Event): void {
    this.ordenPor.set((e.target as HTMLSelectElement).value as 'fecha' | 'cliente' | 'estado');
    this.aplicarFiltros();
  }

  onItemsPorPaginaChange(e: Event): void {
    this.itemsPorPagina.set(Number((e.target as HTMLSelectElement).value));
    this.paginaActual.set(1);
  }

  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas()) return;
    this.paginaActual.set(pagina);

    const table = document.querySelector('.table');
    if (table) {
      table.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  abrirModalNuevo(): void {
    if (this.clientesCache().length === 0 || this.vestidosCache().length === 0) {
      console.log('⏳ Cargando datos antes de abrir modal...');
      this.cargando.set(true);

      forkJoin({
        clientes: this.userService.getAll(),
        vestidos: this.dressService.getAll()
      }).subscribe({
        next: ({ clientes, vestidos }) => {
          this.clientesCache.set(clientes);
          this.vestidosCache.set(vestidos);
          this.cargando.set(false);
          console.log('✅ Datos cargados, abriendo modal...');
          this.abrirModalConDatos(null);
        },
        error: (err) => {
          console.error('❌ Error cargando datos:', err);
          this.cargando.set(false);
          this.confirmService.showMessage('❌ Error al cargar datos del formulario', 'danger', 'Error');
        }
      });
    } else {
      this.abrirModalConDatos(null);
    }
  }

  private abrirModalConDatos(alquiler: Rental | null): void {
    const dialogRef = this.dialog.open(AlquileresForm, {
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'alquiler-modal',
      data: {
        alquiler,
        clientes: this.clientesCache(),
        vestidos: this.vestidosCache()
      },
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'alquiler-modal-backdrop'
    });

    dialogRef.closed.subscribe((result: any) => {
      if (result) {
        console.log('📤 Datos recibidos del formulario:', result);

        const alquilerData = {
          ...result,
          estado: result.estado || 'activo',
          desde: result.desde ? new Date(result.desde).toISOString() : null,
          hasta: result.hasta ? new Date(result.hasta).toISOString() : null
        };

        console.log('✅ Datos finales a enviar:', alquilerData);

        this.rentalService.createPaymentPending(alquilerData).subscribe({
          next: (alquilerCreado: any) => {
            console.log('✅ Alquiler creado:', alquilerCreado);

            const vestidoId = alquilerData.vestidoId || alquilerData.dress_id;
            if (vestidoId) {
              const vestidoActual = this.vestidosStore.getVestidoById(vestidoId);
              if (vestidoActual) {
                const nuevoStock = (vestidoActual.quantity || 0) - 1;
                this.vestidosStore.updateVestido(vestidoId, {
                  quantity: nuevoStock,
                  isActive: nuevoStock > 0
                });
                console.log(`📦 Stock actualizado: ${vestidoActual.quantity} → ${nuevoStock}`);
              }
            }

            this.cargarAlquileres();
            this.confirmService.showMessage(`✅ Alquiler creado como ${alquilerData.estado.toUpperCase()} ✓`, 'info', 'Éxito');
          },
          error: (err: any) => {
            console.error('❌ Error:', err);
            this.error.set('Error al crear alquiler');
            this.confirmService.showMessage('❌ Error: ' + (err.error?.message || 'Error desconocido'), 'danger', 'Error');
          }
        });
      }
    });
  }

  abrirModalEditar(alquiler: Rental): void {
    if (this.clientesCache().length === 0 || this.vestidosCache().length === 0) {
      this.cargando.set(true);

      forkJoin({
        clientes: this.userService.getAll(),
        vestidos: this.dressService.getAll()
      }).subscribe({
        next: ({ clientes, vestidos }) => {
          this.clientesCache.set(clientes);
          this.vestidosCache.set(vestidos);
          this.cargando.set(false);
          this.abrirModalConDatos(alquiler);
        },
        error: (err) => {
          console.error('❌ Error:', err);
          this.cargando.set(false);
          this.confirmService.showMessage('❌ Error al cargar datos del formulario', 'danger', 'Error');
        }
      });
    } else {
      this.abrirModalConDatos(alquiler);
    }
  }

  cambiarEstado(alquiler: Rental, e: Event): void {
    const nuevoEstado = (e.target as HTMLSelectElement).value;

    if (!alquiler || !alquiler.id) {
      console.error('❌ El alquiler no tiene ID válido:', alquiler);
      this.confirmService.showMessage('❌ Error: El alquiler no tiene ID', 'danger', 'Error');
      return;
    }

    const rentalId = alquiler.id;
    console.log('📤 Cambiando estado de ID:', rentalId, 'a:', nuevoEstado);

    this.rentalService.updateAdmin(rentalId, { estado: nuevoEstado }).subscribe({
      next: () => {
        console.log('✅ Estado actualizado');
        this.cargarAlquileres();
        this.confirmService.showMessage('✅ Estado actualizado', 'info', 'Ok');
      },
      error: (err: any) => {
        console.error('❌ Error:', err);
        this.error.set('Error al cambiar estado');
        this.confirmService.showMessage('❌ Error al cambiar estado: ' + (err.error?.message || 'Error desconocido'), 'danger', 'Error');
      }
    });
  }

  eliminarAlquiler(id: string | number | undefined): void {
    if (!id) return;

    this.confirmService.show(
      'Eliminar alquiler',
      '¿Estás seguro de eliminar este alquiler?',
      () => {
        this.rentalService.delete(id).subscribe({
          next: () => {
            console.log('✅ Eliminado');
            this.cargarAlquileres();
            this.confirmService.showMessage('✅ Alquiler eliminado', 'info', 'Ok');
          },
          error: (err: any) => {
            console.error('❌ Error:', err);
            this.error.set('Error al eliminar');
            this.confirmService.showMessage('❌ Error al eliminar alquiler', 'danger', 'Error');
          }
        });
      },
      () => {},
      'danger',
      'Eliminar',
      'Cancelar'
    );
  }

  getEstadoColor(estado: string | undefined): string {
    if (!estado) return '#6c757d';
    const estadoObj = this.estadosDisponibles.find(e => e.value === estado);
    return estadoObj?.color || '#6c757d';
  }

  calcularDias(desde: string | undefined, hasta: string | undefined): number {
    if (!desde || !hasta) return 0;
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    const diff = fechaHasta.getTime() - fechaDesde.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  exportarCSV(): void {
    const headers = ['ID', 'Cliente', 'Vestido', 'Talla', 'Color', 'Desde', 'Hasta', 'Días', 'Estado', 'Precio', 'Penalización'];
    const rows = this.alquileresFiltrados().map(a => [
      a.id || '',
      a.cliente || '',
      a.vestido || '',
      a.talla || '-',
      a.color || '-',
      a.desde || '',
      a.hasta || '',
      this.calcularDias(a.desde, a.hasta),
      a.estado || '',
      a.precio || '',
      a.penalizacion || 0
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `alquileres_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
