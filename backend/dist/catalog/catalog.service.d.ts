import { Repository } from "typeorm";
import { CreateCatalogDto } from "./dto/create-catalog.dto";
import { UpdateCatalogDto } from "./dto/update-catalog.dto";
import { Catalog } from "./entities/catalog.entity";
export declare class CatalogService {
    private catalogRepository;
    constructor(catalogRepository: Repository<Catalog>);
    create(createCatalogDto: CreateCatalogDto): Promise<Catalog>;
    findAll(): Promise<Catalog[]>;
    findOne(id: number): Promise<Catalog | null>;
    update(id: number, updateCatalogDto: UpdateCatalogDto): Promise<Catalog | null>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
}
