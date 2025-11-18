import { Controller, Get, Query } from "@nestjs/common";
import { ReportsService } from "./reports.service";
// ✅ IMPORTAR INTERFACES DE ATRASOS
import {
  LateReservation,
  LateReportSummary,
} from "./dto/late-report-response.dto";

@Controller("api/reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("dashboard")
  async getDashboard(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    console.log("📊 GET /api/reports/dashboard");
    return this.reportsService.getDashboard({
      startDate,
      endDate,
    });
  }

  @Get("monthly-income")
  async getMonthlyIncome(@Query("year") year?: string) {
    console.log("📈 GET /api/reports/monthly-income");
    const yearNum = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.reportsService.getMonthlyIncome({ year: yearNum });
  }

  @Get("payment-methods")
  async getPaymentMethods(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    console.log("💳 GET /api/reports/payment-methods");
    return this.reportsService.getPaymentMethods({
      startDate,
      endDate,
    });
  }

  @Get("top-customers")
  async getTopCustomers(
    @Query("limit") limit?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    console.log("👥 GET /api/reports/top-customers");
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return this.reportsService.getTopCustomers({
      limit: limitNum,
      startDate,
      endDate,
    });
  }

  @Get("top-dresses")
  async getTopDresses(@Query("limit") limit?: string) {
    console.log("👗 GET /api/reports/top-dresses");
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return this.reportsService.getTopDresses({ limit: limitNum });
  }

  @Get("summary")
  async getSummary(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    console.log("📋 GET /api/reports/summary");
    return this.reportsService.getSummary({
      startDate,
      endDate,
    });
  }

  // ✅ ENDPOINTS PARA REPORTE DE ATRASOS CON TIPOS EXPLÍCITOS
  @Get("late-reservations")
  async getLateReservations(): Promise<LateReservation[]> {
    console.log("⚠️ GET /api/reports/late-reservations");
    return this.reportsService.getLateReservations();
  }

  @Get("late-summary")
  async getLateReportSummary(): Promise<LateReportSummary> {
    console.log("📊 GET /api/reports/late-summary");
    return this.reportsService.getLateReportSummary();
  }
}
