export declare class CreatePaymentDto {
    amount: number;
    payment_date: string;
    payment_method: string;
    rental_id: string;
    user_id: number;
    reference?: string;
    status?: string;
    receipt_image?: string;
}
