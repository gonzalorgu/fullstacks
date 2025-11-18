import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Maintenance } from "../Maintenance/maintenance.entity/maintenance.entity";
import { MaintenanceService } from "./maintenance.service";
import { MaintenanceController } from "./maintenance.controller";
import { DressModule } from "../dress/dress.module"; // <-- importa el módulo de dress
import { NotificationsGateway } from "../notifications/notifications.gateway"; // si usas gateway de notificaciones

@Module({
  imports: [
    TypeOrmModule.forFeature([Maintenance]),
    DressModule, // <-- agrega aquí el módulo DressModule
  ],
  providers: [
    MaintenanceService,
    NotificationsGateway, // si lo usas
  ],
  controllers: [MaintenanceController],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
