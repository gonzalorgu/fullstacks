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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getDashboard(startDate, endDate) {
        console.log("📊 GET /api/reports/dashboard");
        return this.reportsService.getDashboard({
            startDate,
            endDate,
        });
    }
    async getMonthlyIncome(year) {
        console.log("📈 GET /api/reports/monthly-income");
        const yearNum = year ? parseInt(year, 10) : new Date().getFullYear();
        return this.reportsService.getMonthlyIncome({ year: yearNum });
    }
    async getPaymentMethods(startDate, endDate) {
        console.log("💳 GET /api/reports/payment-methods");
        return this.reportsService.getPaymentMethods({
            startDate,
            endDate,
        });
    }
    async getTopCustomers(limit, startDate, endDate) {
        console.log("👥 GET /api/reports/top-customers");
        const limitNum = limit ? parseInt(limit, 10) : 5;
        return this.reportsService.getTopCustomers({
            limit: limitNum,
            startDate,
            endDate,
        });
    }
    async getTopDresses(limit) {
        console.log("👗 GET /api/reports/top-dresses");
        const limitNum = limit ? parseInt(limit, 10) : 5;
        return this.reportsService.getTopDresses({ limit: limitNum });
    }
    async getSummary(startDate, endDate) {
        console.log("📋 GET /api/reports/summary");
        return this.reportsService.getSummary({
            startDate,
            endDate,
        });
    }
    async getLateReservations() {
        console.log("⚠️ GET /api/reports/late-reservations");
        return this.reportsService.getLateReservations();
    }
    async getLateReportSummary() {
        console.log("📊 GET /api/reports/late-summary");
        return this.reportsService.getLateReportSummary();
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)("dashboard"),
    __param(0, (0, common_1.Query)("startDate")),
    __param(1, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)("monthly-income"),
    __param(0, (0, common_1.Query)("year")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMonthlyIncome", null);
__decorate([
    (0, common_1.Get)("payment-methods"),
    __param(0, (0, common_1.Query)("startDate")),
    __param(1, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPaymentMethods", null);
__decorate([
    (0, common_1.Get)("top-customers"),
    __param(0, (0, common_1.Query)("limit")),
    __param(1, (0, common_1.Query)("startDate")),
    __param(2, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getTopCustomers", null);
__decorate([
    (0, common_1.Get)("top-dresses"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getTopDresses", null);
__decorate([
    (0, common_1.Get)("summary"),
    __param(0, (0, common_1.Query)("startDate")),
    __param(1, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)("late-reservations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getLateReservations", null);
__decorate([
    (0, common_1.Get)("late-summary"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getLateReportSummary", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)("api/reports"),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map