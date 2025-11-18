import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { PagosForm } from './pagos-form/pagos-form';
import { PaymentService, Payment } from '../../../services/payment';
import { ConfirmService } from '../../../services/confirm/confirm'; // <-- Agregado

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagos.html',
  styleUrls: ['./pagos.scss']
})
export class Pagos implements OnInit {
  private pagosService = inject(PaymentService);
  private dialog = inject(Dialog);
  private confirmService = inject(ConfirmService); // <-- Agregado

  pagos = signal<Payment[]>([]);
  loading = signal(false);
  metodoSeleccionado = 'todos';
  comprobanteAmpliado = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.loading.set(true);
    this.pagosService.getAllWithUser().subscribe({
      next: (data) => {
        this.pagos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.pagosService.getAll().subscribe({
          next: (data) => {
            this.pagos.set(data);
            this.loading.set(false);
          }
        });
      }
    });
  }

  formatearId(id: string | undefined): string {
    return id ? String(id).toUpperCase().substring(0, 8) : 'N/A';
  }

  obtenerEmailCliente(pago: Payment): string {
    return pago.user?.email || `Cliente #${pago.user_id}`;
  }

  formatearReferencia(reference: string | undefined, rental_id: string | undefined): string {
    if (reference) return reference;
    if (rental_id) return 'ALQ-' + String(rental_id).substring(0, 3);
    return '';
  }

  getMetodoClass(metodo: string | undefined): string {
    if (!metodo) return '';
    const m = metodo.toLowerCase();
    return m === 'yape' ? 'yape' : m === 'plin' ? 'plin' : m === 'efectivo' ? 'efectivo' : 'transferencia';
  }

  getEstadoClass(estado: string | undefined): string {
    if (!estado) return '';
    const e = estado.toLowerCase();
    return e === 'pagado' ? 'pagado' : e === 'pendiente' ? 'pendiente' : 'abono';
  }

  verComprobante(imagen: string): void {
    this.comprobanteAmpliado.set(imagen);
  }

  cerrarComprobante(): void {
    this.comprobanteAmpliado.set(null);
  }

  abrirModalNuevo(): void {
    const dialogRef = this.dialog.open(PagosForm, {
      width: '450px',
      maxWidth: '90vw',
      panelClass: 'pago-modal',
      data: { pago: null }
    });

    dialogRef.closed.subscribe((result: any) => {
      if (result) {
        this.pagosService.create(result).subscribe({
          next: () => {
            this.confirmService.showMessage('✅ Pago registrado', 'info', 'Éxito');
            this.cargarPagos();
          },
          error: (err) => {
            this.confirmService.showMessage(
              '❌ Error: ' + (err.error?.message || 'No se pudo registrar el pago'),
              'danger',
              'Error'
            );
          }
        });
      }
    });
  }

  filtrarPorMetodo(metodo: string): void {
    this.metodoSeleccionado = metodo;
    if (metodo === 'todos') this.cargarPagos();
    else {
      this.pagos.update(p => p.filter(pago =>
        pago.payment_method?.toLowerCase() === metodo.toLowerCase()
      ));
    }
  }

  filtrarPorFecha(desde: string, hasta: string): void {
    if (!desde || !hasta) {
      this.confirmService.showMessage('⚠️ Selecciona ambas fechas', 'warning', 'Fechas requeridas');
      return;
    }
    this.pagos.update(p => p.filter(pago =>
      String(pago.payment_date) >= desde && String(pago.payment_date) <= hasta
    ));
  }

  buscarPago(event: any): void {
    const valor = event.target.value.toLowerCase();
    if (!valor) {
      this.cargarPagos();
      return;
    }
    this.pagos.update(p => p.filter(pago =>
      String(pago.reference).toLowerCase().includes(valor) ||
      String(pago.id).toLowerCase().includes(valor) ||
      pago.user?.email?.toLowerCase().includes(valor)
    ));
  }
}
