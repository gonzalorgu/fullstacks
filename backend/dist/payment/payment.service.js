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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let PaymentService = class PaymentService {
    paymentRepository;
    userRepository;
    notificationsGateway;
    constructor(paymentRepository, userRepository, notificationsGateway) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.notificationsGateway = notificationsGateway;
    }
    async create(createPaymentDto) {
        try {
            console.log("📥 DATOS RECIBIDOS:", createPaymentDto);
            const user = await this.userRepository.findOne({
                where: { id: Number(createPaymentDto.user_id) },
            });
            if (!user) {
                throw new Error(`Usuario con ID ${createPaymentDto.user_id} no encontrado`);
            }
            const payment = this.paymentRepository.create({
                amount: Number(createPaymentDto.amount),
                payment_date: createPaymentDto.payment_date,
                payment_method: createPaymentDto.payment_method,
                rental_id: String(createPaymentDto.rental_id),
                user_id: Number(createPaymentDto.user_id),
                reference: createPaymentDto.reference || "",
                status: createPaymentDto.status || "Pendiente",
                receipt_image: createPaymentDto.receipt_image || undefined,
            });
            console.log("💾 OBJETO A GUARDAR:", payment);
            const saved = await this.paymentRepository.save(payment);
            console.log("✅ PAGO GUARDADO:", saved);
            console.log("⚡ ANTES de notificar admins");
            this.notificationsGateway.notifyAdmins({
                titulo: "Nuevo pago registrado",
                mensaje: `Pago de S/ ${saved.amount} registrado por ${user.email || "usuario"}`,
                fecha: new Date(),
                datos: {
                    pagoId: saved.id,
                    amount: saved.amount,
                    metodo: saved.payment_method,
                    fecha: saved.payment_date,
                    user_id: saved.user_id,
                    referencia: saved.reference,
                },
            });
            console.log("⚡ DESPUÉS de notificar admins");
            return saved;
        }
        catch (error) {
            console.error("❌ ERROR AL GUARDAR:", error);
            throw error;
        }
    }
    async findAll() {
        console.log("📍 findAll()");
        return this.paymentRepository.find({
            order: { created_at: "DESC" },
            relations: ["user"],
        });
    }
    async findAllWithUser() {
        console.log("📍 findAllWithUser()");
        return this.paymentRepository
            .createQueryBuilder("payment")
            .leftJoinAndSelect("payment.user", "user")
            .select([
            "payment.id",
            "payment.amount",
            "payment.payment_date",
            "payment.payment_method",
            "payment.rental_id",
            "payment.reference",
            "payment.status",
            "payment.receipt_image",
            "user.id",
            "user.name",
            "user.email",
        ])
            .orderBy("payment.created_at", "DESC")
            .getMany();
    }
    async findById(id) {
        return this.paymentRepository.findOne({
            where: { id },
            relations: ["user"],
        });
    }
    async update(id, updatePaymentDto) {
        const payment = await this.findById(id);
        if (!payment)
            throw new Error(`Pago ${id} no encontrado`);
        Object.assign(payment, updatePaymentDto);
        return this.paymentRepository.save(payment);
    }
    async delete(id) {
        const payment = await this.findById(id);
        if (!payment)
            throw new Error(`Pago ${id} no encontrado`);
        return this.paymentRepository.remove(payment);
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_gateway_1.NotificationsGateway])
], PaymentService);
//# sourceMappingURL=payment.service.js.map