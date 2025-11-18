import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { Payment } from "../payment/entities/payment.entity";
import { User } from "../auth/entities/user.entity";
import { Rental } from "../rental/entities/rental.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User, Rental])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
