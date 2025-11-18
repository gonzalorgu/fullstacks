import { Component, Inject, OnInit, Optional, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

export interface Alquiler {
  id?: number;
  user_id?: number;
  dress_id?: number;
  cliente?: string;
  vestido?: string;
  desde?: string;
  hasta?: string;
  start_date?: string;
  end_date?: string;
  estado?: string;
  status?: string;
  precio?: number;
  total_cost?: number;
  notas?: string;
  dressId?: string;
  dressNombre?: string;
  precioAlquiler?: number;
  talla?: string;
  color?: string;
  foto?: string;
  created_at?: string;
  updated_at?: string;
  clienteNombre?: string;
  clienteEmail?: string;
}

@Component({
  selector: 'app-alquileres-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alquileres.form.html',
  styleUrls: ['./alquileres.form.scss']
})
export class AlquileresForm implements OnInit {
  private fb = inject(FormBuilder);

  alquilerForm!: FormGroup;
  clientes = signal<any[]>([]);
  vestidos = signal<any[]>([]);
  loadingData = signal(false);

  // ✅ TALLAS DISPONIBLES DEL VESTIDO SELECCIONADO
  tallasDisponibles = signal<string[]>([]);

  estados = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'activo', label: 'Activo' },
    { value: 'pasado', label: 'Pasado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  constructor(
    @Optional() public dialogRef: DialogRef<Partial<Alquiler> | undefined>,
    @Optional() @Inject(DIALOG_DATA) public data: {
      alquiler: Alquiler | null,
      clientes?: any[],
      vestidos?: any[]
    }
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.data?.clientes) {
      this.clientes.set(this.data.clientes);
      console.log('✅ Clientes precargados:', this.data.clientes.length);
    }

    if (this.data?.vestidos) {
      this.vestidos.set(this.data.vestidos);
      console.log('✅ Vestidos precargados:', this.data.vestidos.length);
    }

    if (this.data?.alquiler) {
      this.alquilerForm.patchValue(this.data.alquiler);

      // ✅ Si estamos editando, cargar las tallas del vestido
      if (this.data.alquiler.vestido) {
        const vestido = this.vestidos().find(v => v.name === this.data.alquiler?.vestido);
        if (vestido) {
          this.cargarTallasDisponibles(vestido);
        }
      }
    }
  }

  initForm(): void {
    const hoy = new Date().toISOString().split('T')[0];

    this.alquilerForm = this.fb.group({
      cliente: ['', Validators.required],
      vestido: ['', Validators.required],
      talla: ['', Validators.required],  // ✅ NUEVO
      color: [''],  // ✅ NUEVO
      desde: [hoy, Validators.required],
      hasta: ['', Validators.required],
      estado: ['activo', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      notas: ['']
    });
  }

  // ✅ NUEVO: Cargar tallas disponibles del vestido
  cargarTallasDisponibles(vestido: any): void {
    // Asumiendo que el vestido tiene un campo "sizes" o "tallas" con las tallas disponibles
    // Ejemplo: vestido.sizes = ['XS', 'S', 'M', 'L', 'XL']
    // O vestido.tallas = 'XS, S, M, L, XL'

    if (vestido.sizes && Array.isArray(vestido.sizes)) {
      this.tallasDisponibles.set(vestido.sizes);
    } else if (vestido.tallas && typeof vestido.tallas === 'string') {
      // Si las tallas vienen como string separado por comas
      const tallas = vestido.tallas.split(',').map((t: string) => t.trim());
      this.tallasDisponibles.set(tallas);
    } else if (vestido.available_sizes && Array.isArray(vestido.available_sizes)) {
      this.tallasDisponibles.set(vestido.available_sizes);
    } else {
      // Si no hay tallas definidas, usar tallas estándar
      this.tallasDisponibles.set(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
    }

    console.log('✅ Tallas disponibles:', this.tallasDisponibles());
  }

  onVestidoChange(e: Event): void {
    const vestidoNombre = (e.target as HTMLSelectElement).value;
    const vestidoSeleccionado = this.vestidos().find(v => v.name === vestidoNombre);

    if (vestidoSeleccionado) {
      // ✅ Actualizar precio
      this.alquilerForm.patchValue({
        precio: vestidoSeleccionado.rental_price || 0,
        talla: '',  // ✅ Resetear talla al cambiar vestido
        color: ''   // ✅ Resetear color
      });

      // ✅ Cargar tallas disponibles
      this.cargarTallasDisponibles(vestidoSeleccionado);
    } else {
      // ✅ Si no hay vestido seleccionado, limpiar tallas
      this.tallasDisponibles.set([]);
      this.alquilerForm.patchValue({
        talla: '',
        color: ''
      });
    }
  }

  onSubmit(): void {
    if (!this.alquilerForm.valid) {
      alert('❌ Por favor completa todos los campos requeridos');
      return;
    }

    const formValue = this.alquilerForm.value;

    const clienteSeleccionado = this.clientes().find(
      c => c.nombre === formValue.cliente || c.name === formValue.cliente
    );
    const vestidoSeleccionado = this.vestidos().find(v => v.name === formValue.vestido);

    if (!clienteSeleccionado || !vestidoSeleccionado) {
      alert('❌ Por favor selecciona cliente y vestido válidos');
      return;
    }

    const alquilerData: Partial<Alquiler> = {
      dressId: vestidoSeleccionado.id.toString(),
      dressNombre: formValue.vestido,
      desde: formValue.desde,
      hasta: formValue.hasta,
      precioAlquiler: Number(formValue.precio),
      talla: formValue.talla || '',  // ✅ NUEVO
      color: formValue.color || '',  // ✅ NUEVO
      estado: formValue.estado || 'activo',
      clienteNombre: clienteSeleccionado.nombre || clienteSeleccionado.name,
      clienteEmail: clienteSeleccionado.email
    };

    console.log('📤 Enviando alquiler:', alquilerData);
    this.dialogRef?.close(alquilerData);
  }

  onCancel(): void {
    this.dialogRef?.close(undefined);
  }

  get f() {
    return this.alquilerForm.controls;
  }

  get isEditMode(): boolean {
    return !!this.data?.alquiler;
  }
}
