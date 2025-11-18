import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { Payment } from "./entities/payment.entity";
import { User } from "../auth/entities/user.entity";
import { NotificationsModule } from "../notifications/notifications.module"; // <-- AGREGADO

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, User]),
    NotificationsModule, // <-- AGREGADO AQUÍ
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
