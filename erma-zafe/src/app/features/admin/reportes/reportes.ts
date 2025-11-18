import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ReportesService,
  DashboardResponse,
  MonthlyIncomeResponse,
  PaymentMethodsResponse,
  TopCustomersResponse,
  SummaryResponse,
  LateReservation,
  LateReportSummary,
} from '../../../services/reportes.service/reportes.service';
import { PrintService } from '../../../services/print.service/print.service';
import { RentalService, Rental } from '../../../services/rental.service/rental.service';
import { ConfirmService } from '../../../services/confirm/confirm';
import { environment } from '../../../../environments/environments'; // 👈 IMPORTANTE

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class Reportes implements OnInit {
  private reportesService = inject(ReportesService);
  private printService = inject(PrintService);
  private rentalService = inject(RentalService);
  private confirmService = inject(ConfirmService);

  private readonly PENALIZACION_POR_DIA = 10;

  dashboard = signal<DashboardResponse | null>(null);
  monthlyIncome = signal<MonthlyIncomeResponse | null>(null);
  paymentMethods = signal<PaymentMethodsResponse | null>(null);
  topCustomers = signal<TopCustomersResponse | null>(null);
  summary = signal<SummaryResponse | null>(null);
  lateReservations = signal<LateReservation[]>([]);
  lateReportSummary = signal<LateReportSummary | null>(null);
  totalAtrasos = signal<number>(0);
  montoMoras = signal<number>(0);
  promedioDias = signal<number>(0);
  alquileresRetrasados = signal<Rental[]>([]);
  loading = signal(true);
  selectedYear = signal(new Date().getFullYear());
  startDate = signal('');
  endDate = signal('');

  ngOnInit(): void {
    this.cargarDatos();
    this.calcularEstadisticasRetrasos();

    setInterval(() => {
      this.calcularEstadisticasRetrasos();
    }, 5 * 60 * 1000);
  }

  cargarDatos(): void {
    this.loading.set(true);

    this.reportesService
      .getDashboard(this.startDate() || undefined, this.endDate() || undefined)
      .subscribe(
        (data) => {
          this.dashboard.set(data);
          this.loading.set(false);
        },
        (error) => {
          this.loading.set(false);
          this.confirmService.showMessage('❌ Error cargando dashboard', 'danger', 'Error');
        },
      );

    this.reportesService.getMonthlyIncome(this.selectedYear()).subscribe(
      (data) => this.monthlyIncome.set(data),
      (error) => this.confirmService.showMessage('❌ Error cargando ingresos mensuales', 'danger', 'Error'),
    );

    this.reportesService
      .getPaymentMethods(
        this.startDate() || undefined,
        this.endDate() || undefined,
      )
      .subscribe(
        (data) => this.paymentMethods.set(data),
        (error) => this.confirmService.showMessage('❌ Error cargando métodos de pago', 'danger', 'Error'),
      );

    this.reportesService
      .getTopCustomers(5, this.startDate() || undefined, this.endDate() || undefined)
      .subscribe(
        (data) => this.topCustomers.set(data),
        (error) => this.confirmService.showMessage('❌ Error cargando clientes', 'danger', 'Error'),
      );

    this.reportesService
      .getSummary(this.startDate() || undefined, this.endDate() || undefined)
      .subscribe(
        (data) => this.summary.set(data),
        (error) => this.confirmService.showMessage('❌ Error cargando resumen', 'danger', 'Error'),
      );

    this.cargarReporteAtrasos();
  }

  cargarReporteAtrasos(): void {
    this.reportesService.getLateReservations().subscribe(
      (data) => this.lateReservations.set(data),
      (error) => this.confirmService.showMessage('❌ Error cargando atrasos', 'danger', 'Error')
    );
    this.reportesService.getLateReportSummary().subscribe(
      (data) => this.lateReportSummary.set(data),
      (error) => this.confirmService.showMessage('❌ Error cargando resumen de atrasos', 'danger', 'Error')
    );
  }

  estaRetrasado(alquiler: Rental): boolean {
    if (!alquiler.hasta) return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaHasta = new Date(alquiler.hasta);
    fechaHasta.setHours(0, 0, 0, 0);
    return fechaHasta < hoy &&
           (alquiler.estado === 'activo' ||
            alquiler.estado === 'retrasado' ||
            alquiler.estado === 'pendiente');
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

  calcularEstadisticasRetrasos(): void {
    this.rentalService.getAllAdmin().subscribe({
      next: (alquileres: Rental[]) => {
        const retrasados = alquileres.filter(a => this.estaRetrasado(a));
        retrasados.forEach(r => {
          r.diasRetraso = this.calcularDiasRetraso(r.hasta!);
          r.penalizacion = r.diasRetraso * this.PENALIZACION_POR_DIA;
        });
        this.totalAtrasos.set(retrasados.length);
        const totalPenalizacion = retrasados.reduce((sum, r) =>
          sum + (r.penalizacion || 0), 0
        );
        this.montoMoras.set(totalPenalizacion);
        const promedioDias = retrasados.length > 0
          ? Math.round(
              retrasados.reduce((sum, r) => sum + (r.diasRetraso || 0), 0) /
              retrasados.length
            )
          : 0;
        this.promedioDias.set(promedioDias);
        this.alquileresRetrasados.set(retrasados);
      },
      error: (err) => {
        this.confirmService.showMessage('❌ Error al cargar estadísticas de retrasos', 'danger', 'Error');
      }
    });
  }

  getImageUrl(imagen: string | null | undefined): string {
    if (!imagen) return '';
    if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
      return imagen;
    }
    if (imagen.startsWith('/')) {
      return `${environment.apiUrl}${imagen}`;
    }
    return `${environment.apiUrl}/${imagen}`;
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  getDaysLateClass(days: number): string {
    if (days > 7) return 'severe';
    if (days > 3) return 'moderate';
    return 'minor';
  }

  cambiarAño(año: number): void {
    this.selectedYear.set(año);
    this.cargarDatos();
  }

  imprimirReporte(): void {
    if (
      this.dashboard() &&
      this.topCustomers() &&
      this.monthlyIncome() &&
      this.paymentMethods()
    ) {
      const html = this.printService.generateReportHTML(
        this.dashboard(),
        this.topCustomers(),
        this.monthlyIncome(),
        this.paymentMethods(),
      );
      this.printService.imprimirReporte(html);
    } else {
      this.confirmService.showMessage('❌ Datos no disponibles para imprimir', 'warning', 'Datos incompletos');
    }
  }

  descargarReporteHTML(): void {
    if (
      this.dashboard() &&
      this.topCustomers() &&
      this.monthlyIncome() &&
      this.paymentMethods()
    ) {
      const html = this.printService.generateReportHTML(
        this.dashboard(),
        this.topCustomers(),
        this.monthlyIncome(),
        this.paymentMethods(),
      );
      this.printService.descargarReporte(html);
    } else {
      this.confirmService.showMessage('❌ Datos no disponibles para descargar', 'warning', 'Datos incompletos');
    }
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'PEN',
    }).format(valor);
  }

  formatearPorcentaje(valor: number): string {
    return valor.toFixed(2) + '%';
  }
}
