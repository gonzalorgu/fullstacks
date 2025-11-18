import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCatalogDto } from "./dto/create-catalog.dto";
import { UpdateCatalogDto } from "./dto/update-catalog.dto";
import { Catalog } from "./entities/catalog.entity";

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Catalog)
    private catalogRepository: Repository<Catalog>,
  ) {}

  create(createCatalogDto: CreateCatalogDto) {
    const catalog = this.catalogRepository.create(createCatalogDto);
    return this.catalogRepository.save(catalog);
  }

  findAll() {
    return this.catalogRepository.find();
  }

  findOne(id: number) {
    return this.catalogRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCatalogDto: UpdateCatalogDto) {
    await this.catalogRepository.update(id, updateCatalogDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.catalogRepository.delete(id);
    return { deleted: true };
  }
}
