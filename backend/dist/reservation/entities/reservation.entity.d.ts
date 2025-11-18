import { Rental } from "../../rental/entities/rental.entity";
import { User } from "../../auth/entities/user.entity";
export declare class Reservation {
    id: string;
    rental: Rental;
    user: User;
    status: "pendiente" | "confirmada" | "cancelada" | "completada";
    fechaInicio: Date;
    fechaFin: Date;
    precioTotal: number;
    notas: string | null;
    estadoPago: "sin-pago" | "pagado" | "reembolsado";
    createdAt: Date;
    updatedAt: Date;
}
