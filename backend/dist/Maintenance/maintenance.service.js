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
var MaintenanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const maintenance_entity_1 = require("../Maintenance/maintenance.entity/maintenance.entity");
const dress_service_1 = require("../dress/dress.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let MaintenanceService = MaintenanceService_1 = class MaintenanceService {
    maintenanceRepository;
    dressService;
    notificationsGateway;
    logger = new common_1.Logger(MaintenanceService_1.name);
    constructor(maintenanceRepository, dressService, notificationsGateway) {
        this.maintenanceRepository = maintenanceRepository;
        this.dressService = dressService;
        this.notificationsGateway = notificationsGateway;
    }
    async createMaintenance(userId, createMaintenanceDto) {
        const dress = await this.dressService.findOne(+createMaintenanceDto.dressId);
        if (!dress)
            throw new common_1.NotFoundException("Vestido no encontrado");
        if (dress.quantity < createMaintenanceDto.cantidad) {
            throw new common_1.BadRequestException(`Stock insuficiente. Disponible: ${dress.quantity}, solicitado: ${createMaintenanceDto.cantidad}`);
        }
        const newMaintenance = this.maintenanceRepository.create({
            ...createMaintenanceDto,
            userId,
            estado: createMaintenanceDto.estado || "pendiente",
        });
        const saved = await this.maintenanceRepository.save(newMaintenance);
        await this.dressService.decreaseStock(+createMaintenanceDto.dressId, createMaintenanceDto.cantidad);
        if (this.notificationsGateway) {
            this.notificationsGateway.notifyAdmins({
                titulo: "Vestido en mantenimiento",
                mensaje: `${dress.name} - Enviado a mantenimiento (${createMaintenanceDto.tipo}). Unidades: ${createMaintenanceDto.cantidad}`,
                fecha: new Date(),
                datos: { maintenanceId: saved.id, dressId: dress.id },
            });
        }
        return saved;
    }
    async completeMaintenance(id) {
        const maintenance = await this.maintenanceRepository.findOne({
            where: { id },
        });
        if (!maintenance)
            throw new common_1.NotFoundException(`Mantenimiento con ID ${id} no encontrado`);
        if (maintenance.estado === "completado") {
            throw new common_1.BadRequestException("Mantenimiento ya finalizado");
        }
        maintenance.estado = "completado";
        maintenance.fechaFin = new Date();
        const updated = await this.maintenanceRepository.save(maintenance);
        await this.dressService.increaseStock(+maintenance.dressId, maintenance.cantidad);
        if (this.notificationsGateway) {
            this.notificationsGateway.notifyAdmins({
                titulo: "Mantenimiento finalizado",
                mensaje: `El vestido ${maintenance.dressNombre} (${maintenance.cantidad} unidades) volvió al inventario.`,
                fecha: new Date(),
                datos: { maintenanceId: maintenance.id, dressId: maintenance.dressId },
            });
        }
        return updated;
    }
    async updateMaintenanceStatus(id, estado) {
        const maintenance = await this.maintenanceRepository.findOne({
            where: { id },
        });
        if (!maintenance) {
            throw new common_1.NotFoundException(`Mantenimiento con ID ${id} no encontrado`);
        }
        const eraCompletado = maintenance.estado === "completado";
        if (estado === "completado" && !eraCompletado) {
            return this.completeMaintenance(id);
        }
        else {
            maintenance.estado = estado;
            await this.maintenanceRepository.save(maintenance);
            return maintenance;
        }
    }
    async getAllMaintenance() {
        return await this.maintenanceRepository.find({
            order: { createdAt: "DESC" },
        });
    }
    async getMaintenanceByDressId(dressId) {
        return await this.maintenanceRepository.find({
            where: { dressId },
            order: { createdAt: "DESC" },
        });
    }
    async deleteMaintenance(id) {
        await this.maintenanceRepository.delete(id);
    }
};
exports.MaintenanceService = MaintenanceService;
exports.MaintenanceService = MaintenanceService = MaintenanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(maintenance_entity_1.Maintenance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        dress_service_1.DressService,
        notifications_gateway_1.NotificationsGateway])
], MaintenanceService);
//# sourceMappingURL=maintenance.service.js.map