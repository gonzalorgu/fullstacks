import { Component, OnInit, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaintenanceService } from '../../../../services/maintenance.service/maintenance.service';
import { DressService } from '../../../../services/dress';

@Component({
  selector: 'app-maintenance-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './maintenance-create.html',
  styleUrls: ['./maintenance-create.scss']
})
export class MaintenanceCreate implements OnInit {
  private fb = inject(FormBuilder);
  private maintenanceService = inject(MaintenanceService);
  private dressService = inject(DressService);
  private router = inject(Router);

  @Output() close = new EventEmitter<void>();

  maintenanceForm!: FormGroup;
  dresses = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  tiposMantenimiento = [
    { value: 'lavado', label: 'Lavado' },
    { value: 'reparacion', label: 'Reparación' },
    { value: 'limpieza_profunda', label: 'Limpieza Profunda' },
    { value: 'ajuste', label: 'Ajuste' }
  ];

  estadosMantenimiento = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_proceso', label: 'En Proceso' },
    { value: 'completado', label: 'Completado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadDresses();
  }

  initForm(): void {
    this.maintenanceForm = this.fb.group({
      dressId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      tipo: ['lavado', Validators.required],
      estado: ['pendiente'],
      observaciones: [''],
      costo: [''],
      fechaInicio: [''],
      fechaFin: ['']
    });
  }

  loadDresses(): void {
    this.dressService.getAllDresses().subscribe({
      next: (data) => {
        this.dresses.set(data);
      },
      error: () => {
        this.error.set('Error al cargar vestidos');
      }
    });
  }

  onDressChange(event: any): void {
    // Puedes dejar para futura lógica de autocompletar
  }

  onSubmit(): void {
    if (this.maintenanceForm.invalid) {
      this.error.set('Por favor complete los campos obligatorios');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const dressId = Number(this.maintenanceForm.value.dressId);
    const selectedDress = this.dresses().find(d => d.id === dressId);

    if (!selectedDress) {
      this.error.set('Error: No se encontró el vestido seleccionado');
      this.loading.set(false);
      return;
    }

    let foto: string | undefined = undefined;
    if (selectedDress.images && Array.isArray(selectedDress.images) && selectedDress.images.length > 0) {
      foto = selectedDress.images[0];
    } else if (selectedDress.imagen) {
      foto = selectedDress.imagen;
    }

    const maintenanceData = {
      dressId: String(dressId),
      cantidad: Number(this.maintenanceForm.value.cantidad),
      dressNombre: selectedDress.name,
      foto: foto,
      tipo: this.maintenanceForm.value.tipo,
      estado: this.maintenanceForm.value.estado || 'pendiente',
      observaciones: this.maintenanceForm.value.observaciones || undefined,
      costo: this.maintenanceForm.value.costo ? parseFloat(this.maintenanceForm.value.costo) : undefined,
      fechaInicio: this.maintenanceForm.value.fechaInicio || undefined,
      fechaFin: this.maintenanceForm.value.fechaFin || undefined
    };

    this.maintenanceService.createMaintenance(maintenanceData).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        setTimeout(() => {
          this.close.emit(); // cerrar modal
        }, 1100);
      },
      error: () => {
        this.error.set('Error al crear el mantenimiento');
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.close.emit();
  }
}
