import { Dress } from "../../dress/entities/dress.entity";
export declare class DressImage {
    id: number;
    dress: Dress;
    dress_id: number;
    image_url: string;
    is_main: boolean;
    uploaded_at: Date;
}
