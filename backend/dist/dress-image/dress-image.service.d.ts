import { Repository } from "typeorm";
import { CreateDressImageDto } from "./dto/create-dress-image.dto";
import { UpdateDressImageDto } from "./dto/update-dress-image.dto";
import { DressImage } from "./entities/dress-image.entity";
export declare class DressImageService {
    private dressImageRepository;
    constructor(dressImageRepository: Repository<DressImage>);
    create(createDressImageDto: CreateDressImageDto): Promise<DressImage>;
    findAll(): Promise<DressImage[]>;
    findOne(id: number): Promise<DressImage | null>;
    update(id: number, updateDressImageDto: UpdateDressImageDto): Promise<DressImage | null>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
}
