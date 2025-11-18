import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service/auth.service';

@Component({
  selector: 'app-recover.page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recover.page.html',
  styleUrl: './recover.page.scss'
})
export class RecoverPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  email = signal('');

  onEmail(e: Event) {
    this.email.set((e.target as HTMLInputElement).value.trim());
  }

  sendCode() {
    this.error.set(null);
    this.success.set(false);

    // Validación de email
    if (!this.email()) {
      this.error.set('Ingresa tu correo');
      return;
    }

    const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.error.set('Ingresa un correo válido');
      return;
    }

    this.loading.set(true);

    // ✨ LLAMADA AL BACKEND REAL
    this.authService.resetPassword({
      email: this.email()
    }).subscribe({
      next: (response) => {
        console.log('✅ Reset password exitoso:', response);
        this.loading.set(false);
        this.success.set(true);

        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        console.error('❌ Error en reset password:', err);
        this.error.set(err.message || 'Error al enviar el correo');
        this.loading.set(false);
      }
    });
  }
}
