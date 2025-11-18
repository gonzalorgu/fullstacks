import { Dress } from "../../dress/entities/dress.entity";
export declare class Catalog {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    dresses: Dress[];
}
