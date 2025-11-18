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
exports.RentalController = void 0;
const common_1 = require("@nestjs/common");
const rental_service_1 = require("../rental/rental.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let RentalController = class RentalController {
    rentalService;
    constructor(rentalService) {
        this.rentalService = rentalService;
    }
    getMyRentals(req) {
        return this.rentalService.getMyRentals(req.user.userId);
    }
    getActiveRentals(req) {
        return this.rentalService.getActiveRentals(req.user.userId);
    }
    getPastRentals(req) {
        return this.rentalService.getPastRentals(req.user.userId);
    }
    getPendingRentals(req) {
        return this.rentalService.getPendingRentals(req.user.userId);
    }
    getAllRentalsAdmin(req) {
        return this.rentalService.getAllRentalsAdmin();
    }
    getRentalById(id, req) {
        return this.rentalService.getRentalById(id, req.user.userId);
    }
    createRental(rentalData, req) {
        return this.rentalService.createRental(req.user.userId, rentalData);
    }
    createPaymentPending(rentalData, req) {
        return this.rentalService.createPaymentPending(req.user.userId, rentalData);
    }
    updateRental(id, updates, req) {
        return this.rentalService.updateRental(id, req.user.userId, updates, false);
    }
    updateRentalAdmin(id, updates, req) {
        if (updates.estado === "devuelto")
            updates.estado = "pasado";
        if (updates.estado === "confirmado")
            updates.estado = "activo";
        return this.rentalService.updateRental(id, req.user.userId, updates, true);
    }
    cancelRental(id, req) {
        const isAdmin = req.user.role === "admin";
        return this.rentalService.cancelRental(id, req.user.userId, isAdmin);
    }
};
exports.RentalController = RentalController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("my-rentals"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RentalController.prototype, "getMyRentals", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("active"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RentalController.prototype, "getActiveRentals", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("past"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RentalController.prototype, "getPastRentals", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("pending"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RentalController.prototype, "getPendingRentals", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("admin/all-rentals"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RentalController.prototype, "getAllRentalsAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RentalController.prototype, "getRentalById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RentalController.prototype, "createRental", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("create-payment-pending"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RentalController.prototype, "createPaymentPending", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], RentalController.prototype, "updateRental", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)("admin/update/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], RentalController.prototype, "updateRentalAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RentalController.prototype, "cancelRental", null);
exports.RentalController = RentalController = __decorate([
    (0, common_1.Controller)("rentals"),
    __metadata("design:paramtypes", [rental_service_1.RentalService])
], RentalController);
//# sourceMappingURL=rental.controller.js.map