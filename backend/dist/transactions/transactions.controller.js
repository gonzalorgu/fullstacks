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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const rental_service_1 = require("../rental/rental.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const createtransactionDto_1 = require("./dto/createtransactionDto");
let TransactionsController = class TransactionsController {
    rentalService;
    constructor(rentalService) {
        this.rentalService = rentalService;
    }
    createTransaction(data, req) {
        const userId = req.user.id || req.user.userId;
        if (data.tipo === "alquiler") {
            if (!data.desde || !data.hasta) {
                throw new Error("Para alquiler, desde y hasta son requeridos");
            }
            const rentalPayload = {
                dressId: data.dressId,
                dressNombre: data.dressNombre,
                foto: data.foto,
                desde: data.desde,
                hasta: data.hasta,
                precioAlquiler: data.precio,
                talla: data.talla,
                color: data.color,
                clienteNombre: data.clienteNombre,
                clienteEmail: data.clienteEmail,
            };
            return this.rentalService.createRental(userId, rentalPayload);
        }
        else {
            throw new Error("Tipo de transacción inválido");
        }
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createtransactionDto_1.CreateTransactionDto, Object]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "createTransaction", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)("transactions"),
    __metadata("design:paramtypes", [rental_service_1.RentalService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map