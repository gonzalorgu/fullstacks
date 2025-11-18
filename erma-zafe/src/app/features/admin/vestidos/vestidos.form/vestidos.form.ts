import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Vestido } from '../vestidos.store/vestidos.store';
import { UploadService } from '../../../../services/upload';
import { ConfirmService } from '../../../../services/confirm/confirm';
import { environment } from '../../../../../environments/environments'; // <-- IMPORTANTE

@Component({
  selector: 'app-vestidos-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './vestidos.form.html',
  styleUrls: ['./vestidos.form.scss']
})
export class VestidosForm implements OnInit {
  vestidoForm!: FormGroup;

  private fb = inject(FormBuilder);
  private uploadService = inject(UploadService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);
  public dialogRef = inject(DialogRef<Partial<Vestido> | undefined>, { optional: true });
  public data = inject(DIALOG_DATA, { optional: true }) as { vestido: Vestido | null };

  tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  tallasSeleccionadas: string[] = [];
  categorias = [
    'Casual', 'Formal', 'Fiesta', 'Cóctel', 'Novia', 'Quinceañera', 'Elegante'
  ];
  colorOptions = [ /* ...mismos colores... */ ];
  coloresPersonalizados: string[] = [];
  nuevoColorPersonalizado = '';
  imagenPreview: string | null = null;
  archivoImagen: File | null = null;
  uploadingImage = false;

  ngOnInit(): void {
    this.initForm();

    if (this.data?.vestido) {
      this.vestidoForm.patchValue({
        nombre: this.data.vestido.name,
        categoria: this.data.vestido.categoria,
        descripcion: this.data.vestido.description,
        color: this.data.vestido.color && this.data.vestido.color !== '' ? this.data.vestido.color : '#1a1a1a',
        precio: this.data.vestido.rental_price,
        cantidad: this.data.vestido.quantity || 1,
        imagen: this.data.vestido.imagen
      });

      if (this.data.vestido.size && Array.isArray(this.data.vestido.size)) {
        this.tallasSeleccionadas = [...this.data.vestido.size];
      }
      if (this.data.vestido.colors && Array.isArray(this.data.vestido.colors)) {
        const colorPrincipal = this.data.vestido.color;
        this.coloresPersonalizados = this.data.vestido.colors.filter(c => c !== colorPrincipal);
      }
      if (this.data.vestido.imagen) {
        this.imagenPreview = `${environment.apiUrl}${this.data.vestido.imagen}`;
      }
    }
  }

  initForm(): void {
    this.vestidoForm = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      descripcion: [''],
      color: ['#1a1a1a', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      imagen: ['']
    });
  }

  getAllColors(): { nombre: string; value: string; custom?: boolean }[] {
    const coloresConCustom = this.coloresPersonalizados.map(color => ({
      nombre: color,
      value: color,
      custom: true
    }));
    return [...this.colorOptions, ...coloresConCustom];
  }

  getColorName(colorValue: string): string {
    const color = this.getAllColors().find(c => c.value === colorValue);
    return color ? color.nombre : colorValue || 'Sin color';
  }

  selectColor(colorValue: string): void {
    this.vestidoForm.patchValue({ color: colorValue });
  }

  addColorPersonalizado(): void {
    if (!this.nuevoColorPersonalizado || this.nuevoColorPersonalizado.trim() === '') {
      this.confirmService.showMessage('⚠️ Por favor selecciona un color válido', 'warning', 'Validación');
      return;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(this.nuevoColorPersonalizado)) {
      this.confirmService.showMessage('⚠️ El color debe ser un código hexadecimal válido (#RRGGBB)', 'warning', 'Validación');
      return;
    }
    if (this.coloresPersonalizados.length >= 3) {
      this.confirmService.showMessage('⚠️ Máximo 3 colores personalizados permitidos', 'warning', 'Límite');
      return;
    }
    if (this.coloresPersonalizados.includes(this.nuevoColorPersonalizado)) {
      this.confirmService.showMessage('⚠️ Este color ya está agregado', 'warning', 'Duplicado');
      return;
    }
    this.coloresPersonalizados.push(this.nuevoColorPersonalizado);
    this.nuevoColorPersonalizado = '';
    this.cdr.detectChanges();
  }

  removeColorPersonalizado(index: number): void {
    this.coloresPersonalizados.splice(index, 1);
    this.cdr.detectChanges();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.confirmService.showMessage('❌ Por favor selecciona una imagen válida', 'danger', 'Archivo inválido');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.confirmService.showMessage('❌ La imagen no debe superar 10MB', 'warning', 'Tamaño');
        return;
      }

      this.archivoImagen = file;
      this.uploadingImage = true;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPreview = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file, file.name);

      this.uploadService.uploadImage(formData).subscribe({
        next: (response) => {
          this.imagenPreview = `${environment.apiUrl}${response.url}`;
          this.vestidoForm.patchValue({ imagen: response.url });
          this.uploadingImage = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.confirmService.showMessage(`Error al subir la imagen: ${err.error?.message || 'Error desconocido'}`, 'danger', 'Error');
          this.imagenPreview = null;
          this.uploadingImage = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.imagenPreview = null;
    this.archivoImagen = null;
    this.vestidoForm.patchValue({ imagen: '' });
  }

  onTallaChange(event: any, talla: string): void {
    if (event.target.checked) {
      if (!this.tallasSeleccionadas.includes(talla)) {
        this.tallasSeleccionadas.push(talla);
      }
    } else {
      const index = this.tallasSeleccionadas.indexOf(talla);
      if (index > -1) {
        this.tallasSeleccionadas.splice(index, 1);
      }
    }
  }

  onSubmit(): void {
    if (this.vestidoForm.valid && this.tallasSeleccionadas.length > 0) {
      const color = this.vestidoForm.value.color;
      if (!color || color.trim() === '') {
        this.confirmService.showMessage('⚠️ Por favor selecciona un color para el vestido', 'warning', 'Validación');
        return;
      }
      const todosLosColores: string[] = [];
      if (color && color.trim() !== '') todosLosColores.push(color);
      if (this.coloresPersonalizados && Array.isArray(this.coloresPersonalizados)) {
        for (const colorPersonalizado of this.coloresPersonalizados) {
          if (colorPersonalizado && colorPersonalizado.trim() !== '' && !todosLosColores.includes(colorPersonalizado)) {
            todosLosColores.push(colorPersonalizado);
          }
        }
      }
      const formData: any = {
        nombre: this.vestidoForm.value.nombre,
        categoria: this.vestidoForm.value.categoria,
        descripcion: this.vestidoForm.value.descripcion,
        color: color,
        colors: todosLosColores,
        precio: this.vestidoForm.value.precio,
        cantidad: this.vestidoForm.value.cantidad,
        imagen: this.vestidoForm.value.imagen,
        size: this.tallasSeleccionadas
      };
      this.dialogRef?.close(formData);
    } else {
      this.confirmService.showMessage('❌ Debes seleccionar al menos una talla', 'warning', 'Validación');
    }
  }

  onCancel(): void {
    this.dialogRef?.close(undefined);
  }

  get f() { return this.vestidoForm.controls; }
  get isEditMode(): boolean { return !!this.data?.vestido; }
}
