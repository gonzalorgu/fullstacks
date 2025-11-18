import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service/auth.service'; // Ajusta el path si necesario

@Component({
  selector: 'app-confections-nv',
  imports: [ReactiveFormsModule],
  templateUrl: './confections-nv.html',
  styleUrl: './confections-nv.scss'
})
export class ConfectionsNv {
  imgUrl = 'assets/novia.jpg';
  loading = false;

  presupuestos = ['1000 a 1500', '1500 a 2000', '2000 a 3000', 'Más de 3000'];
  relacionesNovia = ['Mamá', 'Papá', 'Hermana', 'Amiga', 'Otra'];

  weddingForm: FormGroup;
  selectedFile: File | null = null;
  auth = inject(AuthService); // <-- Signal support out-of-the-box

  constructor(private fb: FormBuilder) {
    this.weddingForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      fechaEvento: ['', Validators.required],
      presupuesto: ['', Validators.required],
      relacionNovia: ['', Validators.required],
      infoAdicional: ['']
    });
  }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      const user = this.auth.currentUser();
      if (user) {
        this.weddingForm.patchValue({
          nombre: user.nombre,

          direccion: user.direccion
        });
        this.weddingForm.get('nombre')?.disable();
        this.weddingForm.get('telefono')?.disable();
        this.weddingForm.get('direccion')?.disable();
      }
    }
  }

  hasError(field: string): boolean {
    const control = this.weddingForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file || null;
  }

  submitWeddingForm() {
    if (this.weddingForm.invalid) return;
    this.loading = true;

    // Trayendo datos correctos aún si están disable
    let datos = { ...this.weddingForm.getRawValue() };
    if (this.auth.isLoggedIn()) {
      const user = this.auth.currentUser();
      if (user) {
        datos.nombre = user.nombre;
        datos.celular = user.telefono;
        datos.direccion = user.direccion;
      }
    }

    const mensaje =
      `Hola, soy ${datos.nombre} y quiero cotizar un vestido de novia.%0A` +
      `Celular: ${datos.telefono}%0A` +
      `Dirección: ${datos.direccion}%0A` +
      `Fecha de evento: ${datos.fechaEvento}%0A` +
      `Presupuesto: ${datos.presupuesto}%0A` +
      `Relación con la novia: ${datos.relacionNovia}%0A` +
      (datos.infoAdicional ? `Información adicional: ${datos.infoAdicional}%0A` : '');

    const numero = "51XXXXXXXXX";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    this.loading = false;
    this.weddingForm.reset();
    this.selectedFile = null;
    // Pre-fill si sigue logueado
    if (this.auth.isLoggedIn()) {
      const user = this.auth.currentUser();
      if (user) {
        this.weddingForm.patchValue({
          nombre: user.nombre,
          celular: user.telefono,
          direccion: user.direccion
        });
        this.weddingForm.get('nombre')?.disable();
        this.weddingForm.get('telefono')?.disable();
        this.weddingForm.get('direccion')?.disable();
      }
    }
  }
}
