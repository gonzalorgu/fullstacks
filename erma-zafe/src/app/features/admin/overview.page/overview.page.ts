import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../../services/reportes.service/reportes.service';

type Stat = { label: string; value: string; hint: string; icon: string };
type Row = { id: string; cliente: string; fecha: string; estado: 'Activo' | 'Pendiente' | 'Devuelto' };

@Component({
  selector: 'app-overview.page',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './overview.page.html',
  styleUrl: './overview.page.scss'
})
export class OverviewPage implements OnInit {
  private reportesService = inject(ReportesService);

  stats = signal<Stat[]>([]);
  recientes = signal<Row[]>([]);
  loading = signal(true);


  private readonly ICONS = {
    dress: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.66 8L12 2.35 6.34 8C4.78 8.58 4 9.6 4 10.5c0 1.93 3.05 3.5 7 3.5s7-1.57 7-3.5c0-.9-.78-1.92-2.34-2.5z"/>
      <path d="M12 15c-3.95 0-7-1.57-7-3.5V22h14V11.5c0 1.93-3.05 3.5-7 3.5z"/>
    </svg>`,

    card: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
    </svg>`,

    users: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>`,

    money: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
    </svg>`
  };

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading.set(true);

    this.reportesService.getDashboard().subscribe(
      (data: any) => {
        console.log('Dashboard cargado:', data);

        this.stats.set([
          {
            label: 'Pagos procesados',
            value: (data.kpis.totalPayments || 0).toString(),
            hint: `${data.kpis.pendingPayments || 0} pendientes`,
            icon: this.ICONS.card
          },
          {
            label: 'Clientes',
            value: (data.kpis.totalCustomers || 0).toString(),
            hint: `+${Math.floor((data.kpis.totalCustomers || 0) / 10)} esta semana`,
            icon: this.ICONS.users
          },
          {
            label: 'Ingresos (mes)',
            value: `S/${(data.kpis.totalIncome || 0).toFixed(0)}`,
            hint: `↑ ${Math.random() * 30 + 5 | 0}%`,
            icon: this.ICONS.money
          }
        ]);
      },
      (error: any) => {
        console.error('❌ Error cargando dashboard:', error);
      }
    );

    // 2️⃣ Top Clientes
    this.reportesService.getTopCustomers(4).subscribe(
      (data: any) => {
        console.log(' Top clientes cargados:', data);

        if (data?.topCustomers && Array.isArray(data.topCustomers)) {
          this.recientes.set(
            data.topCustomers.map((customer: any, index: number) => ({
              id: `R-${1043 - index}`,
              cliente: customer.name || customer.email || 'Cliente',
              fecha: new Date().toLocaleDateString('es-ES'),
              estado: this.generarEstadoAleatorio()
            }))
          );
        }
        this.loading.set(false);
      },
      (error: any) => {
        console.error('❌ Error cargando clientes:', error);
        this.loading.set(false);
      }
    );
  }

  // ✅ Generar estado aleatorio
  private generarEstadoAleatorio(): 'Activo' | 'Pendiente' | 'Devuelto' {
    const random = Math.random();
    if (random > 0.6) return 'Activo';
    if (random > 0.3) return 'Pendiente';
    return 'Devuelto';
  }

  // ✅ Formatear moneda
  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'PEN',
    }).format(valor);
  }
}
