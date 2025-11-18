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
exports.ReservationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("./entities/reservation.entity");
const rental_entity_1 = require("../rental/entities/rental.entity");
const user_entity_1 = require("../auth/entities/user.entity");
let ReservationService = class ReservationService {
    reservationRepository;
    rentalRepository;
    userRepository;
    constructor(reservationRepository, rentalRepository, userRepository) {
        this.reservationRepository = reservationRepository;
        this.rentalRepository = rentalRepository;
        this.userRepository = userRepository;
    }
    async create(createReservationDto) {
        const rental = await this.rentalRepository.findOne({
            where: { id: createReservationDto.rentalId },
        });
        if (!rental) {
            throw new common_1.NotFoundException("Rental no encontrado");
        }
        const user = await this.userRepository.findOne({
            where: { id: createReservationDto.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("Usuario no encontrado");
        }
        const reservation = new reservation_entity_1.Reservation();
        reservation.rental = rental;
        reservation.user = user;
        reservation.status = createReservationDto.status || "pendiente";
        reservation.fechaInicio = new Date(createReservationDto.fechaInicio);
        reservation.fechaFin = new Date(createReservationDto.fechaFin);
        reservation.precioTotal = createReservationDto.precioTotal;
        reservation.notas = createReservationDto.notas || null;
        reservation.estadoPago = createReservationDto.estadoPago || "sin-pago";
        return this.reservationRepository.save(reservation);
    }
    async findAll() {
        return this.reservationRepository.find({
            relations: ["rental", "user"],
        });
    }
    async findOne(id) {
        const reservation = await this.reservationRepository.findOne({
            where: { id },
            relations: ["rental", "user"],
        });
        if (!reservation) {
            throw new common_1.NotFoundException("Reservation no encontrada");
        }
        return reservation;
    }
    async update(id, updateReservationDto) {
        const reservation = await this.findOne(id);
        if (updateReservationDto.status) {
            reservation.status = updateReservationDto.status;
        }
        if (updateReservationDto.fechaInicio) {
            reservation.fechaInicio = new Date(updateReservationDto.fechaInicio);
        }
        if (updateReservationDto.fechaFin) {
            reservation.fechaFin = new Date(updateReservationDto.fechaFin);
        }
        if (updateReservationDto.precioTotal !== undefined) {
            reservation.precioTotal = updateReservationDto.precioTotal;
        }
        if (updateReservationDto.notas !== undefined) {
            reservation.notas = updateReservationDto.notas || null;
        }
        if (updateReservationDto.estadoPago) {
            reservation.estadoPago = updateReservationDto.estadoPago;
        }
        return this.reservationRepository.save(reservation);
    }
    async remove(id) {
        const reservation = await this.findOne(id);
        await this.reservationRepository.remove(reservation);
    }
};
exports.ReservationService = ReservationService;
exports.ReservationService = ReservationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __param(1, (0, typeorm_1.InjectRepository)(rental_entity_1.Rental)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReservationService);
//# sourceMappingURL=reservation.service.js.map