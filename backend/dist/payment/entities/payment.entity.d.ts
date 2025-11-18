import { User } from "../../auth/entities/user.entity";
export declare class Payment {
    id: string;
    amount: number;
    payment_date: string;
    payment_method: string;
    rental_id: string;
    user_id: number;
    reference: string;
    status: string;
    receipt_image: string;
    created_at: Date;
    user: User;
}
