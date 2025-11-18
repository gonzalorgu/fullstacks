import { Component, EventEmitter, Input, Output, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vestido } from '../vestidos.store/vestidos.store';
import { ConfirmService } from '../../../../services/confirm/confirm'; // <-- Agregado

@Component({
  selector: 'app-vestidos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vestidos.list.html',
  styleUrls: ['./vestidos.list.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class VestidosList {
  private confirmService = inject(ConfirmService); // <-- Agregado

  @Input() vestidos: Vestido[] = [];
  @Input() loading: boolean = false;
  @Output() editVestido = new EventEmitter<Vestido>();
  @Output() deleteVestido = new EventEmitter<number>();
  @Output() toggleDisponible = new EventEmitter<Vestido>();

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

  tieneStock(vestido: Vestido): boolean {
    return (vestido.quantity || 0) > 0;
  }

  stockBajo(vestido: Vestido): boolean {
    const qty = vestido.quantity || 0;
    return qty > 0 && qty <= 3;
  }

  getStockClass(vestido: Vestido): string {
    const qty = vestido.quantity || 0;
    if (qty === 0) return 'sin-stock';
    if (qty <= 3) return 'stock-bajo';
    return 'stock-normal';
  }

  isDisponible(vestido: Vestido): boolean {
    const tieneStock = (vestido.quantity || 0) > 0;
    const estaActivo = vestido.isActive !== false;
    return tieneStock && estaActivo && !!vestido.disponible;
  }

  getColorName(colorValue: string): string {
    const color = this.colorOptions.find(c => c.value === colorValue);
    return color ? color.nombre : colorValue || 'Sin especificar';
  }

  getAllColorNames(colors: string[] | undefined): string {
    if (!colors || colors.length === 0) {
      return 'Sin especificar';
    }
    return colors.map(c => this.getColorName(c)).join(', ');
  }

  getUniqueColors(vestido: Vestido): string[] {
    const allColors = new Set<string>();
    if (vestido.color) {
      allColors.add(vestido.color);
    }
    if (vestido.colors && Array.isArray(vestido.colors)) {
      vestido.colors.forEach(c => allColors.add(c));
    }
    return Array.from(allColors);
  }

  onEdit(vestido: Vestido): void {
    this.editVestido.emit(vestido);
  }

  onDelete(id: number): void {
    this.confirmService.show(
      'Eliminar vestido',
      '¿Estás seguro de que deseas eliminar este vestido?',
      () => {
        this.deleteVestido.emit(id);
      },
      () => {},
      'danger',
      'Eliminar',
      'Cancelar'
    );
  }

  onToggleDisponible(vestido: Vestido): void {
    this.toggleDisponible.emit(vestido);
  }

  onImageError(event: any): void {
    event.target.src = '../../../../assets/1.jpg';
  }
}
