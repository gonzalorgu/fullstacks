import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss'
})
export class RegisterPage {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentStep = signal(1);
  nombre = signal('');
  email = signal('');
  pass = signal('');
  confirm = signal('');
  telefono = signal('');
  dni = signal('');
  fechaNacimiento = signal('');
  direccion = signal('');
  error = signal<string | null>(null);
  loading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  onNombre(e: Event) {
    this.nombre.set((e.target as HTMLInputElement).value.trim());
  }

  onEmail(e: Event) {
    this.email.set((e.target as HTMLInputElement).value.trim());
  }

  onPass(e: Event) {
    this.pass.set((e.target as HTMLInputElement).value);
  }

  onConfirm(e: Event) {
    this.confirm.set((e.target as HTMLInputElement).value);
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update(v => !v);
  }

  onTelefono(e: Event) {
    const value = (e.target as HTMLInputElement).value.trim();
    this.telefono.set(value.replace(/D/g, ''));
  }

  onDni(e: Event) {
    const value = (e.target as HTMLInputElement).value.trim();
    this.dni.set(value.replace(/D/g, ''));
  }

  onFechaNacimiento(e: Event) {
    this.fechaNacimiento.set((e.target as HTMLInputElement).value);
  }

  onDireccion(e: Event) {
    this.direccion.set((e.target as HTMLInputElement).value.trim());
  }

  validateStep(step: number): boolean {
    this.error.set(null);

    switch (step) {
      case 1:
        if (!this.nombre() || !this.email()) {
          this.error.set('Completa nombre y email');
          return false;
        }
        const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
        if (!emailRegex.test(this.email())) {
          this.error.set('Email inválido');
          return false;
        }
        return true;

      case 2:
        if (!this.pass() || !this.confirm()) {
          this.error.set('Completa las contraseñas');
          return false;
        }
        if (this.pass().length < 6) {
          this.error.set('Mínimo 6 caracteres');
          return false;
        }
        if (this.pass() !== this.confirm()) {
          this.error.set('Las contraseñas no coinciden');
          return false;
        }
        return true;

      case 3:
        if (!this.telefono()) {
          this.error.set('Ingresa el teléfono');
          return false;
        }
        if (this.telefono().length !== 9) {
          this.error.set('El teléfono debe tener 9 dígitos');
          return false;
        }
        if (!/^9/.test(this.telefono())) {
          this.error.set('El teléfono debe comenzar con 9');
          return false;
        }
        return true;

      case 4:
        if (!this.dni() || !this.fechaNacimiento() || !this.direccion()) {
          this.error.set('Completa todos los campos');
          return false;
        }
        if (this.dni().length !== 8) {
          this.error.set('El DNI debe tener 8 dígitos');
          return false;
        }
        return true;

      default:
        return false;
    }
  }

  nextStep() {
    if (this.validateStep(this.currentStep())) {
      if (this.currentStep() < 4) {
        this.currentStep.update(s => s + 1);
        this.error.set(null);
      }
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
      this.error.set(null);
    }
  }

  submit() {
    console.log('🔴 SUBMIT LLAMADO');
    console.log('📞 Teléfono actual:', this.telefono());
    console.log('🆔 DNI actual:', this.dni());
    console.log('✅ Paso actual:', this.currentStep());

    if (!this.validateStep(this.currentStep())) {
      console.log('❌ Validación falló');
      return;
    }

    const registerData = {
      email: this.email(),
      password: this.pass(),
      nombre: this.nombre(),
      telefono: this.telefono(),
      dni: this.dni(),
      fechaNacimiento: this.fechaNacimiento(),
      direccion: this.direccion()
    };

    console.log('📤 Datos a enviar:', registerData);
    console.log('📏 Longitud teléfono:', registerData.telefono.length);
    console.log('📏 Longitud DNI:', registerData.dni.length);

    if (registerData.telefono.length !== 9) {
      this.error.set('El teléfono debe tener 9 dígitos');
      console.log('❌ Teléfono inválido:', registerData.telefono);
      return;
    }

    if (registerData.dni.length !== 8) {
      this.error.set('El DNI debe tener 8 dígitos');
      console.log('❌ DNI inválido:', registerData.dni);
      return;
    }

    this.loading.set(true);

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('✅ Registro exitoso:', response);

        // Verificar si hay un pedido pendiente guardado
        const pendingOrderStr = localStorage.getItem('pendingOrder');

        if (pendingOrderStr) {
          try {
            const pendingOrder = JSON.parse(pendingOrderStr);
            console.log('📦 Pedido pendiente encontrado:', pendingOrder);

            // Limpiar el pedido pendiente
            localStorage.removeItem('pendingOrder');

            // Redirigir al detalle del vestido para completar el pedido
            const dressId = pendingOrder.dressData?.id || pendingOrder.dressData?.dressId;
            this.router.navigate(['/vestido', dressId], {
              state: {
                reopenModal: true,
                modalData: pendingOrder
              }
            });
          } catch (e) {
            console.error('❌ Error al procesar pedido pendiente:', e);
            this.navigateByRole(response.user.role);
          }
        } else {
          // No hay pedido pendiente, navegar normalmente
          this.navigateByRole(response.user.role);
        }
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.error.set(err.message || 'Error al crear la cuenta');
        this.loading.set(false);
      }
    });
  }

  private navigateByRole(role: string) {
    if (role === 'admin') {
      this.router.navigate(['/admin/inicio']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
