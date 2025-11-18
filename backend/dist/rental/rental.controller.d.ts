import { RentalService } from "../rental/rental.service";
import { Rental } from "../rental/entities/rental.entity";
interface CreateRentalData {
    dressId: string;
    dressNombre: string;
    foto?: string;
    desde: string;
    hasta: string;
    precioAlquiler: number;
    talla?: string;
    color?: string;
    estado?: "activo" | "pasado" | "cancelado" | "pendiente";
    clienteNombre?: string;
    clienteEmail?: string;
}
interface AdminRentalData {
    dressId?: string;
    dressNombre?: string;
    foto?: string;
    desde?: string;
    hasta?: string;
    precioAlquiler?: number;
    talla?: string;
    color?: string;
    estado?: "activo" | "pasado" | "cancelado" | "pendiente" | "confirmado" | "devuelto";
    clienteNombre?: string;
    clienteEmail?: string;
}
interface RequestWithUser extends Request {
    user: {
        userId: number;
        email: string;
        role: string;
    };
}
export declare class RentalController {
    private rentalService;
    constructor(rentalService: RentalService);
    getMyRentals(req: RequestWithUser): Promise<Rental[]>;
    getActiveRentals(req: RequestWithUser): Promise<Rental[]>;
    getPastRentals(req: RequestWithUser): Promise<Rental[]>;
    getPendingRentals(req: RequestWithUser): Promise<Rental[]>;
    getAllRentalsAdmin(req: RequestWithUser): Promise<Rental[]>;
    getRentalById(id: string, req: RequestWithUser): Promise<Rental>;
    createRental(rentalData: CreateRentalData, req: RequestWithUser): Promise<Rental>;
    createPaymentPending(rentalData: CreateRentalData, req: RequestWithUser): Promise<Rental>;
    updateRental(id: string, updates: Partial<Rental>, req: RequestWithUser): Promise<Rental>;
    updateRentalAdmin(id: string, updates: AdminRentalData, req: RequestWithUser): Promise<Rental>;
    cancelRental(id: string, req: RequestWithUser): Promise<{
        message: string;
    }>;
}
export {};
