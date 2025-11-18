import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RentalService } from "./rental.service";
import { RentalController } from "./rental.controller";
import { Rental } from "./entities/rental.entity";
import { User } from "../auth/entities/user.entity";
import { DressModule } from "../dress/dress.module"; // ✅ IMPORTAR
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Rental, User]),
    DressModule,
    NotificationsModule, // ✅ AGREGAR ESTO
  ],
  controllers: [RentalController],
  providers: [RentalService],
  exports: [RentalService],
})
export class RentalModule {}
