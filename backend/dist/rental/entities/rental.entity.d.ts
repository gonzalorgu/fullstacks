import { User } from "../../auth/entities/user.entity";
import { Reservation } from "../../reservation/entities/reservation.entity";
export declare class Rental {
    id: string;
    user: User;
    dressId: string;
    dressNombre: string;
    foto: string | null;
    desde: Date;
    hasta: Date;
    precioAlquiler: number;
    talla: string | null;
    color: string | null;
    clienteNombre: string | null;
    clienteEmail: string | null;
    estado: "activo" | "pasado" | "cancelado" | "pendiente";
    createdAt: Date;
    updatedAt: Date;
    reservations: Reservation[];
}
