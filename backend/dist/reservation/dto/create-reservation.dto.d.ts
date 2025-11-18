export declare class CreateReservationDto {
    rentalId: string;
    userId: number;
    status?: "pendiente" | "confirmada" | "cancelada" | "completada";
    fechaInicio: string;
    fechaFin: string;
    precioTotal: number;
    notas?: string;
    estadoPago?: "sin-pago" | "pagado" | "reembolsado";
}
