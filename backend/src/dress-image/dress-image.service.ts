import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDressImageDto } from "./dto/create-dress-image.dto";
import { UpdateDressImageDto } from "./dto/update-dress-image.dto";
import { DressImage } from "./entities/dress-image.entity";

@Injectable()
export class DressImageService {
  constructor(
    @InjectRepository(DressImage)
    private dressImageRepository: Repository<DressImage>,
  ) {}

  create(createDressImageDto: CreateDressImageDto) {
    const dressImage = this.dressImageRepository.create(createDressImageDto);
    return this.dressImageRepository.save(dressImage);
  }

  findAll() {
    return this.dressImageRepository.find({ relations: ["dress"] });
  }

  findOne(id: number) {
    return this.dressImageRepository.findOne({
      where: { id },
      relations: ["dress"],
    });
  }

  async update(id: number, updateDressImageDto: UpdateDressImageDto) {
    await this.dressImageRepository.update(id, updateDressImageDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.dressImageRepository.delete(id);
    return { deleted: true };
  }
}
