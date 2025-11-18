import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastService } from '../../services/toast/toast';
import { RentalService } from '../../services/rental.service/rental.service';
import { CartService } from '../../services/cart/cart';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class Checkout implements OnInit {
  private router = inject(Router);
  private location = inject(Location);
  private toast = inject(ToastService);
  private rentalService = inject(RentalService);
  private cartService = inject(CartService);

  items = this.cartService.items;
  processing = signal(false);
  whatsappNumber = '+51987654321';

  // Para crear un array numérico para bucles en template sin *ngFor
  createArray(length: number): number[] {
    return Array.from({ length }, (_, i) => i);
  }

  ngOnInit() {}

  pagarConWhatsApp() {
    const items = this.items();
    if (!items || items.length === 0) return;

    this.processing.set(true);

    items.forEach(item => {
      this.rentalService.createPaymentPending({
        dressId: item.id,
        dressNombre: item.nombre,
        foto: item.imagen,
        desde: item.fechaDesde,
        hasta: item.fechaHasta,
        precioAlquiler: item.precio,
        talla: item.talla,
        color: item.color,
        estado: 'pendiente'
      }).subscribe({
        next: (response: any) => {
          console.log('✅ Alquiler PENDIENTE creado:', response);
        },
        error: (error: any) => {
          console.error('❌ Error creando alquiler:', error);
          this.toast.error('Error al procesar la reserva');
        }
      });
    });

    this.guardarEnMisAlquileres(items);
    this.cartService.clearCart();
    this.abrirWhatsApp(items);

    setTimeout(() => {
      this.router.navigate(['/historial']);
      this.processing.set(false);
    }, 2000);
  }

  guardarEnMisAlquileres(items: any[]) {
    const alquileres = items;
    if (alquileres.length > 0) {
      const prev = JSON.parse(localStorage.getItem('mis-alquileres') || '[]');
      const nuevos = [...prev, ...alquileres];
      localStorage.setItem('mis-alquileres', JSON.stringify(nuevos));
    }
  }

  abrirWhatsApp(items: any[]) {
    let mensaje = 'Hola, deseo confirmar mi pago de los siguientes artículos:';
    let total = 0;
    items.forEach(item => {
      mensaje += `
- Tipo: ALQUILER
- Vestido: ${item.nombre}
- Talla: ${item.talla}
- Color: ${item.color}
- Monto: S/. ${item.precio.toFixed(2)}
${item.fechaDesde ? `- Desde: ${item.fechaDesde}` : ''}
${item.fechaHasta ? `- Hasta: ${item.fechaHasta}` : ''}
----------------------`;
      total += item.precio;
    });
    mensaje += `
Total a pagar: S/. ${total.toFixed(2)}
`;

    const urlWhatsApp = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
    this.toast.success('Se abrió WhatsApp. Por favor confirma tu pago.');
  }

  getTotal(): number {
    return this.items().reduce((sum, item) => sum + (item.precio || 0), 0);
  }

  goBack() {
    this.cartService.clearCart();
    this.location.back();
  }
}
