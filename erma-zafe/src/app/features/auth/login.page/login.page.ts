import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service/auth.service';

@Component({
  selector: 'app-login.page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  private router = inject(Router);
  private authService = inject(AuthService);

  email = signal('');
  pass = signal('');
  error = signal<string | null>(null);
  loading = signal(false);
  showPassword = signal(false);

  onEmail(e: Event) {
    this.email.set((e.target as HTMLInputElement).value.trim().toLowerCase()); // ✅ TRIM + LOWERCASE
  }

  onPass(e: Event) {
    this.pass.set((e.target as HTMLInputElement).value.trim()); // ✅ TRIM
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  submit() {
    this.error.set(null);

    // Validación
    if (!this.email() || !this.pass()) {
      this.error.set('Completa correo y contraseña');
      return;
    }

    // Validación de email
    const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.error.set('Ingresa un correo válido');
      return;
    }

    this.loading.set(true);

    console.log('📤 Enviando login con:', {
      email: this.email(),
      password: this.pass()
    });

    // ✨ LLAMADA AL BACKEND REAL
    this.authService.login({
      email: this.email(),
      password: this.pass()
    }).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso:', response);
        this.loading.set(false);

        // Redirigir según el rol
        if (response.user.role === 'admin') {
          this.router.navigate(['/admin/inicio']);
        } else {
          this.router.navigate(['/inicio']);
        }
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        this.error.set(err.message || 'Credenciales incorrectas');
        this.loading.set(false);
      }
    });
  }
}
