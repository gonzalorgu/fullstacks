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
exports.Payment = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
let Payment = class Payment {
    id;
    amount;
    payment_date;
    payment_method;
    rental_id;
    user_id;
    reference;
    status;
    receipt_image;
    created_at;
    user;
};
exports.Payment = Payment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp", { nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "payment_date", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "payment_method", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "rental_id", void 0);
__decorate([
    (0, typeorm_1.Column)("integer", { nullable: true }),
    __metadata("design:type", Number)
], Payment.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { default: "Pendiente", nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "receipt_image", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Payment.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.payments, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], Payment.prototype, "user", void 0);
exports.Payment = Payment = __decorate([
    (0, typeorm_1.Entity)("payments")
], Payment);
//# sourceMappingURL=payment.entity.js.map