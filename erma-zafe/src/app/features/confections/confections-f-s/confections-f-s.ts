import { Component, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service/auth.service'; // Cambia el path si es necesario

@Component({
  selector: 'app-confections-f-s',
  imports: [ReactiveFormsModule],
  templateUrl: './confections-f-s.html',
  styleUrl: './confections-f-s.scss'
})
export class ConfectionsFS {

  imgUrl = 'assets/tu-imagen.jpg'; // Ya no uses signal
  submitting = false; // Boolean normal

  orderForm: FormGroup;
  selectedFile: File | null = null;
  auth = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern('^[0-9\\s\\-+()]{7,15}$')]],
      mensaje: [''],
    });

    // Autorellenado reactivo con signals y perfil
    effect(() => {
      if (this.auth.isLoggedIn()) {
        const user = this.auth.currentUser();
        if (user) {
          this.orderForm.patchValue({
            nombre: user.nombre,
            correo: user.email,
            celular: user.telefono
          });
          this.orderForm.get('nombre')?.disable();
          this.orderForm.get('correo')?.disable();
          this.orderForm.get('celular')?.disable();
        }
      } else {
        this.orderForm.get('nombre')?.enable();
        this.orderForm.get('correo')?.enable();
        this.orderForm.get('celular')?.enable();
      }
    });
  }

  hasError(field: string): boolean {
    const control = this.orderForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file || null;
  }

  submitOrder() {
    if (this.orderForm.invalid) return;
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      alert('Formulario enviado correctamente');
      this.orderForm.reset();
      this.selectedFile = null;

      // Vuelve a rellenar si está logueado
      if (this.auth.isLoggedIn()) {
        const user = this.auth.currentUser();
        if (user) {
          this.orderForm.patchValue({
            nombre: user.nombre,
            correo: user.email,
            celular: user.telefono
          });
          this.orderForm.get('nombre')?.disable();
          this.orderForm.get('correo')?.disable();
          this.orderForm.get('telefono')?.disable();
        }
      }
    }, 1300);
  }
}
