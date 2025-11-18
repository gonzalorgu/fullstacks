import { Injectable, signal, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service/auth.service';
import { firstValueFrom } from 'rxjs';

export type TallaPref = 'S' | 'M' | 'L' | 'XL';

export interface UserProfile {
  nombre: string;
  email: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
  tallaPref: TallaPref | null;
  avatarUrl: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProfileStore {
  private authService = inject(AuthService);

  profile = signal<UserProfile>({
    nombre: '',
    email: '',
    telefono: '',
    dni: '',
    fechaNacimiento: '',
    direccion: '',
    tallaPref: null,
    avatarUrl: null,
  });

  constructor() {
    this.loadProfileFromAuth();
  }

  /**
   * Carga el perfil desde el usuario autenticado (localStorage o memoria)
   */
  private loadProfileFromAuth() {
    const user = this.authService.currentUser();
    if (user) {
      this.profile.update(p => ({
        ...p,
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
        dni: user.dni || '',
        fechaNacimiento: user.fechaNacimiento || '',
        direccion: user.direccion || '',
      }));
    }
  }

  /**
   * Actualiza un campo del perfil localmente (sin guardar en backend)
   */
  setCampo<K extends keyof UserProfile>(k: K, v: UserProfile[K]) {
    this.profile.update(p => ({ ...p, [k]: v }));
  }

  /**
   * Actualiza la talla preferida
   */
  setTallaPref(v: TallaPref | null) {
    this.setCampo('tallaPref', v);
  }

  /**
   * Actualiza el avatar (base64 o URL)
   */
  setAvatar(url: string | null) {
    this.setCampo('avatarUrl', url);
  }

  /**
   * Guarda los cambios del perfil en el backend
   * Solo envía los campos que acepta UpdateProfileDto: nombre, telefono, direccion
   */
  async guardarCambios(): Promise<void> {
    const currentProfile = this.profile();

    // Validaciones
    if (!currentProfile.nombre?.trim()) {
      throw new Error('El nombre es obligatorio');
    }

    if (!currentProfile.telefono?.trim()) {
      throw new Error('El teléfono es obligatorio');
    }

    if (currentProfile.telefono.length !== 9 || !currentProfile.telefono.startsWith('9')) {
      throw new Error('El teléfono debe tener 9 dígitos y empezar con 9');
    }

    try {
      // Convertir Observable a Promise
      const user = await firstValueFrom(
        this.authService.updateProfile({
          nombre: currentProfile.nombre,
          telefono: currentProfile.telefono,
          direccion: currentProfile.direccion || '',
        })
      );

      console.log('✅ Perfil actualizado en el backend:', user);

      // Actualizar el perfil local con la respuesta del servidor
      this.profile.update(p => ({
        ...p,
        nombre: user.nombre || p.nombre,
        telefono: user.telefono || p.telefono,
        direccion: user.direccion || p.direccion,
      }));

      return Promise.resolve();
    } catch (error: any) {
      console.error('❌ Error al guardar perfil:', error);
      throw new Error(
        error?.error?.message ||
        error?.message ||
        'Error al guardar los cambios'
      );
    }
  }

  /**
   * Actualiza la contraseña del usuario
   * Acepta ChangePasswordDto: oldPassword, newPassword
   */
  async actualizarPassword(
    actual: string,
    nueva: string,
    repetir: string
  ): Promise<void> {
    // Validaciones en el cliente
    if (!actual || !nueva || !repetir) {
      throw new Error('Completa todos los campos de contraseña');
    }

    if (nueva.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
    }

    if (nueva !== repetir) {
      throw new Error('Las contraseñas no coinciden');
    }

    try {
      // Convertir Observable a Promise
      await firstValueFrom(
        this.authService.changePassword({
          oldPassword: actual,
          newPassword: nueva
        })
      );

      console.log('✅ Contraseña actualizada exitosamente');
      return Promise.resolve();
    } catch (error: any) {
      console.error('❌ Error al cambiar contraseña:', error);
      throw new Error(
        error?.error?.message ||
        error?.message ||
        'Error al cambiar la contraseña. Verifica tu contraseña actual.'
      );
    }
  }

  /**
   * Limpia el perfil (útil para logout)
   */
  limpiarPerfil(): void {
    this.profile.set({
      nombre: '',
      email: '',
      telefono: '',
      dni: '',
      fechaNacimiento: '',
      direccion: '',
      tallaPref: null,
      avatarUrl: null,
    });
  }
}
