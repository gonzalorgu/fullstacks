import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DressService } from "./dress.service";
import { DressController } from "./dress.controller";
import { Dress } from "./entities/dress.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Dress])],
  controllers: [DressController],
  providers: [DressService],
  exports: [DressService], // ✅ EXPORTAR para usarlo en RentalModule
})
export class DressModule {}
