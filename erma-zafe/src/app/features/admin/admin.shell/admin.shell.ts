import { Component, signal, inject, effect, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service/auth.service';
import { RentalService, Rental } from '../../../services/rental.service/rental.service';
import { io, Socket } from 'socket.io-client';
import { ConfirmDialog } from '../../../alert/confirm-dialog/confirm-dialog';
import { environment } from '../../../../environments/environments'; // <--- IMPORTANTE

interface Notification {
  id: number;
  type: 'late' | 'payment' | 'reservation' | 'info';
  icon: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

@Component({
  selector: 'app-admin.shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ConfirmDialog],
  templateUrl: './admin.shell.html',
  styleUrl: './admin.shell.scss'
})
export class AdminShell implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private rentalService = inject(RentalService);

  // SOCKET.IO - Nueva propiedad
  private socket: Socket | undefined;

  menuOpen = false;
  unreadMessages = signal(3);
  unreadNotifications = signal(0);

  showChatDropdown = signal(false);
  showHelpDropdown = signal(false);
  showNotificationsDropdown = signal(false);
  showUserDropdown = signal(false);

  notifications = signal<Notification[]>([]);
  private notificationInterval: any;

  private readonly PENALIZACION_POR_DIA = 10;

  currentUser = this.authService.currentUser;
  userName = this.authService.userName;
  userEmail = signal<string>('');
  userRole = this.authService.userRole;

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (user?.email) {
        this.userEmail.set(user.email);
      }
    });
  }

  ngOnInit(): void {
    console.log('🔌 Intentando conectar al socket...');
    this.cargarNotificaciones();

    this.notificationInterval = setInterval(() => {
      this.cargarNotificaciones();
    }, 5 * 60 * 1000);

    // 🚩 CAMBIO: Usar environment.apiUrl en el socket:
    this.socket = io(environment.apiUrl);
    this.socket.on('admin-notification', (data: any) => {
      console.log('💡 Notificación recibida:', data);
      const nuevaNoti: Notification = {
        id: Date.now(),
        type: 'payment', // o usa data.type si lo agregas en el backend
        icon: 'assets/icons/notification.svg',
        title: data.titulo || 'Nuevo pago',
        message: data.mensaje || '',
        time: new Date().toLocaleTimeString(),
        unread: true
      };
      this.notifications.update(arr => [nuevaNoti, ...arr]);
      this.unreadNotifications.set(this.unreadNotifications() + 1);
    });
  }

  ngOnDestroy(): void {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  cargarNotificaciones(): void {
    this.rentalService.getAllAdmin().subscribe({
      next: (alquileres: Rental[]) => {
        const notificaciones: Notification[] = [];
        alquileres.forEach(r => {
          if (this.estaRetrasado(r) && r.id !== undefined) {
            const diasRetraso = this.calcularDiasRetraso(r.hasta!);
            const penalizacion = diasRetraso * this.PENALIZACION_POR_DIA;
            const idNumerico = typeof r.id === 'string' ? parseInt(r.id, 10) : r.id;
            notificaciones.push({
              id: idNumerico,
              type: 'late',
              icon: 'assets/icons/alert-triangle.svg',
              title: '⚠️ Alquiler retrasado',
              message: `${r.cliente || 'Cliente'} - ${r.vestido || 'Vestido'} lleva ${diasRetraso} día(s) de retraso. Mora: S/ ${penalizacion}`,
              time: `Desde ${new Date(r.hasta!).toLocaleDateString()}`,
              unread: true
            });
          }
        });
        this.notifications.set(notificaciones);
        this.unreadNotifications.set(notificaciones.filter(n => n.unread).length);
        console.log(`🔔 ${notificaciones.length} notificaciones cargadas`);
      },
      error: (err) => {
        console.error('❌ Error al cargar notificaciones:', err);
      }
    });
  }

  estaRetrasado(alquiler: Rental): boolean {
    if (!alquiler.hasta) return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaHasta = new Date(alquiler.hasta);
    fechaHasta.setHours(0, 0, 0, 0);
    return fechaHasta < hoy && (
      alquiler.estado === 'activo' ||
      alquiler.estado === 'retrasado' ||
      alquiler.estado === 'pendiente'
    );
  }

  calcularDiasRetraso(fechaHasta: string): number {
    if (!fechaHasta) return 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const hasta = new Date(fechaHasta);
    hasta.setHours(0, 0, 0, 0);
    if (hasta >= hoy) return 0;
    const diferencia = Math.floor((hoy.getTime() - hasta.getTime()) / (1000 * 60 * 60 * 24));
    return diferencia > 0 ? diferencia : 0;
  }

  markAsRead(notificationId: number): void {
    this.notifications.update(notifications =>
      notifications.map(n =>
        n.id === notificationId ? { ...n, unread: false } : n
      )
    );
    this.unreadNotifications.set(
      this.notifications().filter(n => n.unread).length
    );
  }

  verTodasLasNotificaciones(): void {
    this.router.navigate(['/admin/alquileres']);
    this.closeAllDropdowns();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleChatDropdown(): void {
    this.showChatDropdown.update(v => !v);
    this.showHelpDropdown.set(false);
    this.showNotificationsDropdown.set(false);
    this.showUserDropdown.set(false);
  }

  toggleHelpDropdown(): void {
    this.showHelpDropdown.update(v => !v);
    this.showChatDropdown.set(false);
    this.showNotificationsDropdown.set(false);
    this.showUserDropdown.set(false);
  }

  toggleNotificationsDropdown(): void {
    this.showNotificationsDropdown.update(v => !v);
    this.showChatDropdown.set(false);
    this.showHelpDropdown.set(false);
    this.showUserDropdown.set(false);
  }

  toggleUserDropdown(): void {
    this.showUserDropdown.update(v => !v);
    this.showChatDropdown.set(false);
    this.showHelpDropdown.set(false);
    this.showNotificationsDropdown.set(false);
  }

  closeAllDropdowns(): void {
    this.showChatDropdown.set(false);
    this.showHelpDropdown.set(false);
    this.showNotificationsDropdown.set(false);
    this.showUserDropdown.set(false);
  }

  goToProfile(): void {
    this.router.navigate(['/admin/perfil']);
    this.closeAllDropdowns();
  }

  goToSettings(): void {
    this.router.navigate(['/admin/ajustes']);
    this.closeAllDropdowns();
  }

  confirmLogout(event: Event): void {
    event.preventDefault();
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      console.log('📤 Cerrando sesión...');
      this.authService.logout();
      console.log('✅ Sesión cerrada correctamente');
    }
    this.closeAllDropdowns();
  }
}
