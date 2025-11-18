import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast/toast';
import { AuthService } from '../../../services/auth.service/auth.service';
import { RentalService } from '../../../services/rental.service/rental.service';
import { CartService } from '../../../services/cart/cart';

@Component({
  selector: 'app-rental-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sale-modal.html',
  styleUrl: './sale-modal.scss'
})
export class SaleModal implements OnInit {
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private authService = inject(AuthService);
  private rentalService = inject(RentalService);
  private cartService = inject(CartService);
  private router = inject(Router);
  public dialogRef = inject(DialogRef);

  dressData = inject(DIALOG_DATA, { optional: true });

  rentalForm: FormGroup;
  loading = signal(false);
  tallaSeleccionada = signal(false);

  currentUser: any;

  constructor() {
    this.rentalForm = this.fb.group({
      clienteNombre: ['', Validators.required],
      clienteEmail: ['', [Validators.required, Validators.email]],
      talla: [''],
      color: [{ value: '', disabled: true }],
      desde: ['', Validators.required],
      hasta: ['', Validators.required],
    });

    effect(() => {
      this.currentUser = this.authService.currentUser();
      if (this.currentUser) {
        this.rentalForm.patchValue({
          clienteNombre: this.currentUser.nombre || this.currentUser.name || '',
          clienteEmail: this.currentUser.email || '',
        });
      }
    });
  }

  ngOnInit() {
    if (this.dressData?.talla) {
      this.rentalForm.get('talla')?.disable();
      this.rentalForm.patchValue({
        talla: this.dressData.talla,
        color: this.dressData.color || '',
      });
      this.tallaSeleccionada.set(true);
    }
  }

  hasError(field: string): boolean {
    const control = this.rentalForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const control = this.rentalForm.get(field);
    if (control?.hasError('required')) return 'Campo requerido';
    if (control?.hasError('email')) return 'Email inválido';
    return '';
  }

  private correctDateTimezone(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  submit() {
    if (!this.rentalForm.valid) {
      this.toast.warning('Por favor completa todos los campos requeridos');
      return;
    }

    if (!this.currentUser) {
      this.toast.info('Por favor regístrate para completar tu pedido');
      this.dialogRef.close();
      this.router.navigate(['/registro'], { queryParams: { returnUrl: 'complete-order' } });
      return;
    }

    this.loading.set(true);

    // Crea el item solo para alquiler
    let cartItem: any = {
      id: this.dressData?.dressId || this.dressData?.id,
      nombre: this.dressData?.dressNombre || this.dressData?.nombre,
      imagen: this.dressData?.fotos?.[0],
      precio: this.dressData?.precioAlquiler || this.dressData?.precio,
      talla: this.rentalForm.get('talla')?.value,
      color: this.rentalForm.get('color')?.value,
      fechaDesde: this.correctDateTimezone(this.rentalForm.get('desde')?.value),
      fechaHasta: this.correctDateTimezone(this.rentalForm.get('hasta')?.value),
      tipo: 'alquiler'
    };

    // Limpia el carrito anterior y agrega el item actual
    this.cartService.clearCart();
    this.cartService.addToCart(cartItem);

    this.loading.set(false);
    this.toast.success('Agregado al checkout');
    this.dialogRef.close();

    // 🚩 Redirige siempre al checkout
    this.router.navigate(['/checkout']);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
