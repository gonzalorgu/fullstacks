import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsEnum,
} from "class-validator";

export class CreateRentalDto {
  @IsString()
  dressId: string;

  @IsString()
  dressNombre: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsDate()
  desde: Date;

  @IsDate()
  hasta: Date;

  @IsNumber()
  precioAlquiler: number;

  @IsOptional()
  @IsString()
  talla?: string;

  @IsOptional()
  @IsString()
  color?: string;

  // ✅ CORREGIDO: Agregar "pendiente"
  @IsOptional()
  @IsEnum(["pendiente", "activo", "pasado", "cancelado"])
  estado?: "pendiente" | "activo" | "pasado" | "cancelado";

  // ✅ AGREGAR CAMPOS FALTANTES
  @IsOptional()
  @IsString()
  clienteNombre?: string;

  @IsOptional()
  @IsString()
  clienteEmail?: string;
}
