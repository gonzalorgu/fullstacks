import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { VestidosForm } from '../vestidos.form/vestidos.form';
import { VestidosList } from '../vestidos.list/vestidos.list';
import { VestidosStore, Vestido } from '../vestidos.store/vestidos.store';
import { DressService } from '../../../../services/dress';
import { ConfirmService } from '../../../../services/confirm/confirm'; // agregado

@Component({
  selector: 'app-vestidos-page',
  imports: [CommonModule, VestidosList],
  templateUrl: './vestidos.page.html',
  styleUrls: ['./vestidos.page.scss']
})
export class VestidosPage implements OnInit {
  private store = inject(VestidosStore);
  private dialog = inject(Dialog);
  private dressService = inject(DressService);
  private confirmService = inject(ConfirmService); // agregado

  vestidos = this.store.vestidos;
  loading = this.store.loading;

  ngOnInit(): void {
    this.loadVestidos();
  }

  loadVestidos(): void {
    this.store.setLoading(true);

    this.dressService.getAll().subscribe({
      next: (backendVestidos: any[]) => {
        const vestidos: Vestido[] = backendVestidos.map(dress => ({
          id: dress.id,
          name: dress.name,
          size: Array.isArray(dress.size) ? dress.size : [dress.size || 'M'],
          color: dress.color || '#000000',
          colors: Array.isArray(dress.colors) ? dress.colors : [],
          rental_price: Number(dress.rental_price),
          description: dress.description || '',
          imagen: dress.imagen || '',
          quantity: dress.quantity || 0,
          isActive: dress.isActive !== undefined ? dress.isActive : true,
          status: dress.status || 'available',
          catalog_id: dress.catalog_id,
          disponible: dress.status === 'available',
          categoria: 'Elegante'
        }));

        this.store.setVestidos(vestidos);
      },
      error: (err) => {
        this.confirmService.showMessage('❌ Error al cargar vestidos', 'danger', 'Error');
        this.store.setLoading(false);
      }
    });
  }

  abrirModalNuevo(): void {
    const dialogRef = this.dialog.open<Partial<Vestido> | undefined>(VestidosForm, {
      width: '700px',
      maxWidth: '90vw',
      panelClass: 'vestido-modal',
      data: { vestido: null }
    });

    dialogRef.closed.subscribe((result: any) => {
      if (result && result.nombre && result.precio) {
        this.store.setLoading(true);

        const dressData = {
          name: result.nombre,
          size: Array.isArray(result.size) ? result.size : [result.size || 'M'],
          color: result.color || '#000000',
          colors: Array.isArray(result.colors) ? result.colors : [],
          status: 'available',
          rental_price: Number(result.precio),
          imagen: result.imagen || '',
          description: result.descripcion || '',
          quantity: result.cantidad || 1
        };

        this.dressService.create(dressData).subscribe({
          next: () => {
            this.loadVestidos();
          },
          error: (err) => {
            this.confirmService.showMessage('❌ Error al crear el vestido', 'danger', 'Error');
            this.store.setLoading(false);
          }
        });
      }
    });
  }

  onEditVestido(vestido: Vestido): void {
    const dialogRef = this.dialog.open<Partial<Vestido> | undefined>(VestidosForm, {
      width: '700px',
      maxWidth: '90vw',
      panelClass: 'vestido-modal',
      data: { vestido }
    });

    dialogRef.closed.subscribe((result: any) => {
      if (result && result.nombre && result.precio) {
        this.store.setLoading(true);

        const dressData = {
          name: result.nombre,
          size: Array.isArray(result.size) ? result.size : [result.size],
          color: result.color,
          colors: Array.isArray(result.colors) ? result.colors : [],
          rental_price: Number(result.precio),
          imagen: result.imagen,
          description: result.descripcion,
          quantity: result.cantidad || 1
        };

        this.dressService.update(vestido.id!, dressData).subscribe({
          next: () => {
            this.loadVestidos();
          },
          error: (err) => {
            this.confirmService.showMessage('❌ Error al actualizar el vestido', 'danger', 'Error');
            this.store.setLoading(false);
          }
        });
      }
    });
  }

  onDeleteVestido(id: number): void {
    this.confirmService.show(
      'Eliminar vestido',
      '¿Estás seguro de eliminar este vestido?',
      () => {
        this.dressService.delete(id).subscribe({
          next: () => {
            this.store.removeVestido(id);
          },
          error: (err) => {
            this.confirmService.showMessage('❌ Error al eliminar el vestido', 'danger', 'Error');
          }
        });
      },
      () => {},
      'danger',
      'Eliminar',
      'Cancelar'
    );
  }

  onToggleDisponible(vestido: Vestido): void {
    const newStatus = !vestido.disponible ? 'available' : 'rented';

    this.dressService.update(vestido.id!, { status: newStatus }).subscribe({
      next: () => {
        this.store.updateVestido(vestido.id!, {
          status: newStatus,
          disponible: newStatus === 'available'
        });
      },
      error: (err) => {
        this.confirmService.showMessage('❌ Error al cambiar disponibilidad', 'danger', 'Error');
      }
    });
  }
}
