import { DressImageService } from "./dress-image.service";
import { CreateDressImageDto } from "./dto/create-dress-image.dto";
import { UpdateDressImageDto } from "./dto/update-dress-image.dto";
export declare class DressImageController {
    private readonly dressImageService;
    constructor(dressImageService: DressImageService);
    create(createDressImageDto: CreateDressImageDto): Promise<import("./entities/dress-image.entity").DressImage>;
    findAll(): Promise<import("./entities/dress-image.entity").DressImage[]>;
    findOne(id: string): Promise<import("./entities/dress-image.entity").DressImage | null>;
    update(id: string, updateDressImageDto: UpdateDressImageDto): Promise<import("./entities/dress-image.entity").DressImage | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
