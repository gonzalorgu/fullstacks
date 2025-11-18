import { Component, Inject, OnInit, Optional, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { RentalService } from '../../../../services/rental';
import { UserService } from '../../../../services/user.service/user.service';
import { ConfirmService } from '../../../../services/confirm/confirm'; // <-- Agregado

@Component({
  selector: 'app-pagos-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos-form.html',
  styleUrls: ['./pagos-form.scss']
})
export class PagosForm implements OnInit {
  private rentalService = inject(RentalService);
  private userService = inject(UserService);
  private confirmService = inject(ConfirmService); // <-- Agregado

  clientes = signal<any[]>([]);
  alquileres = signal<any[]>([]);
  loadingData = signal(true);
  imagenPreview = signal<string | null>(null);

  pago: any = {
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'efectivo',
    rental_id: null,
    user_id: 0,
    reference: '',
    status: 'Pendiente',
    receipt_image: null
  };

  constructor(
    @Optional() public dialogRef: DialogRef<any>,
    @Optional() @Inject(DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.userService.getAll().subscribe({
      next: (usuarios: any[]) => {
        this.clientes.set(usuarios);
      },
      error: (err: any) => {
        this.confirmService.showMessage('❌ Error al cargar clientes', 'danger', 'Error');
      }
    });

    this.rentalService.getAll().subscribe({
      next: (alquileres: any[]) => {
        this.alquileres.set(alquileres);
        this.loadingData.set(false);
      },
      error: (err: any) => {
        this.confirmService.showMessage('❌ Error al cargar alquileres', 'danger', 'Error');
        this.loadingData.set(false);
      }
    });
  }

  onClienteChange(event: any): void {
    const clienteId = Number(event.target.value);
    this.pago.user_id = clienteId;
  }

  onAlquilerChange(event: any): void {
    const alquilerId = event.target.value;
    this.pago.rental_id = alquilerId;
  }

  getAlquilerDisplay(alquiler: any): string {
    const nombre = alquiler.dressNombre || 'Vestido sin nombre';
    const id = alquiler.id.substring(0, 8);
    return `${nombre} (${id}...)`;
  }

  onImagenSeleccionada(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.confirmService.showMessage('❌ Solo se permiten imágenes', 'warning', 'Archivo no válido');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.confirmService.showMessage('❌ La imagen no debe exceder 5MB', 'warning', 'Tamaño excedido');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.pago.receipt_image = reader.result as string;
      this.imagenPreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  eliminarImagen(): void {
    this.pago.receipt_image = null;
    this.imagenPreview.set(null);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSubmit(): void {
    if (this.pago.amount <= 0) {
      this.confirmService.showMessage('❌ El monto debe ser mayor a 0', 'warning', 'Monto inválido');
      return;
    }

    if (this.pago.user_id === 0) {
      this.confirmService.showMessage('❌ Selecciona un cliente válido', 'warning', 'Cliente inválido');
      return;
    }

    if (!this.pago.rental_id) {
      this.confirmService.showMessage('❌ Selecciona un alquiler válido', 'warning', 'Alquiler inválido');
      return;
    }

    const pagoFinal: any = {
      amount: this.pago.amount,
      payment_date: this.pago.payment_date,
      payment_method: this.pago.payment_method,
      user_id: this.pago.user_id,
      reference: this.pago.reference,
      status: this.pago.status,
      receipt_image: this.pago.receipt_image,
      rental_id: String(this.pago.rental_id)
    };

    this.dialogRef?.close(pagoFinal);
  }

  onCancel(): void {
    this.dialogRef?.close(undefined);
  }
}
