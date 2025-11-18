import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
} from "class-validator";

export class CreateMaintenanceDto {
  @IsString()
  dressId: string;

  @IsString()
  dressNombre: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsEnum(["lavado", "reparacion", "limpieza_profunda", "ajuste"])
  tipo: "lavado" | "reparacion" | "limpieza_profunda" | "ajuste";

  @IsOptional()
  @IsEnum(["pendiente", "en_proceso", "completado", "cancelado"])
  estado?: "pendiente" | "en_proceso" | "completado" | "cancelado";

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsNumber()
  costo?: number;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  // --- MODIFICACIÓN REQUERIDA ---
  @IsNumber()
  cantidad: number;
}
