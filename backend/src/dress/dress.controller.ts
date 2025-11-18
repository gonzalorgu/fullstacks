import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { DressService } from "./dress.service";
import { CreateDressDto } from "./dto/create-dress.dto";
import { UpdateDressDto } from "./dto/update-dress.dto";

@Controller("dress")
export class DressController {
  constructor(private readonly dressService: DressService) {}

  @Post()
  create(@Body() createDressDto: CreateDressDto) {
    return this.dressService.create(createDressDto);
  }

  @Get()
  findAll() {
    return this.dressService.findAll();
  }

  @Get("active")
  findAllActive() {
    return this.dressService.findAllActive();
  }

  @Get("low-stock")
  findLowStock(@Query("threshold") threshold?: string) {
    const limit = threshold ? parseInt(threshold, 10) : 1;
    return this.dressService.findLowStock(limit);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.dressService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateDressDto: UpdateDressDto) {
    return this.dressService.update(+id, updateDressDto);
  }

  @Patch(":id/decrease-stock")
  decreaseStock(@Param("id") id: string, @Body("amount") amount: number = 1) {
    return this.dressService.decreaseStock(+id, amount);
  }

  @Patch(":id/increase-stock")
  increaseStock(@Param("id") id: string, @Body("amount") amount: number = 1) {
    return this.dressService.increaseStock(+id, amount);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.dressService.remove(+id);
  }
}
