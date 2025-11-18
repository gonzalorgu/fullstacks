import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface DashboardKPIs {
  totalIncome: number;
  totalPayments: number;
  pendingPayments: number;
  totalCustomers: number;
  activeRentals: number;
  completedRentals: number;
}

export interface DashboardResponse {
  period: { startDate: Date; endDate: Date };
  kpis: DashboardKPIs;
  timestamp: Date;
}

export interface MonthlyData {
  month: string;
  income: number;
  transactions: number;
}

export interface MonthlyIncomeResponse {
  year: number;
  months: MonthlyData[];
}

export interface PaymentMethodData {
  method: string;
  count: number;
  total: number;
}

export interface PaymentMethodsResponse {
  period: { startDate: Date; endDate: Date };
  methods: PaymentMethodData[];
}

export interface TopCustomerData {
  email: string;
  name: string;
  rentals: number;
  totalSpent: number;
}

export interface TopCustomersResponse {
  period: { startDate: Date; endDate: Date };
  topCustomers: TopCustomerData[];
}

export interface TopDressData {
  dressId: string;
  rentals: number;
}

export interface TopDressesResponse {
  topDresses: TopDressData[];
}

export interface SummaryResponse {
  period: { startDate: Date; endDate: Date };
  metrics: {
    totalRevenue: number;
    averageTransactionValue: number;
    successRate: number;
    conversionMetrics: {
      totalCustomers: number;
      payingCustomers: number;
      conversionRate: number;
    };
  };
}

// ✅ NUEVAS INTERFACES PARA REPORTE DE ATRASOS
export interface LateReservation {
  id: string;
  reservationId: string;
  clientName: string;
  clientPhone: string;
  dressName: string;
  dressImage: string | null;
  rentalStartDate: string;
  rentalEndDate: string;
  actualReturnDate?: string;
  daysLate: number;
  lateFee: number;
  status: string;
}

export interface LateReportSummary {
  totalLateReservations: number;
  totalLateFees: number;
  averageDaysLate: number;
}

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reports`;

  getDashboard(startDate?: string, endDate?: string): Observable<DashboardResponse> {
    let url = `${this.apiUrl}/dashboard`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return this.http.get<DashboardResponse>(url);
  }

  getMonthlyIncome(year?: number): Observable<MonthlyIncomeResponse> {
    let url = `${this.apiUrl}/monthly-income`;
    if (year) {
      url += `?year=${year}`;
    }
    return this.http.get<MonthlyIncomeResponse>(url);
  }

  getPaymentMethods(startDate?: string, endDate?: string): Observable<PaymentMethodsResponse> {
    let url = `${this.apiUrl}/payment-methods`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return this.http.get<PaymentMethodsResponse>(url);
  }

  getTopCustomers(limit?: number, startDate?: string, endDate?: string): Observable<TopCustomersResponse> {
    let url = `${this.apiUrl}/top-customers`;
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    return this.http.get<TopCustomersResponse>(url);
  }

  getTopDresses(limit?: number): Observable<TopDressesResponse> {
    let url = `${this.apiUrl}/top-dresses`;
    if (limit) {
      url += `?limit=${limit}`;
    }
    return this.http.get<TopDressesResponse>(url);
  }

  getSummary(startDate?: string, endDate?: string): Observable<SummaryResponse> {
    let url = `${this.apiUrl}/summary`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return this.http.get<SummaryResponse>(url);
  }

  // ✅ NUEVOS MÉTODOS PARA REPORTE DE ATRASOS
  getLateReservations(): Observable<LateReservation[]> {
    return this.http.get<LateReservation[]>(`${this.apiUrl}/late-reservations`);
  }

  getLateReportSummary(): Observable<LateReportSummary> {
    return this.http.get<LateReportSummary>(`${this.apiUrl}/late-summary`);
  }

}
