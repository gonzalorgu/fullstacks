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
exports.Rental = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const reservation_entity_1 = require("../../reservation/entities/reservation.entity");
let Rental = class Rental {
    id;
    user;
    dressId;
    dressNombre;
    foto;
    desde;
    hasta;
    precioAlquiler;
    talla;
    color;
    clienteNombre;
    clienteEmail;
    estado;
    createdAt;
    updatedAt;
    reservations;
};
exports.Rental = Rental;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Rental.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.rentals, { onDelete: "CASCADE" }),
    __metadata("design:type", user_entity_1.User)
], Rental.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Rental.prototype, "dressId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Rental.prototype, "dressNombre", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { nullable: true }),
    __metadata("design:type", Object)
], Rental.prototype, "foto", void 0);
__decorate([
    (0, typeorm_1.Column)("date"),
    __metadata("design:type", Date)
], Rental.prototype, "desde", void 0);
__decorate([
    (0, typeorm_1.Column)("date"),
    __metadata("design:type", Date)
], Rental.prototype, "hasta", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Rental.prototype, "precioAlquiler", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { nullable: true }),
    __metadata("design:type", Object)
], Rental.prototype, "talla", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { nullable: true }),
    __metadata("design:type", Object)
], Rental.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { nullable: true }),
    __metadata("design:type", Object)
], Rental.prototype, "clienteNombre", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { nullable: true }),
    __metadata("design:type", Object)
], Rental.prototype, "clienteEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 20,
        default: "activo",
        comment: "Estados: activo, pasado, cancelado, pendiente",
    }),
    __metadata("design:type", String)
], Rental.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Rental.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Rental.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, (reservation) => reservation.rental, { cascade: true }),
    __metadata("design:type", Array)
], Rental.prototype, "reservations", void 0);
exports.Rental = Rental = __decorate([
    (0, typeorm_1.Entity)("rentals")
], Rental);
//# sourceMappingURL=rental.entity.js.map