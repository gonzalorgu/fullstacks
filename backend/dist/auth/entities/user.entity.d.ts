import { Rental } from "../../rental/entities/rental.entity";
import { Payment } from "../../payment/entities/payment.entity";
export declare class User {
    id: number;
    email: string;
    password: string;
    nombre: string;
    role: string;
    telefono: string;
    dni: string;
    fechaNacimiento: string;
    direccion: string;
    isActive: boolean;
    name: string;
    phone: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
    rentals: Rental[];
    payments: Payment[];
}
