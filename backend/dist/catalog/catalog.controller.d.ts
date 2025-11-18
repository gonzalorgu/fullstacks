import { CatalogService } from "./catalog.service";
import { CreateCatalogDto } from "./dto/create-catalog.dto";
import { UpdateCatalogDto } from "./dto/update-catalog.dto";
export declare class CatalogController {
    private readonly catalogService;
    constructor(catalogService: CatalogService);
    create(createCatalogDto: CreateCatalogDto): Promise<import("./entities/catalog.entity").Catalog>;
    findAll(): Promise<import("./entities/catalog.entity").Catalog[]>;
    findOne(id: string): Promise<import("./entities/catalog.entity").Catalog | null>;
    update(id: string, updateCatalogDto: UpdateCatalogDto): Promise<import("./entities/catalog.entity").Catalog | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
