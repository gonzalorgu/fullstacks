import { RentalService } from "../rental/rental.service";
import { CreateTransactionDto } from "./dto/createtransactionDto";
interface RequestWithUser extends Request {
    user: {
        id: number;
        userId: number;
        email: string;
        role: string;
    };
}
export declare class TransactionsController {
    private rentalService;
    constructor(rentalService: RentalService);
    createTransaction(data: CreateTransactionDto, req: RequestWithUser): Promise<import("../rental/entities/rental.entity").Rental>;
}
export {};
