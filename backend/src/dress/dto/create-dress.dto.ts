import { IsString, IsArray, IsNumber, IsOptional, Min } from "class-validator";

export class CreateDressDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  size?: string[]; // ✅ ARRAY

  @IsOptional()
  @IsString()
  color?: string; // ✅ COLOR PRINCIPAL (mantener)

  // ✅ NUEVO: Array de colores
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[]; // Ejemplo: ['#FFFFFF', '#a24949', '#7fd539']

  @IsOptional()
  @IsString()
  status?: string;

  @IsNumber()
  @Min(0)
  rental_price: number;

  @IsOptional()
  @IsNumber()
  catalog_id?: number;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number; // ✅ CANTIDAD
}
