import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReservationService } from "./reservation.service";
import { ReservationController } from "./reservation.controller";
import { Reservation } from "./entities/reservation.entity";
import { Rental } from "../rental/entities/rental.entity";
import { User } from "../auth/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Rental, User])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
