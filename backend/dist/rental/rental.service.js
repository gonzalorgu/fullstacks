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
exports.RentalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rental_entity_1 = require("../rental/entities/rental.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const dress_service_1 = require("../dress/dress.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let RentalService = class RentalService {
    rentalRepository;
    userRepository;
    dressService;
    notificationsGateway;
    constructor(rentalRepository, userRepository, dressService, notificationsGateway) {
        this.rentalRepository = rentalRepository;
        this.userRepository = userRepository;
        this.dressService = dressService;
        this.notificationsGateway = notificationsGateway;
    }
    async getMyRentals(userId) {
        const rentals = await this.rentalRepository.find({
            where: { user: { id: userId } },
            relations: ["user"],
            order: { desde: "DESC" },
        });
        return rentals;
    }
    async getActiveRentals(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.rentalRepository
            .createQueryBuilder("rental")
            .leftJoinAndSelect("rental.user", "user")
            .where("rental.userId = :userId", { userId })
            .andWhere("rental.hasta >= :today", { today })
            .orderBy("rental.desde", "DESC")
            .getMany();
    }
    async getPastRentals(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.rentalRepository
            .createQueryBuilder("rental")
            .leftJoinAndSelect("rental.user", "user")
            .where("rental.userId = :userId", { userId })
            .andWhere("rental.hasta < :today", { today })
            .orderBy("rental.desde", "DESC")
            .getMany();
    }
    async getPendingRentals(userId) {
        return this.rentalRepository
            .createQueryBuilder("rental")
            .leftJoinAndSelect("rental.user", "user")
            .where("rental.userId = :userId", { userId })
            .andWhere("rental.estado = :estado", { estado: "pendiente" })
            .orderBy("rental.desde", "DESC")
            .getMany();
    }
    async getRentalById(id, userId) {
        const rental = await this.rentalRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ["user"],
        });
        if (!rental)
            throw new common_1.NotFoundException("Alquiler no encontrado");
        return rental;
    }
    async createRental(userId, rentalData) {
        if (!rentalData) {
            throw new Error("❌ No se recibieron datos");
        }
        if (!rentalData.dressId) {
            throw new Error("❌ dressId es requerido");
        }
        const dress = await this.dressService.findOne(+rentalData.dressId);
        if (!dress.isActive || dress.quantity <= 0) {
            throw new common_1.BadRequestException(`Vestido "${dress.name}" no disponible. Stock: ${dress.quantity}`);
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException("Usuario no encontrado");
        }
        const rental = new rental_entity_1.Rental();
        rental.dressId = rentalData.dressId;
        rental.dressNombre = rentalData.dressNombre;
        rental.foto = rentalData.foto || null;
        rental.desde = new Date(rentalData.desde);
        rental.hasta = new Date(rentalData.hasta);
        rental.precioAlquiler = rentalData.precioAlquiler;
        rental.talla = rentalData.talla || null;
        rental.color = rentalData.color || null;
        rental.estado = rentalData.estado || "activo";
        rental.clienteNombre = rentalData.clienteNombre || null;
        rental.clienteEmail = rentalData.clienteEmail || null;
        rental.user = user;
        const savedRental = await this.rentalRepository.save(rental);
        await this.dressService.decreaseStock(+rentalData.dressId, 1);
        const rentalWithUser = await this.rentalRepository.findOne({
            where: { id: savedRental.id },
            relations: ["user"],
        });
        if (!rentalWithUser)
            throw new common_1.NotFoundException("Error al crear el alquiler");
        this.notificationsGateway.notifyAdmins({
            titulo: "Nuevo pedido",
            mensaje: `Pedido de ${rentalWithUser.clienteNombre || rentalWithUser.user?.nombre || "Cliente"}`,
            fecha: new Date(),
            datos: {
                id: rentalWithUser.id,
                dress: rentalWithUser.dressNombre,
                desde: rentalWithUser.desde,
                hasta: rentalWithUser.hasta,
                cliente: rentalWithUser.clienteNombre,
                email: rentalWithUser.clienteEmail,
            },
        });
        return rentalWithUser;
    }
    async createPaymentPending(userId, rentalData) {
        if (!rentalData) {
            throw new Error("❌ No se recibieron datos");
        }
        if (!rentalData.dressId) {
            throw new Error("❌ dressId es requerido");
        }
        const dress = await this.dressService.findOne(+rentalData.dressId);
        if (!dress.isActive || dress.quantity <= 0) {
            throw new common_1.BadRequestException(`Vestido "${dress.name}" no disponible. Stock: ${dress.quantity}`);
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException("Usuario no encontrado");
        }
        const rental = new rental_entity_1.Rental();
        rental.dressId = rentalData.dressId;
        rental.dressNombre = rentalData.dressNombre;
        rental.foto = rentalData.foto || null;
        rental.desde = new Date(rentalData.desde);
        rental.hasta = new Date(rentalData.hasta);
        rental.precioAlquiler = rentalData.precioAlquiler;
        rental.talla = rentalData.talla || null;
        rental.color = rentalData.color || null;
        rental.estado = rentalData.estado || "pendiente";
        rental.clienteNombre = rentalData.clienteNombre || user.nombre || "Cliente";
        rental.clienteEmail = rentalData.clienteEmail || user.email;
        rental.user = user;
        const savedRental = await this.rentalRepository.save(rental);
        await this.dressService.decreaseStock(+rentalData.dressId, 1);
        const rentalWithUser = await this.rentalRepository.findOne({
            where: { id: savedRental.id },
            relations: ["user"],
        });
        if (!rentalWithUser)
            throw new common_1.NotFoundException("Error al crear el alquiler");
        const desdeDate = rentalWithUser.desde
            ? new Date(rentalWithUser.desde)
            : null;
        const hastaDate = rentalWithUser.hasta
            ? new Date(rentalWithUser.hasta)
            : null;
        try {
            this.notificationsGateway.notifyAdmins({
                titulo: "Nueva reserva pendiente",
                mensaje: `Reserva de ${rentalWithUser.dressNombre} para ` +
                    `${rentalWithUser.clienteNombre || rentalWithUser.user?.nombre || "Cliente"} ` +
                    `desde ${desdeDate ? desdeDate.toLocaleDateString() : "(sin fecha)"} ` +
                    `hasta ${hastaDate ? hastaDate.toLocaleDateString() : "(sin fecha)"}`,
                fecha: new Date(),
                datos: {
                    id: rentalWithUser.id,
                    dress: rentalWithUser.dressNombre,
                    desde: rentalWithUser.desde,
                    hasta: rentalWithUser.hasta,
                    cliente: rentalWithUser.clienteNombre,
                    email: rentalWithUser.clienteEmail,
                    estado: rentalWithUser.estado,
                },
            });
        }
        catch (err) {
            console.error("❌ Error en NOTIFICACIÓN:", err);
        }
        return rentalWithUser;
    }
    async updateRental(id, userId, updates, isAdmin = false) {
        let rental = null;
        if (isAdmin) {
            rental = await this.rentalRepository.findOne({
                where: { id },
                relations: ["user"],
            });
            if (!rental)
                throw new common_1.NotFoundException("Alquiler no encontrado");
        }
        else {
            rental = await this.getRentalById(id, userId);
        }
        if (updates.estado === "pasado" && rental.estado !== "pasado") {
            await this.dressService.increaseStock(+rental.dressId, 1);
        }
        Object.assign(rental, updates);
        const updatedRental = await this.rentalRepository.save(rental);
        const rentalWithUser = await this.rentalRepository.findOne({
            where: { id: updatedRental.id },
            relations: ["user"],
        });
        if (!rentalWithUser)
            throw new common_1.NotFoundException("Error al actualizar el alquiler");
        return rentalWithUser;
    }
    async cancelRental(id, userId, isAdmin = false) {
        let rental = null;
        if (isAdmin) {
            rental = await this.rentalRepository.findOne({
                where: { id },
                relations: ["user"],
            });
        }
        else {
            rental = await this.getRentalById(id, userId);
        }
        if (!rental)
            throw new common_1.NotFoundException("Alquiler no encontrado");
        await this.dressService.increaseStock(+rental.dressId, 1);
        await this.rentalRepository.remove(rental);
        return { message: "Alquiler eliminado exitosamente" };
    }
    async getAllRentalsAdmin() {
        const rentals = await this.rentalRepository.find({
            relations: ["user"],
            order: { desde: "DESC" },
        });
        return rentals;
    }
};
exports.RentalService = RentalService;
exports.RentalService = RentalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rental_entity_1.Rental)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        dress_service_1.DressService,
        notifications_gateway_1.NotificationsGateway])
], RentalService);
//# sourceMappingURL=rental.service.js.map