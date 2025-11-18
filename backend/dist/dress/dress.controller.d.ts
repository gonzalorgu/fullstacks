import { DressService } from "./dress.service";
import { CreateDressDto } from "./dto/create-dress.dto";
import { UpdateDressDto } from "./dto/update-dress.dto";
export declare class DressController {
    private readonly dressService;
    constructor(dressService: DressService);
    create(createDressDto: CreateDressDto): Promise<import("./entities/dress.entity").Dress>;
    findAll(): Promise<import("./entities/dress.entity").Dress[]>;
    findAllActive(): Promise<import("./entities/dress.entity").Dress[]>;
    findLowStock(threshold?: string): Promise<import("./entities/dress.entity").Dress[]>;
    findOne(id: string): Promise<import("./entities/dress.entity").Dress>;
    update(id: string, updateDressDto: UpdateDressDto): Promise<import("./entities/dress.entity").Dress>;
    decreaseStock(id: string, amount?: number): Promise<import("./entities/dress.entity").Dress>;
    increaseStock(id: string, amount?: number): Promise<import("./entities/dress.entity").Dress>;
    remove(id: string): Promise<{
        deleted: boolean;
        dress: import("./entities/dress.entity").Dress;
    }>;
}
