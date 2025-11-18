import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileStore, TallaPref } from '../profile.store/profile.store';

@Component({
  selector: 'app-profile.page',
  imports: [CommonModule],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss'
})
export class ProfilePage {
  store = inject(ProfileStore);

  readonly tallas: ReadonlyArray<TallaPref> = ['S', 'M', 'L', 'XL'] as const;

  // Señales para contraseñas
  passActual = signal('');
  passNueva = signal('');
  passRepite = signal('');

  // Señales para mensajes y estados
  mensajeDatos = signal('');
  errorDatos = signal(false);
  guardandoDatos = signal(false);

  mensajePassword = signal('');
  errorPassword = signal(false);
  guardandoPassword = signal(false);

  // Validaciones computadas
  telefonoInvalido = computed(() => {
    const tel = this.store.profile().telefono;
    return tel && (tel.length !== 9 || !tel.startsWith('9'));
  });

  datosValidos = computed(() => {
    const p = this.store.profile();
    return p.nombre && p.telefono && !this.telefonoInvalido();
  });

  passwordValida = computed(() => {
    return this.passActual() &&
           this.passNueva().length >= 6 &&
           this.passNueva() === this.passRepite();
  });

  // Obtener iniciales para avatar
  getInitials(): string {
    const nombre = this.store.profile().nombre || 'U';
    const partes = nombre.split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.slice(0, 2).toUpperCase();
  }

  // === HANDLERS DE CAMPOS EDITABLES ===

  onNombre(e: Event) {
    this.store.setCampo('nombre', (e.target as HTMLInputElement).value);
    this.limpiarMensajeDatos();
  }

  onTelefono(e: Event) {
    const valor = (e.target as HTMLInputElement).value;
    // Solo permitir números y máximo 9 caracteres
    const limpio = valor.replace(/D/g, '').slice(0, 9);
    this.store.setCampo('telefono', limpio);
    this.limpiarMensajeDatos();
  }

  onDireccion(e: Event) {
    this.store.setCampo('direccion', (e.target as HTMLInputElement).value);
    this.limpiarMensajeDatos();
  }

  onTalla(t: TallaPref) {
    this.store.setTallaPref(t);
  }

  // === HANDLERS DE CONTRASEÑA ===

  onPassActual(e: Event) {
    this.passActual.set((e.target as HTMLInputElement).value);
    this.limpiarMensajePassword();
  }

  onPassNueva(e: Event) {
    this.passNueva.set((e.target as HTMLInputElement).value);
    this.limpiarMensajePassword();
  }

  onPassRepite(e: Event) {
    this.passRepite.set((e.target as HTMLInputElement).value);
    this.limpiarMensajePassword();
  }

  // === AVATAR ===

  onPickAvatar(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validar tamaño (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen debe pesar menos de 2MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes');
      return;
    }

    const fr = new FileReader();
    fr.onload = () => this.store.setAvatar(String(fr.result));
    fr.readAsDataURL(file);
  }

  limpiarAvatar() {
    this.store.setAvatar(null);
  }

  // === GUARDAR DATOS ===

  async guardarDatos() {
    if (!this.datosValidos()) return;

    this.guardandoDatos.set(true);
    this.limpiarMensajeDatos();

    try {
      await this.store.guardarCambios();
      this.mensajeDatos.set('✅ Cambios guardados correctamente');
      this.errorDatos.set(false);

      setTimeout(() => this.limpiarMensajeDatos(), 3000);
    } catch (error: any) {
      this.mensajeDatos.set(error.message || '❌ Error al guardar los cambios');
      this.errorDatos.set(true);
    } finally {
      this.guardandoDatos.set(false);
    }
  }

  // === GUARDAR CONTRASEÑA ===

  async guardarPassword() {
    if (!this.passwordValida()) return;

    this.guardandoPassword.set(true);
    this.limpiarMensajePassword();

    try {
      await this.store.actualizarPassword(
        this.passActual(),
        this.passNueva(),
        this.passRepite()
      );

      this.mensajePassword.set('✅ Contraseña actualizada correctamente');
      this.errorPassword.set(false);

      this.passActual.set('');
      this.passNueva.set('');
      this.passRepite.set('');

      setTimeout(() => this.limpiarMensajePassword(), 3000);
    } catch (error: any) {
      this.mensajePassword.set(error.message || '❌ Error al cambiar la contraseña');
      this.errorPassword.set(true);
    } finally {
      this.guardandoPassword.set(false);
    }
  }

  // === MÉTODOS AUXILIARES ===

  private limpiarMensajeDatos() {
    this.mensajeDatos.set('');
    this.errorDatos.set(false);
  }

  private limpiarMensajePassword() {
    this.mensajePassword.set('');
    this.errorPassword.set(false);
  }
}
