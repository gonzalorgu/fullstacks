import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaintenanceService, Maintenance } from '../../../../services/maintenance.service/maintenance.service';
import { MaintenanceCreate } from "../maintenance-create/maintenance-create";
import { environment } from '../../../../../environments/environments';

type MaintenanceStatus = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';

@Component({
  selector: 'app-maintenance-list',
  imports: [CommonModule, MaintenanceCreate],
  templateUrl: './maintenance-list.html',
  styleUrls: ['./maintenance-list.scss']
})
export class MaintenanceList implements OnInit {
  maintenanceList = signal<Maintenance[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  showModal = signal(false);

  constructor(
    private maintenanceService: MaintenanceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMaintenance();
  }

  loadMaintenance(): void {
    this.loading.set(true);
    this.maintenanceService.getAllMaintenance().subscribe({
      next: (data) => {
        this.maintenanceList.set(data);
        this.loading.set(false);
        this.error.set(null);
      },
      error: (err) => {
        this.error.set('Error al cargar los mantenimientos');
        this.loading.set(false);
      }
    });
  }

  getImageUrl(foto: string | null | undefined): string {
    if (!foto) return '';
    if (foto.startsWith('http://') || foto.startsWith('https://')) return foto;
    if (foto.startsWith('/')) return `${environment.apiUrl}${foto}`;
    return `${environment.apiUrl}/${foto}`;
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  getTipoBadgeClass(tipo: string): string {
    const classes: { [key: string]: string } = {
      'limpieza_profunda': 'badge-primary',
      'reparacion_menor': 'badge-info',
      'reparacion_mayor': 'badge-warning',
      'mantenimiento_preventivo': 'badge-success'
    };
    return classes[tipo] || 'badge-info';
  }

  getEstadoBadgeClass(estado: string): string {
    const classes: { [key: string]: string } = {
      'pendiente': 'badge-warning',
      'en_proceso': 'badge-info',
      'completado': 'badge-success',
      'cancelado': 'badge-danger'
    };
    return classes[estado] || 'badge-info';
  }

  updateStatus(id: string, newStatus: string): void {
    const validStatuses: MaintenanceStatus[] = ['pendiente', 'en_proceso', 'completado', 'cancelado'];
    if (!validStatuses.includes(newStatus as MaintenanceStatus)) return;

    this.maintenanceService.updateMaintenanceStatus(id, newStatus as MaintenanceStatus).subscribe({
      next: () => this.loadMaintenance(),
      error: () => alert('Error al actualizar el estado')
    });
  }

  deleteMaintenance(id: string): void {
    if (confirm('¿Estás seguro de eliminar este mantenimiento?')) {
      this.maintenanceService.deleteMaintenance(id).subscribe({
        next: () => this.loadMaintenance(),
        error: () => alert('Error al eliminar el mantenimiento')
      });
    }
  }

  cerrarModal() { this.showModal.set(false); }
}
