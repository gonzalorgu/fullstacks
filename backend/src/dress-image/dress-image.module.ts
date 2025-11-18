import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DressImageService } from "./dress-image.service";
import { DressImageController } from "./dress-image.controller";
import { DressImage } from "./entities/dress-image.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DressImage])],
  controllers: [DressImageController],
  providers: [DressImageService],
})
export class DressImageModule {}
