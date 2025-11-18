export declare class CreateMaintenanceDto {
    dressId: string;
    dressNombre: string;
    foto?: string;
    tipo: "lavado" | "reparacion" | "limpieza_profunda" | "ajuste";
    estado?: "pendiente" | "en_proceso" | "completado" | "cancelado";
    observaciones?: string;
    costo?: number;
    fechaInicio?: string;
    fechaFin?: string;
    cantidad: number;
}
