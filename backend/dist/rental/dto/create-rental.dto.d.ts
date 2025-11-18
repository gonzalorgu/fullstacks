export declare class CreateRentalDto {
    dressId: string;
    dressNombre: string;
    foto?: string;
    desde: Date;
    hasta: Date;
    precioAlquiler: number;
    talla?: string;
    color?: string;
    estado?: "pendiente" | "activo" | "pasado" | "cancelado";
    clienteNombre?: string;
    clienteEmail?: string;
}
