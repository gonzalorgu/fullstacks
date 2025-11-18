import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart/cart';
import { ConfirmService } from '../../services/confirm/confirm';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.scss']
})
export class Carrito {
  private cartService = inject(CartService);
  private router = inject(Router);
  private confirm = inject(ConfirmService);

  items = this.cartService.items;

  subtotal = computed(() => this.cartService.total());
  total = computed(() => this.subtotal());

  goBack() {
    this.router.navigate(['/catalogo']);
  }

  removeItem(id: string) {
    const item = this.items().find(i => i.id === id);
    if (!item) return;

    this.confirm.confirm(
      'Eliminar vestido',
      `Deseas eliminar "${item.nombre}" del carrito?`,
      () => {
        this.cartService.removeFromCart(id);
      },
      'Eliminar'
    );
  }

  clearCart() {
    this.confirm.confirm(
      'Vaciar carrito',
      'Estas seguro de que deseas eliminar todos los vestidos del carrito?',
      () => {
        this.cartService.clearCart();
      },
      'Vaciar'
    );
  }

  proceedToCheckout() {
    if (this.items().length === 0) {
      alert('Tu carrito esta vacio');
      return;
    }
    // Aquí debe integrarse tu lógica/flujo de pagos para alquiler
    this.router.navigate(['/checkout']);
  }
}
