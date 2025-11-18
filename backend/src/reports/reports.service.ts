import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment } from "../payment/entities/payment.entity";
import { User } from "../auth/entities/user.entity";
import { Rental } from "../rental/entities/rental.entity";
import { ReportFiltersDto } from "./dto/report-filters.dto";
import {
  QueryResult,
  MonthlyData,
  PaymentMethodData,
  TopCustomerData,
  TopDressData,
  ConversionMetrics,
  DashboardResponse,
  MonthlyIncomeResponse,
  PaymentMethodsResponse,
  TopCustomersResponse,
  TopDressesResponse,
  SummaryResponse,
} from "./dto/report-response.dto";
// ✅ IMPORTAR INTERFACES DE ATRASOS
import {
  LateReservation,
  LateReportSummary,
} from "./dto/late-report-response.dto";

interface RawCustomer {
  userId: number;
  email: string;
  name: string;
  rentals: number;
  total: number;
}

// ✅ INTERFACE PARA RESERVAS ATRASADAS
interface RawLateReservation {
  id: number;
  rentalStartDate: string;
  rentalEndDate: string;
  actualReturnDate: string | null;
  status: string;
  userId: number;
  dressId: number;
  clientName: string;
  clientPhone: string;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Rental)
    private rentalRepository: Repository<Rental>,
  ) {}

  async getDashboard(filters: ReportFiltersDto): Promise<DashboardResponse> {
    const startDate = filters.startDate
      ? new Date(filters.startDate)
      : this.getFirstDayOfMonth();
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date();

    const [totalIncome, totalPayments, pendingPayments, totalCustomers] =
      await Promise.all([
        this.getTotalIncome(startDate, endDate),
        this.getTotalPayments(startDate, endDate),
        this.getPendingPayments(),
        this.getTotalCustomers(),
      ]);

    const activeRentals = this.getActiveRentals();
    const completedRentals = this.getCompletedRentals();

    return {
      period: { startDate, endDate },
      kpis: {
        totalIncome,
        totalPayments,
        pendingPayments,
        totalCustomers,
        activeRentals,
        completedRentals,
      },
      timestamp: new Date(),
    };
  }

  async getMonthlyIncome(
    filters: ReportFiltersDto,
  ): Promise<MonthlyIncomeResponse> {
    const year = filters.year || new Date().getFullYear();

    const results: QueryResult[] = await this.paymentRepository
      .createQueryBuilder("payment")
      .select("TO_CHAR(payment.created_at, 'YYYY-MM')", "month")
      .addSelect("SUM(CAST(payment.amount AS DECIMAL))", "total")
      .addSelect("COUNT(payment.id)", "count")
      .where("EXTRACT(YEAR FROM payment.created_at) = :year", { year })
      .andWhere("payment.status = 'Pagado'")
      .groupBy("TO_CHAR(payment.created_at, 'YYYY-MM')")
      .orderBy("TO_CHAR(payment.created_at, 'YYYY-MM')", "ASC")
      .getRawMany();

    const months: MonthlyData[] = results.map((r) => ({
      month: r.month ?? "N/A",
      income: r.total ? parseFloat(r.total) : 0,
      transactions: r.count ? parseInt(r.count, 10) : 0,
    }));

    return { year, months };
  }

  async getPaymentMethods(
    filters: ReportFiltersDto,
  ): Promise<PaymentMethodsResponse> {
    const startDate = filters.startDate
      ? new Date(filters.startDate)
      : this.getFirstDayOfMonth();
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date();

    const results: QueryResult[] = await this.paymentRepository
      .createQueryBuilder("payment")
      .select("payment.payment_method", "method")
      .addSelect("COUNT(payment.id)", "count")
      .addSelect("SUM(CAST(payment.amount AS DECIMAL))", "total")
      .where("payment.created_at BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      })
      .groupBy("payment.payment_method")
      .orderBy("count", "DESC")
      .getRawMany();

    const methods: PaymentMethodData[] = results.map((r) => ({
      method: r.method ?? "Sin especificar",
      count: r.count ? parseInt(r.count, 10) : 0,
      total: r.total ? parseFloat(r.total) : 0,
    }));

    return { period: { startDate, endDate }, methods };
  }

  async getTopCustomers(
    filters: ReportFiltersDto,
  ): Promise<TopCustomersResponse> {
    const limit = filters.limit || 5;
    const startDate = filters.startDate
      ? new Date(filters.startDate)
      : this.getFirstDayOfMonth();
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date();

    console.log(
      `🔍 TOP CUSTOMERS QUERY - Start: ${startDate.toISOString()}, End: ${endDate.toISOString()}`,
    );

    try {
      const query = `
        SELECT 
          "user"."id" as "userId",
          "user"."email" as "email",
          COALESCE("user"."nombre", "user"."name", "user"."email") as "name",
          COUNT("payment"."id")::INT as "rentals",
          COALESCE(SUM(CAST("payment"."amount" AS DECIMAL)), 0)::FLOAT as "total"
        FROM "payments" "payment"
        INNER JOIN "user" "user" ON "user"."id" = "payment"."user_id"
        WHERE "payment"."created_at" BETWEEN $1 AND $2
        GROUP BY "user"."id", "user"."email", "user"."nombre", "user"."name"
        ORDER BY "total" DESC
        LIMIT $3
      `;

      const results: RawCustomer[] = await this.paymentRepository.query(query, [
        startDate,
        endDate,
        limit,
      ]);

      console.log("📊 Resultados RAW:", JSON.stringify(results, null, 2));

      const topCustomers: TopCustomerData[] = results.map((r: RawCustomer) => {
        const name = r.name || "Cliente";
        console.log(`✅ Procesando cliente: ${name}`);

        return {
          email: r.email ?? "sin-email@example.com",
          name: name,
          rentals: r.rentals ?? 0,
          totalSpent: r.total ?? 0,
        };
      });

      console.log(
        "✨ Top Customers finales:",
        JSON.stringify(topCustomers, null, 2),
      );

      return { period: { startDate, endDate }, topCustomers };
    } catch (error) {
      console.error("❌ ERROR en getTopCustomers:", error);
      throw error;
    }
  }

  async getTopDresses(filters: ReportFiltersDto): Promise<TopDressesResponse> {
    const limit = filters.limit || 5;

    const results: QueryResult[] = await this.rentalRepository
      .createQueryBuilder("rental")
      .select("rental.dress_id", "dressId")
      .addSelect("COUNT(rental.id)", "rentals")
      .groupBy("rental.dress_id")
      .orderBy("rentals", "DESC")
      .limit(limit)
      .getRawMany();

    const topDresses: TopDressData[] = results.map((r) => ({
      dressId: r.dressId ?? "N/A",
      rentals: r.rentals ? parseInt(r.rentals, 10) : 0,
    }));

    return { topDresses };
  }

  async getSummary(filters: ReportFiltersDto): Promise<SummaryResponse> {
    const startDate = filters.startDate
      ? new Date(filters.startDate)
      : this.getFirstDayOfMonth();
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date();

    const summary: SummaryResponse = {
      period: { startDate, endDate },
      metrics: {
        totalRevenue: await this.getTotalIncome(startDate, endDate),
        averageTransactionValue: await this.getAverageTransactionValue(
          startDate,
          endDate,
        ),
        successRate: await this.getSuccessRate(startDate, endDate),
        conversionMetrics: await this.getConversionMetrics(startDate, endDate),
      },
    };

    return summary;
  }

  // ✅ MÉTODOS PARA REPORTE DE ATRASOS CON TIPOS CORRECTOS
  async getLateReservations(): Promise<LateReservation[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      console.log(
        `🔍 Buscando reservas atrasadas antes de: ${today.toISOString()}`,
      );

      const query = `
        SELECT 
          r.id,
          r."rentalStartDate" as "rentalStartDate",
          r."rentalEndDate" as "rentalEndDate",
          r."actualReturnDate" as "actualReturnDate",
          r.status,
          r."userId" as "userId",
          r."dressId" as "dressId",
          u.nombre as "clientName",
          u.phone as "clientPhone"
        FROM rentals r
        INNER JOIN "user" u ON u.id = r."userId"
        WHERE r."rentalEndDate" < $1
        AND r."actualReturnDate" IS NULL
        ORDER BY r."rentalEndDate" ASC
        LIMIT 50
      `;

      const results: RawLateReservation[] = await this.rentalRepository.query(
        query,
        [today],
      );

      console.log(`📊 Reservas atrasadas encontradas: ${results.length}`);

      if (results.length === 0) {
        console.log("⚠️ No hay reservas atrasadas");
        return [];
      }

      const lateFeePerDay = 10;

      const lateReservations: LateReservation[] = results.map(
        (r: RawLateReservation) => {
          const endDate = new Date(r.rentalEndDate);
          const daysLate = Math.max(
            1,
            Math.floor(
              (today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24),
            ),
          );
          const lateFee = daysLate * lateFeePerDay;

          return {
            id: String(r.id),
            reservationId: `RES-${String(r.id).padStart(6, "0")}`,
            clientName: r.clientName || "Sin nombre",
            clientPhone: r.clientPhone || "Sin teléfono",
            dressName: `Vestido #${r.dressId || "N/A"}`,
            dressImage: null,
            rentalStartDate: r.rentalStartDate,
            rentalEndDate: r.rentalEndDate,
            actualReturnDate: r.actualReturnDate || undefined,
            daysLate,
            lateFee,
            status: r.status || "activo",
          };
        },
      );

      return lateReservations;
    } catch (error) {
      console.error("❌ ERROR COMPLETO en getLateReservations:", error);
      console.error("📍 Error message:", (error as Error).message);
      return [];
    }
  }

  async getLateReportSummary(): Promise<LateReportSummary> {
    try {
      const lateReservations = await this.getLateReservations();

      if (lateReservations.length === 0) {
        return {
          totalLateReservations: 0,
          totalLateFees: 0,
          averageDaysLate: 0,
        };
      }

      const totalLateReservations = lateReservations.length;
      const totalLateFees = lateReservations.reduce(
        (sum, res) => sum + res.lateFee,
        0,
      );
      const averageDaysLate =
        lateReservations.reduce((sum, res) => sum + res.daysLate, 0) /
        totalLateReservations;

      return {
        totalLateReservations,
        totalLateFees: Number(totalLateFees.toFixed(2)),
        averageDaysLate: Number(averageDaysLate.toFixed(1)),
      };
    } catch (error) {
      console.error("❌ ERROR COMPLETO en getLateReportSummary:", error);
      return {
        totalLateReservations: 0,
        totalLateFees: 0,
        averageDaysLate: 0,
      };
    }
  }

  private async getTotalIncome(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result: QueryResult | undefined = await this.paymentRepository
      .createQueryBuilder("payment")
      .select("SUM(CAST(payment.amount AS DECIMAL))", "total")
      .where("payment.created_at BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      })
      .andWhere("payment.status = 'Pagado'")
      .getRawOne();

    return result?.total ? parseFloat(result.total) : 0;
  }

  private async getTotalPayments(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result: QueryResult | undefined = await this.paymentRepository
      .createQueryBuilder("payment")
      .select("COUNT(payment.id)", "count")
      .where("payment.created_at BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      })
      .getRawOne();

    return result?.count ? parseInt(result.count, 10) : 0;
  }

  private async getPendingPayments(): Promise<number> {
    const result: QueryResult | undefined = await this.paymentRepository
      .createQueryBuilder("payment")
      .select("COUNT(payment.id)", "count")
      .where("payment.status = 'Pendiente'")
      .getRawOne();

    return result?.count ? parseInt(result.count, 10) : 0;
  }

  private async getTotalCustomers(): Promise<number> {
    const result: QueryResult | undefined = await this.userRepository
      .createQueryBuilder("user")
      .select("COUNT(user.id)", "count")
      .getRawOne();

    return result?.count ? parseInt(result.count, 10) : 0;
  }

  private getActiveRentals(): number {
    console.warn("⚠️ getActiveRentals deshabilitado - rentals sin status");
    return 0;
  }

  private getCompletedRentals(): number {
    console.warn("⚠️ getCompletedRentals deshabilitado - rentals sin status");
    return 0;
  }

  private async getAverageTransactionValue(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result: QueryResult | undefined = await this.paymentRepository
      .createQueryBuilder("payment")
      .select("AVG(CAST(payment.amount AS DECIMAL))", "average")
      .where("payment.created_at BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      })
      .andWhere("payment.status = 'Pagado'")
      .getRawOne();

    return result?.average ? parseFloat(result.average) : 0;
  }

  private async getSuccessRate(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const total = await this.getTotalPayments(startDate, endDate);
    const result: QueryResult | undefined = await this.paymentRepository
      .createQueryBuilder("payment")
      .select("COUNT(payment.id)", "count")
      .where("payment.created_at BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      })
      .andWhere("payment.status = 'Pagado'")
      .getRawOne();

    const successful = result?.count ? parseInt(result.count, 10) : 0;
    return total > 0 ? (successful / total) * 100 : 0;
  }

  private async getConversionMetrics(
    startDate: Date,
    endDate: Date,
  ): Promise<ConversionMetrics> {
    const customers = await this.getTotalCustomers();
    const payments = await this.getTotalPayments(startDate, endDate);

    return {
      totalCustomers: customers,
      payingCustomers: payments > 0 ? Math.ceil(payments / 1.5) : 0,
      conversionRate:
        customers > 0 ? (Math.ceil(payments / 1.5) / customers) * 100 : 0,
    };
  }

  private getFirstDayOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}
