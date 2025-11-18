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
exports.MaintenanceController = void 0;
const common_1 = require("@nestjs/common");
const maintenance_service_1 = require("./maintenance.service");
const create_maintenance_dto_1 = require("./dto/create-maintenance.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let MaintenanceController = class MaintenanceController {
    maintenanceService;
    constructor(maintenanceService) {
        this.maintenanceService = maintenanceService;
    }
    createMaintenance(createMaintenanceDto, req) {
        const userId = req.user.id || req.user.userId;
        return this.maintenanceService.createMaintenance(userId, createMaintenanceDto);
    }
    getAllMaintenance() {
        return this.maintenanceService.getAllMaintenance();
    }
    getMaintenanceByDress(dressId) {
        return this.maintenanceService.getMaintenanceByDressId(dressId);
    }
    updateStatus(id, estado) {
        return this.maintenanceService.updateMaintenanceStatus(id, estado);
    }
    finalizeMaintenance(id) {
        return this.maintenanceService.completeMaintenance(id);
    }
    deleteMaintenance(id) {
        return this.maintenanceService.deleteMaintenance(id);
    }
};
exports.MaintenanceController = MaintenanceController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_maintenance_dto_1.CreateMaintenanceDto, Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "createMaintenance", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "getAllMaintenance", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("dress/:dressId"),
    __param(0, (0, common_1.Param)("dressId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "getMaintenanceByDress", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("estado")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(":id/finalize"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "finalizeMaintenance", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "deleteMaintenance", null);
exports.MaintenanceController = MaintenanceController = __decorate([
    (0, common_1.Controller)("maintenance"),
    __metadata("design:paramtypes", [maintenance_service_1.MaintenanceService])
], MaintenanceController);
//# sourceMappingURL=maintenance.controller.js.map