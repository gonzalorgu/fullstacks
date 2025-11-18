import { Component, OnInit, signal, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { UsuariosForm } from './usuarios.form/usuarios.form';
import { environment } from '../../../../environments/environments'; // 👈 IMPORTANTE

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  dni?: string;
  telefono?: string;
  fechaNacimiento?: string | null;
  direccion?: string;
  isActive: boolean;
  role?: 'admin' | 'user';
  createdAt?: string | Date;
  password?: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class Usuarios implements OnInit {
  private http = inject(HttpClient);
  private dialog = inject(Dialog);

  private readonly API_URL = `${environment.apiUrl}/auth`; // 👈 CAMBIO

  usuarios = signal<Usuario[]>([]);
  usuariosFiltrados = signal<Usuario[]>([]);
  searchTerm = signal('');
  filtroEstado = signal<'todos' | 'activos' | 'inactivos'>('todos');
  ordenPor = signal<'nombre' | 'email' | 'fecha'>('nombre');
  cargando = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.http.get<any[]>(`${this.API_URL}/users`).subscribe({
      next: (data) => {
        const usuariosFormateados: Usuario[] = data.map(u => ({
          id: u.id,
          nombre: u.nombre,
          email: u.email,
          dni: u.dni || '',
          telefono: u.telefono || '',
          fechaNacimiento: u.fechaNacimiento || null,
          direccion: u.direccion || '',
          isActive: u.isActive,
          role: u.role as 'admin' | 'user',
          createdAt: u.createdAt || ''
        }));
        this.usuarios.set(usuariosFormateados);
        this.aplicarFiltros();
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar usuarios');
        this.cargando.set(false);
      }
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.usuarios()];
    const search = this.searchTerm().toLowerCase();
    if (search) {
      resultado = resultado.filter(u =>
        u.nombre.toLowerCase().includes(search)
        || u.email.toLowerCase().includes(search)
        || u.dni?.toLowerCase().includes(search)
        || u.telefono?.includes(search)
        || u.direccion?.toLowerCase().includes(search)
      );
    }
    if (this.filtroEstado() === 'activos') {
      resultado = resultado.filter(u => u.isActive);
    } else if (this.filtroEstado() === 'inactivos') {
      resultado = resultado.filter(u => !u.isActive);
    }
    resultado.sort((a, b) => {
      if (this.ordenPor() === 'nombre') {
        return a.nombre.localeCompare(b.nombre);
      } else if (this.ordenPor() === 'email') {
        return a.email.localeCompare(b.email);
      } else {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      }
    });
    this.usuariosFiltrados.set(resultado);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.aplicarFiltros();
  }

  onFiltroEstadoChange(value: 'todos' | 'activos' | 'inactivos'): void {
    this.filtroEstado.set(value);
    this.aplicarFiltros();
  }

  onOrdenChange(value: 'nombre' | 'email' | 'fecha'): void {
    this.ordenPor.set(value);
    this.aplicarFiltros();
  }

  abrirModalNuevo(): void {
    const dialogRef = this.dialog.open(UsuariosForm, {
      width: '700px',
      maxWidth: '90vw',
      panelClass: 'usuario-modal',
      data: { usuario: null }
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.cargarUsuarios();
      }
    });
  }

  abrirModalEditar(usuario: Usuario): void {
    const dialogRef = this.dialog.open(UsuariosForm, {
      width: '700px',
      maxWidth: '90vw',
      panelClass: 'usuario-modal',
      data: { usuario }
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.cargarUsuarios();
      }
    });
  }

  toggleEstado(usuario: Usuario): void {
    this.http.put(`${this.API_URL}/users/${usuario.id}/toggle-active`, {}).subscribe({
      next: () => {
        this.cargarUsuarios();
      },
      error: () => {
        this.error.set('Error al cambiar estado');
      }
    });
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.http.delete(`${this.API_URL}/users/${id}`).subscribe({
        next: () => {
          this.cargarUsuarios();
        },
        error: () => {
          this.error.set('Error al eliminar usuario');
        }
      });
    }
  }

  exportarCSV(): void {
    const headers = [
      'ID', 'Nombre', 'Email', 'DNI', 'Teléfono',
      'Fecha Nac.', 'Dirección', 'Estado', 'Rol'
    ];
    const rows = this.usuariosFiltrados().map(u => [
      u.id,
      u.nombre,
      u.email,
      u.dni || '',
      u.telefono || '',
      u.fechaNacimiento ? new Date(u.fechaNacimiento).toLocaleDateString() : '',
      u.direccion || '',
      u.isActive ? 'Activo' : 'Inactivo',
      u.role || ''
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
