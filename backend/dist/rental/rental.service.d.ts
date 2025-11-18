import { Repository } from "typeorm";
import { Rental } from "../rental/entities/rental.entity";
import { User } from "../auth/entities/user.entity";
import { DressService } from "../dress/dress.service";
import { NotificationsGateway } from "../notifications/notifications.gateway";
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
export declare class RentalService {
    private rentalRepository;
    private userRepository;
    private dressService;
    private notificationsGateway;
    constructor(rentalRepository: Repository<Rental>, userRepository: Repository<User>, dressService: DressService, notificationsGateway: NotificationsGateway);
    getMyRentals(userId: number): Promise<Rental[]>;
    getActiveRentals(userId: number): Promise<Rental[]>;
    getPastRentals(userId: number): Promise<Rental[]>;
    getPendingRentals(userId: number): Promise<Rental[]>;
    getRentalById(id: string, userId: number): Promise<Rental>;
    createRental(userId: number, rentalData: CreateRentalData): Promise<Rental>;
    createPaymentPending(userId: number, rentalData: CreateRentalData): Promise<Rental>;
    updateRental(id: string, userId: number, updates: Partial<Rental>, isAdmin?: boolean): Promise<Rental>;
    cancelRental(id: string, userId: number, isAdmin?: boolean): Promise<{
        message: string;
    }>;
    getAllRentalsAdmin(): Promise<Rental[]>;
}
export {};
