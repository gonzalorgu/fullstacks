import { ReportsService } from "./reports.service";
import { LateReservation, LateReportSummary } from "./dto/late-report-response.dto";
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboard(startDate?: string, endDate?: string): Promise<import("./dto/report-response.dto").DashboardResponse>;
    getMonthlyIncome(year?: string): Promise<import("./dto/report-response.dto").MonthlyIncomeResponse>;
    getPaymentMethods(startDate?: string, endDate?: string): Promise<import("./dto/report-response.dto").PaymentMethodsResponse>;
    getTopCustomers(limit?: string, startDate?: string, endDate?: string): Promise<import("./dto/report-response.dto").TopCustomersResponse>;
    getTopDresses(limit?: string): Promise<import("./dto/report-response.dto").TopDressesResponse>;
    getSummary(startDate?: string, endDate?: string): Promise<import("./dto/report-response.dto").SummaryResponse>;
    getLateReservations(): Promise<LateReservation[]>;
    getLateReportSummary(): Promise<LateReportSummary>;
}
