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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
const typeorm_1 = require("typeorm");
const rental_entity_1 = require("../../rental/entities/rental.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let Reservation = class Reservation {
    id;
    rental;
    user;
    status;
    fechaInicio;
    fechaFin;
    precioTotal;
    notas;
    estadoPago;
    createdAt;
    updatedAt;
};
exports.Reservation = Reservation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Reservation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => rental_entity_1.Rental, (rental) => rental.reservations, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", rental_entity_1.Rental)
], Reservation.prototype, "rental", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Reservation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "pendiente" }),
    __metadata("design:type", String)
], Reservation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("date"),
    __metadata("design:type", Date)
], Reservation.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)("date"),
    __metadata("design:type", Date)
], Reservation.prototype, "fechaFin", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Reservation.prototype, "precioTotal", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], Reservation.prototype, "notas", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "sin-pago" }),
    __metadata("design:type", String)
], Reservation.prototype, "estadoPago", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Reservation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Reservation.prototype, "updatedAt", void 0);
exports.Reservation = Reservation = __decorate([
    (0, typeorm_1.Entity)("reservations")
], Reservation);
//# sourceMappingURL=reservation.entity.js.map