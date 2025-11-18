import { Component, inject, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service/auth.service'; // Ajusta el path si es necesario

@Component({
  selector: 'app-confections-iv',
  imports: [ReactiveFormsModule],
  templateUrl: './confections-iv.html',
  styleUrl: './confections-iv.scss'
})
export class ConfectionsIV {
  images = signal([
    'assets/v15-1.jpg',
    'assets/v15-2.jpg',
    'assets/v15-3.jpg',
    'assets/v15-4.jpg',
    'assets/v15-5.jpg',
    'assets/v15-6.jpg'
  ]);
  parentescos = signal([
    'Madre', 'Padre', 'Hermana', 'Tía', 'Otra'
  ]);
  presupuestos = signal([
    '1000-1500', '1500-2000', '2000+'
  ]);

  loading = false;
  quoteForm: FormGroup;
  selectedFile: File | null = null;
  auth = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.quoteForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern('^[0-9\\s\\-+()]{7,15}$')]],
      fechaEvento: ['', Validators.required],
      parentesco: ['', Validators.required],
      presupuesto: ['', Validators.required],
      direccion: ['', Validators.required],
      distrito: ['', Validators.required],
      mensaje: ['']
    });

    // Autorellenado reactivo si logueado usando signals
    effect(() => {
      if (this.auth.isLoggedIn()) {
        const user = this.auth.currentUser();
        if (user) {
          this.quoteForm.patchValue({
            nombre: user.nombre,
            correo: user.email,
            celular: user.telefono,
            direccion: user.direccion
          });
          this.quoteForm.get('nombre')?.disable();
          this.quoteForm.get('correo')?.disable();
          this.quoteForm.get('telefono')?.disable();
          this.quoteForm.get('direccion')?.disable();
        }
      } else {
        this.quoteForm.get('nombre')?.enable();
        this.quoteForm.get('correo')?.enable();
        this.quoteForm.get('telefono')?.enable();
        this.quoteForm.get('direccion')?.enable();
      }
    });
  }

  hasError(field: string): boolean {
    const control = this.quoteForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file || null;
  }

  onSubmit() {
    if (this.quoteForm.invalid) return;
    this.loading = true;
    setTimeout(() => {
      alert('Enviado!');
      this.loading = false;
      this.quoteForm.reset();
      this.selectedFile = null;

      // Rellenar de nuevo si el usuario sigue logueado
      if (this.auth.isLoggedIn()) {
        const user = this.auth.currentUser();
        if (user) {
          this.quoteForm.patchValue({
            nombre: user.nombre,
            correo: user.email,
            celular: user.telefono,
            direccion: user.direccion
          });
          this.quoteForm.get('nombre')?.disable();
          this.quoteForm.get('correo')?.disable();
          this.quoteForm.get('telefono')?.disable();
          this.quoteForm.get('direccion')?.disable();
        }
      }
    }, 1500);
  }
}
