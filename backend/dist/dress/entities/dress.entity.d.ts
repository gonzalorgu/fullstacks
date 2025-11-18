import { Catalog } from "../../catalog/entities/catalog.entity";
import { DressImage } from "../../dress-image/entities/dress-image.entity";
export declare class Dress {
    id: number;
    name: string;
    size: string[];
    color: string;
    colors: string[];
    status: string;
    rental_price: number;
    imagen: string;
    description: string;
    quantity: number;
    isActive: boolean;
    catalog: Catalog;
    catalog_id: number;
    created_at: Date;
    update_at: Date;
    images: DressImage[];
}
