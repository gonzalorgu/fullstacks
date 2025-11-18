import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { DressImageService } from "./dress-image.service";
import { CreateDressImageDto } from "./dto/create-dress-image.dto";
import { UpdateDressImageDto } from "./dto/update-dress-image.dto";

@Controller("dress-image")
export class DressImageController {
  constructor(private readonly dressImageService: DressImageService) {}

  @Post()
  create(@Body() createDressImageDto: CreateDressImageDto) {
    return this.dressImageService.create(createDressImageDto);
  }

  @Get()
  findAll() {
    return this.dressImageService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.dressImageService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateDressImageDto: UpdateDressImageDto,
  ) {
    return this.dressImageService.update(+id, updateDressImageDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.dressImageService.remove(+id);
  }
}
