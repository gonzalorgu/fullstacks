import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { Payment } from "./entities/payment.entity";
import { User } from "../auth/entities/user.entity";
import { NotificationsGateway } from "../notifications/notifications.gateway";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      console.log("📥 DATOS RECIBIDOS:", createPaymentDto);

      const user = await this.userRepository.findOne({
        where: { id: Number(createPaymentDto.user_id) },
      });

      if (!user) {
        throw new Error(
          `Usuario con ID ${createPaymentDto.user_id} no encontrado`,
        );
      }

      const payment: Payment = this.paymentRepository.create({
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

      // 👇 PRIMERO GUARDAMOS
      const saved = await this.paymentRepository.save<Payment>(payment);
      console.log("✅ PAGO GUARDADO:", saved);

      // 👇 LOGS PARA DEPURAR LA NOTIFICACIÓN
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

      // ------ FIN NOTIFICACIÓN -------

      return saved;
    } catch (error) {
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

  async findById(id: string) {
    return this.paymentRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async update(id: string, updatePaymentDto: Partial<CreatePaymentDto>) {
    const payment = await this.findById(id);
    if (!payment) throw new Error(`Pago ${id} no encontrado`);

    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async delete(id: string) {
    const payment = await this.findById(id);
    if (!payment) throw new Error(`Pago ${id} no encontrado`);
    return this.paymentRepository.remove(payment);
  }
}
