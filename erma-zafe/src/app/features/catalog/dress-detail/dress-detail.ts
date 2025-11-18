import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, NavigationEnd } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DressCard } from '../dress-card/dress-card';
import { CatalogStore } from '../catalog.store/catalog.store';
import { CartService } from '../../../services/cart/cart';
import { ToastService } from '../../../services/toast/toast';
import { SaleModal } from '../sale-modal/sale-modal';

@Component({
  selector: 'app-dress-detail',
  imports: [CommonModule, DressCard],
  templateUrl: './dress-detail.html',
  styleUrl: './dress-detail.scss'
})
export class DressDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(CatalogStore);
  private dialog = inject(Dialog);
  private cartService = inject(CartService);
  private toast = inject(ToastService);
  // private salesService = inject(SalesService); // eliminado

  private routeSubscription?: Subscription;
  private routerEventsSubscription?: Subscription;

  id = signal<string>('');
  dress = computed(() => this.store.byId(this.id()));
  related = computed(() => this.store.relatedTo(this.id(), 4));

  size = signal<string>('');
  fit = signal<boolean>(false);
  selectedColor = signal<string>('');
  // Eliminado purchaseType ya que solo se maneja alquiler
  selectedPhotoIndex = signal<number>(0);

  colorOptions = [
    { nombre: 'Negro', value: '#000000' },
    { nombre: 'Blanco', value: '#FFFFFF' },
    { nombre: 'Rojo', value: '#E53935' },
    { nombre: 'Rosa', value: '#EC407A' },
    { nombre: 'Púrpura', value: '#8E24AA' },
    { nombre: 'Azul Oscuro', value: '#1565C0' },
    { nombre: 'Azul Claro', value: '#0097A7' },
    { nombre: 'Verde', value: '#00796B' },
    { nombre: 'Verde Claro', value: '#43A047' },
    { nombre: 'Amarillo', value: '#FBC02D' },
    { nombre: 'Naranja', value: '#F57C00' },
    { nombre: 'Marrón', value: '#6D4C41' },
    { nombre: 'Gris Oscuro', value: '#424242' },
    { nombre: 'Gris', value: '#757575' },
    { nombre: 'Gris Claro', value: '#BDBDBD' },
    { nombre: 'Dorado', value: '#C4A747' },
    { nombre: 'Plata', value: '#C0C0C0' },
    { nombre: 'Beige', value: '#D7CCC8' },
    { nombre: 'Coral', value: '#FF7043' },
    { nombre: 'Turquesa', value: '#26C6DA' },
  ];

  currentPrice = computed(() => {
    const d = this.dress();
    if (!d) return 0;
    return d.precioAlquiler;  // solo alquiler
  });

  actionButtonText = computed(() => {
    return 'Reservar Ahora'; // fijo para alquiler
  });

  ngOnInit(): void {
    this.routerEventsSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      });

    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const newId = params.get('id') ?? '';
      this.loadDress(newId);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.routerEventsSubscription?.unsubscribe();
  }

  private loadDress(id: string): void {
    this.id.set(id);
    this.selectedPhotoIndex.set(0);

    setTimeout(() => {
      const d = this.store.byId(id);

      if (d?.talla && Array.isArray(d.talla) && d.talla.length > 0) {
        this.size.set(d.talla[0]);
      }

      if (d?.colors && Array.isArray(d.colors) && d.colors.length > 0) {
        this.selectedColor.set(d.colors[0]);
      } else if (d?.color) {
        this.selectedColor.set(d.color);
      }

      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 100);
  }

  selectPhoto(index: number) {
    this.selectedPhotoIndex.set(index);
  }

  setSize(t: string) {
    this.size.set(t);
  }

  setSelectedColor(color: string) {
    this.selectedColor.set(color);
  }

  getColorName(colorValue: string): string {
    const color = this.colorOptions.find(c => c.value === colorValue);
    return color ? color.nombre : colorValue || 'Sin especificar';
  }

  toggleFit(e: Event) {
    this.fit.set((e.target as HTMLInputElement).checked);
  }

  addToCart() {
    const d = this.dress();
    if (!d) {
      this.toast.error('Vestido no encontrado');
      return;
    }
    if (this.cartService.isInCart(d.id)) {
      this.toast.warning('Este vestido ya está en tu carrito');
      return;
    }
    const itemData = {
      id: d.id,
      nombre: d.nombre,
      imagen: d.fotos?.[0] || 'assets/default-dress.jpg',
      precio: this.currentPrice(),
      talla: this.size(),
      color: this.selectedColor(),
      fechaDesde: new Date().toISOString().split('T')[0],
      fechaHasta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      fechaCompra: '',  // No aplica para alquiler
      tipo: 'alquiler'  // fijo alquiler
    };

    this.cartService.addToCart(itemData);
    this.toast.success('Vestido agregado al carrito');
  }

  openSaleModal() {
    const d = this.dress();
    if (!d) {
      this.toast.error('Vestido no encontrado');
      return;
    }
    if (!this.size()) {
      this.toast.warning('Por favor selecciona una talla');
      return;
    }
    if (!this.selectedColor()) {
      this.toast.warning('Por favor selecciona un color');
      return;
    }
    const dialogRef = this.dialog.open(SaleModal, {
      data: {
        id: d.id,
        dressId: d.id,
        nombre: d.nombre,
        dressNombre: d.nombre,
        fotos: d.fotos,
        precioAlquiler: d.precioAlquiler,
        color: this.selectedColor(),
        talla: this.size(),
        tipo: 'alquiler',
      }
    });
    dialogRef.closed.subscribe((result: any) => {
      if (result) {
        this.toast.success('Transacción registrada correctamente');
        setTimeout(() => {
          this.router.navigate(['/mis-alquiler']);
        }, 2000);
      }
    });
  }
}
