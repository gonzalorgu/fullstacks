"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../payment/entities/payment.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const rental_entity_1 = require("../rental/entities/rental.entity");
let ReportsService = class ReportsService {
    paymentRepository;
    userRepository;
    rentalRepository;
    constructor(paymentRepository, userRepository, rentalRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.rentalRepository = rentalRepository;
    }
    async getDashboard(filters) {
        const startDate = filters.startDate
            ? new Date(filters.startDate)
            : this.getFirstDayOfMonth();
        const endDate = filters.endDate ? new Date(filters.endDate) : new Date();
        const [totalIncome, totalPayments, pendingPayments, totalCustomers] = await Promise.all([
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
    async getMonthlyIncome(filters) {
        const year = filters.year || new Date().getFullYear();
        const results = await this.paymentRepository
            .createQueryBuilder("payment")
            .select("TO_CHAR(payment.created_at, 'YYYY-MM')", "month")
            .addSelect("SUM(CAST(payment.amount AS DECIMAL))", "total")
            .addSelect("COUNT(payment.id)", "count")
            .where("EXTRACT(YEAR FROM payment.created_at) = :year", { year })
            .andWhere("payment.status = 'Pagado'")
            .groupBy("TO_CHAR(payment.created_at, 'YYYY-MM')")
            .orderBy("TO_CHAR(payment.created_at, 'YYYY-MM')", "ASC")
            .getRawMany();
        const months = results.map((r) => ({
            month: r.month ?? "N/A",
            income: r.total ? parseFloat(r.total) : 0,
            transactions: r.count ? parseInt(r.count, 10) : 0,
        }));
        return { year, months };
    }
    async getPaymentMethods(filters) {
        const startDate = filters.startDate
            ? new Date(filters.startDate)
            : this.getFirstDayOfMonth();
        const endDate = filters.endDate ? new Date(filters.endDate) : new Date();
        const results = await this.paymentRepository
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
        const methods = results.map((r) => ({
            method: r.method ?? "Sin especificar",
            count: r.count ? parseInt(r.count, 10) : 0,
            total: r.total ? parseFloat(r.total) : 0,
        }));
        return { period: { startDate, endDate }, methods };
    }
    async getTopCustomers(filters) {
        const limit = filters.limit || 5;
        const startDate = filters.startDate
            ? new Date(filters.startDate)
            : this.getFirstDayOfMonth();
        const endDate = filters.endDate ? new Date(filters.endDate) : new Date();
        console.log(`🔍 TOP CUSTOMERS QUERY - Start: ${startDate.toISOString()}, End: ${endDate.toISOString()}`);
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
            const results = await this.paymentRepository.query(query, [
                startDate,
                endDate,
                limit,
            ]);
            console.log("📊 Resultados RAW:", JSON.stringify(results, null, 2));
            const topCustomers = results.map((r) => {
                const name = r.name || "Cliente";
                console.log(`✅ Procesando cliente: ${name}`);
                return {
                    email: r.email ?? "sin-email@example.com",
                    name: name,
                    rentals: r.rentals ?? 0,
                    totalSpent: r.total ?? 0,
                };
            });
            console.log("✨ Top Customers finales:", JSON.stringify(topCustomers, null, 2));
            return { period: { startDate, endDate }, topCustomers };
        }
        catch (error) {
            console.error("❌ ERROR en getTopCustomers:", error);
            throw error;
        }
    }
    async getTopDresses(filters) {
        const limit = filters.limit || 5;
        const results = await this.rentalRepository
            .createQueryBuilder("rental")
            .select("rental.dress_id", "dressId")
            .addSelect("COUNT(rental.id)", "rentals")
            .groupBy("rental.dress_id")
            .orderBy("rentals", "DESC")
            .limit(limit)
            .getRawMany();
        const topDresses = results.map((r) => ({
            dressId: r.dressId ?? "N/A",
            rentals: r.rentals ? parseInt(r.rentals, 10) : 0,
        }));
        return { topDresses };
    }
    async getSummary(filters) {
        const startDate = filters.startDate
            ? new Date(filters.startDate)
            : this.getFirstDayOfMonth();
        const endDate = filters.endDate ? new Date(filters.endDate) : new Date();
        const summary = {
            period: { startDate, endDate },
            metrics: {
                totalRevenue: await this.getTotalIncome(startDate, endDate),
                averageTransactionValue: await this.getAverageTransactionValue(startDate, endDate),
                successRate: await this.getSuccessRate(startDate, endDate),
                conversionMetrics: await this.getConversionMetrics(startDate, endDate),
            },
        };
        return summary;
    }
    async getLateReservations() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            console.log(`🔍 Buscando reservas atrasadas antes de: ${today.toISOString()}`);
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
            const results = await this.rentalRepository.query(query, [today]);
            console.log(`📊 Reservas atrasadas encontradas: ${results.length}`);
            if (results.length === 0) {
                console.log("⚠️ No hay reservas atrasadas");
                return [];
            }
            const lateFeePerDay = 10;
            const lateReservations = results.map((r) => {
                const endDate = new Date(r.rentalEndDate);
                const daysLate = Math.max(1, Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)));
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
            });
            return lateReservations;
        }
        catch (error) {
            console.error("❌ ERROR COMPLETO en getLateReservations:", error);
            console.error("📍 Error message:", error.message);
            return [];
        }
    }
    async getLateReportSummary() {
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
            const totalLateFees = lateReservations.reduce((sum, res) => sum + res.lateFee, 0);
            const averageDaysLate = lateReservations.reduce((sum, res) => sum + res.daysLate, 0) /
                totalLateReservations;
            return {
                totalLateReservations,
                totalLateFees: Number(totalLateFees.toFixed(2)),
                averageDaysLate: Number(averageDaysLate.toFixed(1)),
            };
        }
        catch (error) {
            console.error("❌ ERROR COMPLETO en getLateReportSummary:", error);
            return {
                totalLateReservations: 0,
                totalLateFees: 0,
                averageDaysLate: 0,
            };
        }
    }
    async getTotalIncome(startDate, endDate) {
        const result = await this.paymentRepository
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
    async getTotalPayments(startDate, endDate) {
        const result = await this.paymentRepository
            .createQueryBuilder("payment")
            .select("COUNT(payment.id)", "count")
            .where("payment.created_at BETWEEN :start AND :end", {
            start: startDate,
            end: endDate,
        })
            .getRawOne();
        return result?.count ? parseInt(result.count, 10) : 0;
    }
    async getPendingPayments() {
        const result = await this.paymentRepository
            .createQueryBuilder("payment")
            .select("COUNT(payment.id)", "count")
            .where("payment.status = 'Pendiente'")
            .getRawOne();
        return result?.count ? parseInt(result.count, 10) : 0;
    }
    async getTotalCustomers() {
        const result = await this.userRepository
            .createQueryBuilder("user")
            .select("COUNT(user.id)", "count")
            .getRawOne();
        return result?.count ? parseInt(result.count, 10) : 0;
    }
    getActiveRentals() {
        console.warn("⚠️ getActiveRentals deshabilitado - rentals sin status");
        return 0;
    }
    getCompletedRentals() {
        console.warn("⚠️ getCompletedRentals deshabilitado - rentals sin status");
        return 0;
    }
    async getAverageTransactionValue(startDate, endDate) {
        const result = await this.paymentRepository
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
    async getSuccessRate(startDate, endDate) {
        const total = await this.getTotalPayments(startDate, endDate);
        const result = await this.paymentRepository
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
    async getConversionMetrics(startDate, endDate) {
        const customers = await this.getTotalCustomers();
        const payments = await this.getTotalPayments(startDate, endDate);
        return {
            totalCustomers: customers,
            payingCustomers: payments > 0 ? Math.ceil(payments / 1.5) : 0,
            conversionRate: customers > 0 ? (Math.ceil(payments / 1.5) / customers) * 100 : 0,
        };
    }
    getFirstDayOfMonth() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(rental_entity_1.Rental)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map