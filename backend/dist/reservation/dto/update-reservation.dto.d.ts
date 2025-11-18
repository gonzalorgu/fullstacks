export declare class UpdateReservationDto {
    status?: "pendiente" | "confirmada" | "cancelada" | "completada";
    fechaInicio?: string;
    fechaFin?: string;
    precioTotal?: number;
    notas?: string;
    estadoPago?: "sin-pago" | "pagado" | "reembolsado";
}
