import { Repository } from "typeorm";
import { CreateDressDto } from "./dto/create-dress.dto";
import { UpdateDressDto } from "./dto/update-dress.dto";
import { Dress } from "./entities/dress.entity";
export declare class DressService {
    private dressRepository;
    private readonly logger;
    constructor(dressRepository: Repository<Dress>);
    create(createDressDto: CreateDressDto): Promise<Dress>;
    findAll(): Promise<Dress[]>;
    findAllActive(): Promise<Dress[]>;
    findLowStock(threshold?: number): Promise<Dress[]>;
    findOne(id: number): Promise<Dress>;
    update(id: number, updateDressDto: UpdateDressDto): Promise<Dress>;
    decreaseStock(id: number, amount?: number): Promise<Dress>;
    increaseStock(id: number, amount?: number): Promise<Dress>;
    remove(id: number): Promise<{
        deleted: boolean;
        dress: Dress;
    }>;
}
