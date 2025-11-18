import { Component, Inject, OnInit, Optional, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments'; // 👈 AGREGADO

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  dni?: string;
  telefono?: string;
  fechaNacimiento?: string | Date;
  direccion?: string;
  isActive: boolean;
  role?: 'admin' | 'user';
  password?: string;
  createdAt?: Date;
}

interface RolOption {
  value: 'admin' | 'user';
  label: string;
}

@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.form.html',
  styleUrls: ['./usuarios.form.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsuariosForm implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  private readonly API_URL = `${environment.apiUrl}/auth`; // 👈 CAMBIO

  @Optional() dialogRef = inject(DialogRef<Usuario | undefined>);
  @Optional() @Inject(DIALOG_DATA) data = inject(DIALOG_DATA) as { usuario: Usuario | null };

  usuarioForm!: FormGroup;
  cargando = false;
  error: string | null = null;

  roles: RolOption[] = [
    { value: 'user', label: 'Usuario' },
    { value: 'admin', label: 'Administrador' }
  ];

  ngOnInit(): void {
    this.initForm();
    if (this.data?.usuario) {
      this.usuarioForm.patchValue({
        nombre: this.data.usuario.nombre,
        email: this.data.usuario.email,
        dni: this.data.usuario.dni || '',
        telefono: this.data.usuario.telefono || '',
        fechaNacimiento: this.data.usuario.fechaNacimiento || '',
        direccion: this.data.usuario.direccion || '',
        role: this.data.usuario.role || 'user',
        isActive: this.data.usuario.isActive
      });
      this.usuarioForm.get('email')?.disable();
    }
  }

  initForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [
        Validators.required,
        Validators.pattern(/^d{8}$/)
      ]],
      telefono: ['', [Validators.pattern(/^[0-9]{9,15}$|^$/)]],
      fechaNacimiento: ['', [Validators.required]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      role: ['user', Validators.required],
      isActive: [true],
      password: ['', this.data?.usuario ? [] : [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      console.error('❌ Formulario inválido');
      Object.keys(this.usuarioForm.controls).forEach(key => {
        this.usuarioForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.cargando = true;
    this.error = null;

    const formData = this.usuarioForm.getRawValue();

    if (this.isEditMode && this.data?.usuario?.id) {
      // ✅ EDITAR USUARIO
      const datosActualizacion = {
        nombre: formData.nombre,
        dni: String(formData.dni || '').trim(),
        telefono: formData.telefono || '',
        fechaNacimiento: this.formatDateToISO(formData.fechaNacimiento),
        direccion: formData.direccion || ''
      };

      this.http.put<Usuario>(
        `${this.API_URL}/users/${this.data.usuario.id}`,
        datosActualizacion
      ).subscribe({
        next: (result) => {
          console.log('✅ Usuario actualizado:', result);
          this.cargando = false;
          this.dialogRef?.close(result);
        },
        error: (err) => {
          console.error('❌ Error actualizando:', err);
          this.error = err.error?.message || 'Error al actualizar usuario';
          this.cargando = false;
        }
      });
    } else {
      // ✅ CREAR NUEVO USUARIO
      const nuevoUsuario = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        dni: String(formData.dni || '').trim(),
        telefono: formData.telefono?.trim() || '',
        fechaNacimiento: this.formatDateToISO(formData.fechaNacimiento),
        direccion: formData.direccion?.trim() || '',
        password: formData.password,
        role: formData.role
      };

      console.log('📤 Enviando datos:', nuevoUsuario);

      this.http.post<Usuario>(
        `${this.API_URL}/register`,
        nuevoUsuario
      ).subscribe({
        next: (result) => {
          console.log('✅ Usuario creado:', result);
          this.cargando = false;
          this.dialogRef?.close(result);
        },
        error: (err) => {
          console.error('❌ Error creando:', err);
          this.error = err.error?.message || 'Error al crear usuario';
          this.cargando = false;
        }
      });
    }
  }

  private formatDateToISO(date: string | Date | null): string {
    if (!date) return '';

    try {
      if (typeof date === 'string') {
        const dateObj = new Date(date + 'T00:00:00');
        return dateObj.toISOString();
      }

      if (date instanceof Date) {
        return date.toISOString();
      }
      return '';
    } catch (error) {
      console.error('❌ Error al formatear fecha:', error);
      return '';
    }
  }

  onCancel(): void {
    this.dialogRef?.close(undefined);
  }

  get f() {
    return this.usuarioForm.controls;
  }

  get isEditMode(): boolean {
    return !!this.data?.usuario;
  }

  get isPasswordRequired(): boolean {
    return !this.isEditMode;
  }
}
