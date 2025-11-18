import { User } from "../../auth/entities/user.entity";
export type TipoMantenimiento = "lavado" | "reparacion" | "limpieza_profunda" | "ajuste";
export type EstadoMantenimiento = "pendiente" | "en_proceso" | "completado" | "cancelado";
export declare class Maintenance {
    id: string;
    dressId: string;
    dressNombre: string;
    foto: string | null;
    cantidad: number;
    tipo: TipoMantenimiento;
    estado: EstadoMantenimiento;
    observaciones: string | null;
    costo: number | null;
    fechaInicio: Date | null;
    fechaFin: Date | null;
    user: User;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}
